import type { listable } from "@arktype/util"
import type { Out } from "arktype/internal/parser/tuple.js"
import type { BasisInput } from "./constraints/basis.js"
import type {
	IntersectionInput,
	IntersectionNode,
	parseIntersection,
	validateIntersectionInput
} from "./intersection.js"
import { compileSerializedValue } from "./io/compile.js"
import type { TraversalState } from "./io/traverse.js"
import type { BaseAttributes } from "./type.js"
import { TypeNode } from "./type.js"

export type MorphSchema = BaseAttributes & {
	in: IntersectionNode
	out: IntersectionNode
	morphs: readonly Morph[]
}

export type Morph<i = any, o = unknown> = (In: i, state: TraversalState) => o

export type MorphInput = BaseAttributes & {
	in?: IntersectionInput
	out?: IntersectionInput
	morphs: listable<Morph>
}

export class MorphNode<i = any, o = unknown> extends TypeNode<
	(In: i) => Out<o>,
	MorphSchema
> {
	readonly kind = "morph"

	protected constructor(schema: MorphSchema) {
		super(schema)
	}

	inId = this.in.inId
	outId = this.out.outId
	typeId = JSON.stringify({
		in: this.in.typeId,
		out: this.out.typeId,
		morphs: this.morphs.map((morph) => compileSerializedValue(morph))
	})

	branches = [this]

	writeDefaultDescription() {
		return ""
	}
}

export type validateMorphInput<input> = {
	[k in keyof input]: k extends "in" | "out"
		? validateIntersectionInput<input[k]>
		: k extends keyof MorphInput
		? MorphInput[k]
		: `'${k & string}' is not a valid morph schema key`
}

export type parseMorph<input> = input extends MorphInput
	? MorphNode<
			input["in"] extends {}
				? parseIntersection<input["in"]>["infer"]
				: unknown,
			input["out"] extends {}
				? parseIntersection<input["out"]>["infer"]
				: input["morphs"] extends Morph<any, infer o>
				? o
				: input["morphs"] extends readonly [
						...unknown[],
						infer tail extends Morph
				  ]
				? ReturnType<tail>
				: never
	  >
	: never
