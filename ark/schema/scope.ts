import {
	entriesOf,
	hasDomain,
	includes,
	isArray,
	printable,
	throwParseError,
	transform,
	type Dict
} from "@arktype/util"
import {
	BaseNode,
	type BaseAttachments,
	type Node,
	type UnknownNode
} from "./base.js"
import { maybeGetBasisKind } from "./bases/basis.js"
import type {
	instantiateAliases,
	instantiateSchemaBranches,
	validateAliases,
	validateSchemaBranch
} from "./inference.js"
import type { BranchKind } from "./sets/union.js"
import {
	defaultInnerKeySerializer,
	refinementKinds,
	typeKinds,
	type NodeKind,
	type SchemaParseContext,
	type SchemaParseContextInput,
	type TypeKind,
	type UnknownNodeImplementation
} from "./shared/define.js"
import {
	NodeImplementationByKind,
	type Definition,
	type NormalizedDefinition,
	type reducibleKindOf
} from "./shared/nodes.js"
import { isNode } from "./shared/registry.js"
import { TypeNode, type Schema } from "./type.js"

export type nodeResolutions<resolutions> = { [k in keyof resolutions]: Schema }

export class ScopeNode<r extends nodeResolutions<r> = any> {
	declare infer: {
		[k in keyof r]: r[k]["infer"]
	}
	private declare static unknownUnion: TypeNode<"union", unknown>
	resolutions = {} as r

	private constructor(aliases: Dict<string, Definition<TypeKind>>) {
		this.resolutions = transform(aliases, ([k, v]) => [
			k,
			this.typeFromKinds(typeKinds, v)
		]) as never
		if (ScopeNode.root && !ScopeNode.unknownUnion) {
			// ensure root has been set before parsing this to avoid a circularity
			ScopeNode.unknownUnion = this.prereduced("union", [
				"string",
				"number",
				"object",
				"bigint",
				"symbol",
				{ unit: true },
				{ unit: false },
				{ unit: null },
				{ unit: undefined }
			])
		}
	}

	static from = <const aliases>(aliases: validateAliases<aliases>) =>
		new ScopeNode<instantiateAliases<aliases>>(aliases as never)

	static root = new ScopeNode<{}>({})

	union<const branches extends readonly Definition<BranchKind>[]>(
		input: {
			branches: {
				[i in keyof branches]: validateSchemaBranch<branches[i], r>
			}
		} & NormalizedDefinition<"union">
	): instantiateSchemaBranches<branches> {
		return this.node("union", input, { scope: this }) as never
	}

	branches<const branches extends readonly Definition<BranchKind>[]>(
		...branches: {
			[i in keyof branches]: validateSchemaBranch<branches[i], r>
		}
	): instantiateSchemaBranches<branches> {
		return this.node("union", branches as never) as never
	}

	units<const branches extends readonly unknown[]>(
		...values: branches
	): branches["length"] extends 1
		? Node<"unit", branches[0]>
		: Node<"union" | "unit", branches[number]> {
		const uniqueValues: unknown[] = []
		for (const value of values) {
			if (!uniqueValues.includes(value)) {
				uniqueValues.push(value)
			}
		}
		const branches = uniqueValues.map((unit) =>
			this.prereduced("unit", { unit })
		)
		if (branches.length === 1) {
			return branches[0]
		}
		return this.prereduced("union", {
			branches
		}) as never
	}

	prereduced<kind extends TypeKind>(
		kind: kind,
		input: Definition<kind>
	): Node<kind> {
		return this.node(kind, input, {
			prereduced: true
		}) as never
	}

	typeFromKinds<defKind extends TypeKind>(
		allowedKinds: readonly defKind[],
		input: unknown
	): Node<reducibleKindOf<defKind>> {
		const kind = schemaKindOf(input)
		if (!allowedKinds.includes(kind as never)) {
			return throwParseError(
				`Schema of kind ${kind} should be one of ${allowedKinds}`
			)
		}
		return this.node(kind, input as never, {}) as never
	}

	static parseCache: Record<string, Node> = {}

	node<defKind extends NodeKind>(
		kind: defKind,
		input: Definition<defKind>,
		ctxInput?: SchemaParseContextInput
	): Node<reducibleKindOf<defKind>> {
		if (isNode(input)) {
			return input as never
		}
		const implementation: UnknownNodeImplementation = NodeImplementationByKind[
			kind
		] as never
		const inner: Record<string, unknown> = {}
		const normalizedInput: any = implementation.normalize?.(input) ?? input
		const ctx: SchemaParseContext<any> = {
			...ctxInput,
			input: normalizedInput,
			scope: this
		}
		implementation.addContext?.(ctx)
		const schemaEntries = entriesOf(normalizedInput).sort((l, r) =>
			l[0] < r[0] ? -1 : 1
		)
		let json: Record<string, unknown> = {}
		let typeJson: Record<string, unknown> = {}
		const children: UnknownNode[] = []
		for (const [k, v] of schemaEntries) {
			const keyDefinition = implementation.keys[k]
			if (!(k in implementation.keys)) {
				return throwParseError(`Key ${k} is not valid on ${kind} schema`)
			}
			const innerValue = keyDefinition.parse ? keyDefinition.parse(v, ctx) : v
			if (innerValue === undefined && !keyDefinition.preserveUndefined) {
				continue
			}
			inner[k] = innerValue
			if (keyDefinition.child) {
				if (Array.isArray(innerValue)) {
					json[k] = innerValue.map((node) => node.collapsibleJson)
					children.push(...innerValue)
				} else {
					json[k] = innerValue.collapsibleJson
					children.push(innerValue)
				}
			} else {
				json[k] = keyDefinition.serialize
					? keyDefinition.serialize(v)
					: defaultInnerKeySerializer(v)
			}
			if (!keyDefinition.meta) {
				typeJson[k] = json[k]
			}
		}
		if (!ctx.prereduced) {
			if (implementation.reduce) {
				const reduced = implementation.reduce(inner, ctx)
				if (reduced) {
					return reduced as never
				}
			}
		}
		const innerEntries = entriesOf(inner)
		let collapsibleJson = json
		if (
			innerEntries.length === 1 &&
			innerEntries[0][0] === implementation.collapseKey
		) {
			collapsibleJson = json[implementation.collapseKey] as never
			if (hasDomain(collapsibleJson, "object")) {
				json = collapsibleJson
				typeJson = collapsibleJson
			}
		}
		const id = kind + JSON.stringify(json)
		if (id in ScopeNode.parseCache) {
			return ScopeNode.parseCache[id] as never
		}
		const typeId = kind + JSON.stringify(typeJson)
		if (ScopeNode.unknownUnion?.typeId === typeId) {
			return this.prereduced("intersection", {}) as never
		}
		const attachments = {
			kind,
			inner,
			entries: innerEntries,
			json,
			typeJson,
			collapsibleJson,
			children,
			id,
			typeId,
			scope: this
		} satisfies Record<keyof BaseAttachments<any>, unknown>
		return includes(refinementKinds, kind)
			? new (BaseNode as any)(attachments)
			: new (TypeNode as any)(attachments)
	}

	readonly schema = Object.assign(this.branches.bind(this), {
		units: this.units.bind(this),
		union: this.union.bind(this),
		prereduced: this.prereduced.bind(this)
	})
}

export const rootSchema = ScopeNode.root.schema

export const rootNode = ScopeNode.root.node

const schemaKindOf = (input: unknown): TypeKind => {
	const basisKind = maybeGetBasisKind(input)
	if (basisKind) {
		return basisKind
	}
	if (typeof input === "object" && input !== null) {
		if (isNode(input)) {
			if (input.isSchema()) {
				return input.kind
			}
			// otherwise, error at end of function
		} else if ("morph" in input) {
			return "morph"
		} else if ("branches" in input || isArray(input)) {
			return "union"
		} else {
			return "intersection"
		}
	}
	return throwParseError(`${printable(input)} is not a valid type schema`)
}
