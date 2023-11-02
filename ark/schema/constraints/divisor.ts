import { BaseNode, type declareNode, type withAttributes } from "../base.js"
import type { BasisKind } from "../bases/basis.js"
import { type DomainNode } from "../bases/domain.js"
import { builtins } from "../builtins.js"
import { type Node } from "../nodes.js"
import { getBasisName } from "./shared.js"

export type DivisorSchema = number | DivisorInner

export type DivisorInner = withAttributes<{
	readonly divisor: number
}>

export type DivisorDeclaration = declareNode<{
	kind: "divisor"
	schema: DivisorSchema
	inner: DivisorInner
	intersections: {
		divisor: "divisor"
	}
	class: typeof DivisorNode
}>

export class DivisorNode extends BaseNode<DivisorDeclaration> {
	static readonly kind = "divisor"
	static readonly declaration: DivisorDeclaration

	// TODO: can remove?
	static {
		this.classesByKind.divisor = this
	}

	static readonly definition = this.define({
		kind: "divisor",
		keys: {
			divisor: "in"
		},
		intersections: {
			divisor: (l, r) => ({
				divisor: Math.abs(
					(l.divisor * r.divisor) / greatestCommonDivisor(l.divisor, r.divisor)
				)
			})
		},
		parse: (schema) =>
			typeof schema === "number" ? { divisor: schema } : schema,
		compileCondition: (inner) => `${this.argName} % ${inner.divisor} === 0`,
		writeDefaultDescription: (inner) =>
			inner.divisor === 1 ? "an integer" : `a multiple of ${inner.divisor}`
	})

	static basis: DomainNode<number> = builtins().number

	static writeInvalidBasisMessage(basis: Node<BasisKind> | undefined) {
		return writeIndivisibleMessage(getBasisName(basis))
	}
}

// https://en.wikipedia.org/wiki/Euclidean_algorithm
const greatestCommonDivisor = (l: number, r: number) => {
	let previous: number
	let greatestCommonDivisor = l
	let current = r
	while (current !== 0) {
		previous = current
		current = greatestCommonDivisor % current
		greatestCommonDivisor = previous
	}
	return greatestCommonDivisor
}

export const writeIndivisibleMessage = <root extends string>(
	root: root
): writeIndivisibleMessage<root> =>
	`Divisibility operand ${root} must be a number`

export type writeIndivisibleMessage<root extends string> =
	`Divisibility operand ${root} must be a number`
