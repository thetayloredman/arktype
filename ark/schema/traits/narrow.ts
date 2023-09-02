import { compileSerializedValue } from "../io/compile.js"
import type { TraversalState } from "../main.js"
import { composeConstraint } from "./constraint.js"
import type { DomainConstraint, NonEnumerableDomain } from "./domain.js"
import type { PropConstraint } from "./prop.js"
import type { PrototypeConstraint } from "./prototype.js"

export class NarrowConstraint extends composeConstraint<Narrow>((l, r) => [
	l,
	r
]) {
	readonly kind = "narrow"

	hash(): string {
		return compileSerializedValue(this.rule)
	}

	writeDefaultDescription() {
		return `valid according to ${this.rule.name}`
	}
}

export class Narrowable {
	constructor(rule: {
		basis: DomainConstraint | PrototypeConstraint | undefined
		narrows?: readonly NarrowConstraint[]
	}) {}
}

// TODO: allow changed order to be the same type

// as long as the narrows in l and r are individually safe to check
// in the order they're specified, checking them in the order
// resulting from this intersection should also be safe.

export type Narrow<data = any> = (
	data: data,
	traversal: TraversalState
) => boolean

export type NarrowCast<data = any, narrowed extends data = data> = (
	data: data
) => data is narrowed

export type inferNarrow<In, predicate> = predicate extends (
	data: any,
	...args: any[]
) => data is infer narrowed
	? narrowed
	: In
