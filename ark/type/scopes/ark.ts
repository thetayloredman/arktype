import type { Module, ScopeParser } from "../scope.js"
import { Scope } from "../scope.js"
import type {
	DeclarationParser,
	DefinitionParser,
	TypeParser
} from "../type.js"
import type { InferredJsObjects } from "./jsObjects.js"
import { jsObjectTypes } from "./jsObjects.js"
import { type InferredTsGenerics, tsGenericTypes } from "./tsGenerics.js"
import type { InferredTsKeywords } from "./tsKeywords.js"
import { tsKeywordTypes } from "./tsKeywords.js"
import type { InferredValidation } from "./validation/validation.js"
import { validationTypes } from "./validation/validation.js"

/** Root scopes can be inferred automatically from node definitions, but
 * explicitly typing them can improve responsiveness */
export type RootScope<exports> = Scope<{
	exports: exports
	locals: {}
	ambient: {}
}>

export type ArkResolutions = { exports: Ark; locals: {}; ambient: Ark }

export const ark: Scope<ArkResolutions> = Scope.root({
	...tsKeywordTypes,
	...jsObjectTypes,
	...validationTypes,
	// again, unfortunately TS won't handle comparing generics well here, so we
	// have to cast. that said, since each individual root scope is checked,
	// this is low risk
	...tsGenericTypes
}).toAmbient() as never

export const arktypes: Module<ArkResolutions> = ark.export()

// this type is redundant with the inferred definition of ark but allow types
// derived from the default scope to be calulated more efficiently
export interface Ark
	extends InferredTsKeywords,
		InferredJsObjects,
		InferredValidation,
		InferredTsGenerics {}

export const scope: ScopeParser<{}, Ark> = ark.scope as never

export const type: TypeParser<Ark> = ark.type

export const define: DefinitionParser<Ark> = ark.define

export const declare: DeclarationParser<Ark> = ark.declare