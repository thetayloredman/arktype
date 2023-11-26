import {
	wellFormedIntegerMatcher,
	wellFormedNumberMatcher
} from "@arktype/util"
import type { Schema } from "../schema.js"
import type { Out } from "../sets/morph.js"
import { Space, rootSchema } from "../space.js"
import { parsedDate } from "./utils/date.js"

const number = rootSchema({
	in: {
		basis: "string",
		pattern: wellFormedNumberMatcher,
		description: "a well-formed numeric string"
	},
	morph: (s: string) => parseFloat(s)
})

const integer = rootSchema({
	in: {
		basis: "string",
		pattern: wellFormedIntegerMatcher
	},
	morph: (s: string) => {
		// if (!isWellFormedInteger(s)) {
		// 	return problems.mustBe("a well-formed integer string")
		// }
		// const parsed = parseInt(s)
		// return Number.isSafeInteger(parsed)
		// 	? parsed
		// 	: problems.mustBe(
		// 			"an integer in the range Number.MIN_SAFE_INTEGER to Number.MAX_SAFE_INTEGER"
		// 	  )
		return parseInt(s)
	}
})

const url = rootSchema({
	in: {
		basis: "string",
		description: "a valid URL"
	},
	morph: (s: string) => {
		return new URL(s)
		// try {
		// 	return new URL(s)
		// } catch {
		// 	return state.mustBe("a valid URL", s, state.basePath)
		// }
	}
})

const json = rootSchema({
	in: {
		basis: "string",
		description: "a JSON-parsable string"
	},
	morph: (s: string): unknown => JSON.parse(s)
})

const date = parsedDate

export namespace Parsing {
	export interface resolutions {
		url: Schema<(In: string) => Out<URL>, "morph">
		number: Schema<(In: string) => Out<number>, "morph">
		integer: Schema<(In: string) => Out<number>, "morph">
		date: Schema<(In: string) => Out<Date>, "morph">
		json: Schema<(In: string) => Out<unknown>, "morph">
	}

	export type infer = (typeof Parsing)["infer"]
}

export const Parsing: Space<Parsing.resolutions> = Space.from({
	url,
	number,
	integer,
	date,
	json
})
