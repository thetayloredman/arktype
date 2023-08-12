import type { Orthogonal } from "../type.js"
import { orthogonal } from "../type.js"
import { ConstraintSet } from "./constraint.js"

type PatternIntersection = readonly PatternConstraint<RegExp>[]

export class PatternConstraint<
	rule extends RegExp | PatternIntersection = RegExp | PatternIntersection
> extends ConstraintSet<{
	leaf: RegExp
	intersection: PatternIntersection
	disjoinable: false
}> {
	readonly kind = "pattern"
	readonly literal = `${this.rule}` as `/${string}/${string}`

	writeDefaultDescription() {
		// don't use this.literal here since it may not have been initialized
		return `matched by ${this.rule}`
	}

	intersectMembers(): Orthogonal {
		return orthogonal
	}
}

// converting a regex to a string alphabetizes the flags for us
export const serializeRegex = (regex: RegExp) =>
	`${regex}` as SerializedRegexLiteral

export type SerializedRegexLiteral = `/${string}/${string}`

export const sourceFromRegexLiteral = (literal: SerializedRegexLiteral) =>
	literal.slice(1, literal.lastIndexOf("/"))
