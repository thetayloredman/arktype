import type { TypeNode, TypeSchema } from "../../base.js"
import type { CompilationContext, Problems } from "../../shared/compilation.js"
import type { declareNode, withAttributes } from "../../shared/declare.js"
import type {
	NodeKeyImplementation,
	NodeParserImplementation
} from "../../shared/define.js"
import type { Disjoint } from "../../shared/disjoint.js"
import type { NodeIntersections } from "../../shared/intersect.js"
import { RefinementNode } from "../shared.js"

export type SequenceSchema = withAttributes<{
	readonly prefix?: readonly TypeSchema[]
	readonly element: TypeSchema
	readonly postfix?: readonly TypeSchema[]
}>

export type SequenceDeclaration = declareNode<{
	kind: "sequence"
	schema: SequenceSchema
	inner: SequenceInner
	intersections: {
		sequence: "sequence" | Disjoint | null
	}
	checks: readonly unknown[]
}>

export type SequenceInner = {
	// a list of fixed position elements starting at index 0 (undefined equivalent to [])
	readonly prefix?: readonly TypeNode[]
	// the variadic element
	readonly element: TypeNode
	// a list of fixed position elements, the last being the last element of the array (undefined equivalent to [])
	readonly postfix?: readonly TypeNode[]
}

const fixedSequenceKeyDefinition: NodeKeyImplementation<
	SequenceDeclaration,
	"prefix" | "postfix"
> = {
	child: true,
	parse: (schema, ctx) =>
		schema.length === 0
			? // omit empty affixes
			  undefined
			: schema.map((element) => ctx.scope.parseTypeNode(element))
}

export class SequenceNode extends RefinementNode<SequenceDeclaration> {
	static parser: NodeParserImplementation<SequenceDeclaration> = {
		keys: {
			prefix: fixedSequenceKeyDefinition,
			element: {
				child: true,
				parse: (schema, ctx) => ctx.scope.parseTypeNode(schema)
			},
			postfix: fixedSequenceKeyDefinition
		},
		normalize: (schema) => schema,
		reduce: (inner, meta, scope) => {
			if (!inner.postfix) {
				return
			}
			const postfix = inner.postfix.slice()
			const prefix = inner.prefix?.slice() ?? []
			while (postfix[0]?.equals(inner.element)) {
				prefix.push(postfix.shift()!)
			}
			if (postfix.length < inner.postfix.length) {
				return scope.parsePrereduced("sequence", {
					...meta,
					...inner,
					// empty lists will be omitted during normalization
					prefix,
					postfix
				})
			}
		}
	}

	static intersections: NodeIntersections<SequenceDeclaration> = {
		sequence: (l) => l
	}

	prefixLength = this.prefix?.length ?? 0
	postfixLength = this.postfix?.length ?? 0
	protected minLength = this.prefixLength + this.postfixLength

	traverseAllows = (data: readonly unknown[], problems: Problems) => {
		if (data.length < this.minLength) {
			return false
		}

		let i = 0

		if (this.prefix) {
			for (i; i < this.prefixLength; i++) {
				if (!this.prefix[i].traverseAllows(data[i], problems)) {
					return false
				}
			}
		}

		const postfixStartIndex = data.length - this.postfixLength

		for (i; i++; i < postfixStartIndex) {
			if (!this.element.traverseAllows(data[i], problems)) {
				return false
			}
		}

		if (this.postfix) {
			for (i; i < data.length; i++) {
				if (!this.postfix[i].traverseAllows(data[i], problems)) {
					return false
				}
			}
		}
		return true
	}

	traverseApply = (data: readonly unknown[], problems: Problems) => {
		if (data.length < this.minLength) {
			// TODO: possible to unify with minLength?
			problems.add(`at least length ${this.minLength}`)
			return
		}

		let i = 0

		if (this.prefix) {
			for (i; i < this.prefixLength; i++) {
				this.prefix[i].traverseAllows(data[i], problems)
			}
		}

		const postfixStartIndex = data.length - this.postfixLength

		for (i; i++; i < postfixStartIndex) {
			this.element.traverseAllows(data[i], problems)
		}

		if (this.postfix) {
			for (i; i < data.length; i++) {
				this.postfix[i].traverseAllows(data[i], problems)
			}
		}
	}

	getCheckedDefinitions() {
		return [Array] as const
	}

	writeDefaultDescription() {
		const parts = this.prefix?.map(String) ?? []
		parts.push(`zero or more elements containing ${this.element}`)
		this.postfix?.forEach((node) => parts.push(String(node)))
		return `An array of ${parts.join(" followed by ")}`
	}

	compileBody(ctx: CompilationContext): string {
		return ""
	}
}

// const arrayIndexSourceSuffix = `(?:0|(?:[1-9]\\d*))$`

// const arrayIndexLiteralSuffix = `${arrayIndexSourceSuffix}/` as const

// export type ArrayIndexMatcherSource =
// 	`${string}${typeof arrayIndexSourceSuffix}`

// const excludedIndexMatcherStart = "^(?!("
// const excludedIndexMatcherEnd = ")$)"

// // Build a pattern to exclude all indices from firstVariadic - 1 down to 0
// const excludedIndicesSource = (firstVariadic: number) => {
// 	if (firstVariadic < 1) {
// 		return throwInternalError(
// 			`Unexpectedly tried to create a variadic index < 1 (was ${firstVariadic})`
// 		)
// 	}
// 	let excludedIndices = `${firstVariadic - 1}`
// 	for (let i = firstVariadic - 2; i >= 0; i--) {
// 		excludedIndices += `|${i}`
// 	}
// 	return `${excludedIndexMatcherStart}${excludedIndices}${excludedIndexMatcherEnd}${arrayIndexSourceSuffix}` as const
// }

// export type VariadicIndexMatcherSource = ReturnType<
// 	typeof excludedIndicesSource
// >

// export type VariadicIndexMatcherLiteral = `/${VariadicIndexMatcherSource}/`

// const nonVariadicIndexMatcherSource = `^${arrayIndexSourceSuffix}` as const

// export type NonVariadicIndexMatcherSource = typeof nonVariadicIndexMatcherSource

// export type NonVariadicIndexMatcherLiteral =
// 	`/${NonVariadicIndexMatcherSource}/`

// export const arrayIndexMatcherSource = <index extends number>(
// 	firstVariadic: index
// ) =>
// 	(firstVariadic === 0
// 		? // If the variadic pattern starts at index 0, return the base array index matcher
// 		  nonVariadicIndexMatcherSource
// 		: excludedIndicesSource(firstVariadic)) as index extends 0
// 		? NonVariadicIndexMatcherSource
// 		: VariadicIndexMatcherSource

// export const extractArrayIndexRegex = (keyNode: TypeNode) => {
// 	if (keyNode.branches.length !== 1) {
// 		return
// 	}
// 	const regexRefinements = keyNode.branches[0].regex
// 	if (!regexRefinements || regexRefinements.length !== 1) {
// 		return
// 	}
// 	const regexLiteral = regexRefinements[0].rule
// 	if (!regexLiteral.endsWith(arrayIndexLiteralSuffix)) {
// 		return
// 	}
// 	return sourceFromRegexLiteral(regexLiteral) as ArrayIndexMatcherSource
// }

// export const extractFirstVariadicIndex = (source: ArrayIndexMatcherSource) => {
// 	if (!source.startsWith(excludedIndexMatcherStart)) {
// 		return 0
// 	}
// 	const excludedIndices = source.slice(
// 		excludedIndexMatcherStart.length,
// 		source.indexOf(excludedIndexMatcherEnd)
// 	)
// 	const firstExcludedIndex = excludedIndices.split("|")[0]
// 	return (
// 		tryParseWellFormedInteger(
// 			firstExcludedIndex,
// 			`Unexpectedly failed to parse a variadic index from ${source}`
// 		) + 1
// 	)
// }

// export const arrayIndexInput = <index extends number = 0>(
// 	firstVariadicIndex: index = 0 as index
// ) =>
// 	({
// 		basis: "string",
// 		regex: `/${arrayIndexMatcherSource(firstVariadicIndex)}/`
// 		// TODO: reenable
// 	}) as const // satisfies PredicateInput<"string">

// export const arrayIndexTypeNode = (firstVariadicIndex = 0): TypeNode<string> =>
// 	firstVariadicIndex === 0
// 		? builtins.nonVariadicArrayIndex()
// 		: node(arrayIndexInput(firstVariadicIndex))

// export const compileArray = (
// 	indexMatcher: ArrayIndexMatcherSource,
// 	elementNode: TypeNode,
// 	namedProps: readonly NamedPropRule[],
// 	ctx: CompilationContext
// ) => {
// 	const firstVariadicIndex = extractFirstVariadicIndex(indexMatcher)
// 	const namedCheck = namedProps
// 		.map((named) => compileNamedProp(named, ctx))
// 		.join("\n")
// 	ctx.path.push(["i"])
// 	const elementCondition = `${elementNode.alias}(${In}[i])`
// 	ctx.path.pop()
// 	return `${namedCheck}
// for(let i = ${firstVariadicIndex}; i < ${In}.length; i++) {
//     ${elementCondition}
// }`
// }

// export const compileIndexed = (
// 	namedProps: readonly NamedPropRule[],
// 	indexedProps: readonly IndexedPropRule[],
// 	ctx: CompilationContext
// ) => {
// 	const k = ctx.path.push(["k"])
// 	const indexedChecks = indexedProps
// 		.map((prop) =>
// 			prop.key === builtins.string()
// 				? // if the index signature is just for "string", we don't need to check it explicitly
// 				  prop.value.compile(ctx)
// 				: // Ensure condition is checked on the key variable as opposed to the input
// 				  // TODO: fix ${prop.key.condition.replaceAll(InputParameterName, k)}
// 				  `if(false){
//     ${prop.value.compile(ctx)}
// }`
// 		)
// 		.join("\n")
// 	ctx.path.pop()
// 	if (ctx) {
// 		return throwInternalError(`Unimplemented?`)
// 	}
// 	// TODO: don't recheck named
// 	return `${compileNamedProps(namedProps, ctx)}
//     for(const ${k} in ${In}) {
//         ${indexedChecks}
//     }
// `
// }
