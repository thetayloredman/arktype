import { domainOf, stringify } from "@arktype/util"
import type { UniversalAttributes } from "../attributes/attribute.js"
import { TypeNode } from "../type.js"

export class UnitNode extends TypeNode {
	constructor(
		public value: unknown,
		attributes: UniversalAttributes = {}
	) {
		super(attributes)
	}

	readonly domain = domainOf(this.value)
	readonly id = stringify(this.value)

	writeDefaultDescription() {
		// TODO: add reference to for objects
		return this.id
	}
}
