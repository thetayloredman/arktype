export class InternalArktypeError extends Error {}

export const throwInternalError = (message: string) => {
	throw new InternalArktypeError(message)
}

export class ParseError extends Error {}

export const throwParseError = (message: string) => {
	throw new ParseError(message)
}

// Using "Hair Space" as a non-rendered sentinel for an error message string:
// https://www.compart.com/en/unicode/U+200A
// eslint-disable-next-line no-irregular-whitespace
export type ZeroWidthSpace = " "

export type ErrorMessage<message extends string = string> =
	`${message}${ZeroWidthSpace}`

export type Completion<text extends string = string> =
	`${text}${ZeroWidthSpace}${ZeroWidthSpace}`