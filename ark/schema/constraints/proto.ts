import type { AbstractableConstructor, conform } from "@arktype/util"
import {
	constructorExtends,
	getExactBuiltinConstructorName,
	Hkt,
	objectKindDescriptions
} from "@arktype/util"
import { Disjoint } from "../disjoint.js"
import { compileSerializedValue } from "../io/compile.js"
import { type BaseChildren } from "../node.js"
import type { ConstraintNode } from "./constraint.js"
import { BaseConstraint, constraintParser } from "./constraint.js"

export interface ProtoChildren<
	constructor extends AbstractableConstructor = AbstractableConstructor
> extends BaseChildren {
	proto: constructor
}

export type ProtoInput<
	constructor extends AbstractableConstructor = AbstractableConstructor
> = constructor | ProtoChildren<constructor>

export class ProtoNode<
	children extends ProtoChildren = ProtoChildren
> extends BaseConstraint<children> {
	readonly kind = "proto"

	declare infer: InstanceType<children["proto"]>

	protected constructor(schema: children) {
		super(schema)
	}

	static hkt = new (class extends Hkt {
		f = (input: conform<this[Hkt.key], ProtoInput>) => {
			return new ProtoNode<
				typeof input extends ProtoInput<infer constructor>
					? { proto: constructor }
					: never
			>(typeof input === "function" ? { proto: input } : (input as any))
		}
	})()

	static from = constraintParser(this)

	protected possibleObjectKind = getExactBuiltinConstructorName(this.proto)

	hash() {
		return this.possibleObjectKind ?? compileSerializedValue(this.proto)
	}

	writeDefaultDescription() {
		return this.possibleObjectKind
			? objectKindDescriptions[this.possibleObjectKind]
			: `an instance of ${this.proto}`
	}

	extendsOneOf<constructors extends readonly AbstractableConstructor[]>(
		...constructors: constructors
	): this is ProtoNode<{ proto: constructors[number] }> {
		return constructors.some((constructor) =>
			constructorExtends(this.proto, constructor)
		)
	}

	intersectSymmetric(other: ConstraintNode) {
		return other.kind !== "proto"
			? null
			: constructorExtends(this.proto, other.proto)
			? this.children
			: constructorExtends(other.proto, this.proto)
			? // this cast is safe since we know other's constructor extends this one
			  (other.children as children)
			: Disjoint.from("proto", this, other)
	}

	intersectAsymmetric() {
		return null
	}
}

// readonly literalKeys = prototypeKeysOf(this.rule.prototype)

// compile() {
// 	return `${In} instanceof ${
// 		getExactBuiltinConstructorName(this.rule) ??
// 		registry().register(this.rule)
// 	}`
// }