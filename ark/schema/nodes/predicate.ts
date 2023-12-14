import type { CompilationContext } from "../scope.js"
import type { TraversalContext } from "../shared/context.js"
import type { declareNode, withAttributes } from "../shared/declare.js"
import type { NodeParserImplementation } from "../shared/define.js"
import type { ArkErrors } from "../shared/errors.js"
import type { NodeIntersections } from "../shared/intersect.js"
import { compileSerializedValue } from "../shared/registry.js"
import { BasePrimitiveRefinement } from "./refinement.js"

export type PredicateInner<predicate extends Predicate<any> = Predicate<any>> =
	{
		readonly predicate: predicate
	}

export type NormalizedPredicateSchema = withAttributes<PredicateInner>

export type PredicateSchema = NormalizedPredicateSchema | Predicate<any>

export type PredicateDeclaration = declareNode<{
	kind: "predicate"
	schema: PredicateSchema
	normalizedSchema: NormalizedPredicateSchema
	inner: PredicateInner
	intersections: {
		predicate: "predicate" | null
	}
	data: unknown
}>

// TODO: If node contains a predicate reference that doesn't take 1 arg, we need
// to wrap it with traversal state for allows

export class PredicateNode extends BasePrimitiveRefinement<PredicateDeclaration> {
	static parser: NodeParserImplementation<PredicateDeclaration> = {
		collapseKey: "predicate",
		keys: {
			predicate: {}
		},
		normalize: (schema) =>
			typeof schema === "function" ? { predicate: schema } : schema
	}

	static writeDefaultDescription(node: PredicateNode) {
		return `valid according to ${node.predicate.name}`
	}

	static intersections: NodeIntersections<PredicateDeclaration> = {
		// TODO: allow changed order to be the same type
		// as long as the narrows in l and r are individually safe to check
		// in the order they're specified, checking them in the order
		// resulting from this intersection should also be safe.
		predicate: () => null
	}

	readonly hasOpenIntersection = true
	traverseAllows = this.predicate
	condition = `${compileSerializedValue(this.predicate)}(${this.scope.argName})`
	negatedCondition = `!${this.condition}`

	getCheckedDefinitions() {
		return [{}] as const
	}

	compileBody(ctx: CompilationContext) {
		return this.scope.compilePrimitive(this, ctx)
	}
}

export type Predicate<data = unknown> = (
	data: data,
	ctx: TraversalContext
) => boolean

export type PredicateCast<input = never, narrowed extends input = input> = (
	input: input,
	errors: ArkErrors
) => input is narrowed

export type inferNarrow<In, predicate> = predicate extends (
	data: any,
	...args: any[]
) => data is infer narrowed
	? narrowed
	: In
