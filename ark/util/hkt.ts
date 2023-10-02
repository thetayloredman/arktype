import type { Fn } from "./functions.js"
import type { conform } from "./generics.js"

export declare abstract class Hkt<f extends Fn = Fn> {
	readonly [Hkt.key]: unknown
	abstract f: f
}

export const reify = <def extends Hkt>(def: def) => def.f as reify<def>

export type reify<hkt extends Hkt> = hkt & {
	<In extends Parameters<hkt["f"]>[0]>(In: In): Hkt.apply<hkt, In>
}

/** A small set of HKT utility types based on https://github.com/poteat/hkt-toolbelt */
export namespace Hkt {
	export declare const key: unique symbol

	export type key = typeof key

	export type apply<
		hkt extends Hkt,
		args extends Parameters<hkt["f"]>[0]
	> = ReturnType<
		(hkt & {
			readonly [key]: args
		})["f"]
	>

	export interface Reify extends Hkt {
		f(In: conform<this[key], Hkt>): reify<typeof In>
	}
}