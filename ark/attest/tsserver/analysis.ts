import type tsvfs from "@typescript/vfs"
import type ts from "typescript"
import { getConfig } from "../config.ts"
import { getFileKey } from "../utils.ts"
import {
	getAssertionsInFile,
	type SerializedAssertionData
} from "./getAssertionsInFile.ts"
import { getCachedAssertionData } from "./getCachedAssertionData.ts"
import { getDiagnosticsByFile } from "./getDiagnosticsByFile.ts"
import { getProgram, TsServer } from "./tsserver.ts"

export type AssertionsByFile = Record<string, SerializedAssertionData[]>

interface InternalTypeChecker extends ts.TypeChecker {
	// These APIs are not publicly exposed
	getInstantiationCount: () => number
	isTypeAssignableTo: (source: ts.Type, target: ts.Type) => boolean
	getDiagnostics: () => ts.Diagnostic[]
}

export const getInternalTypeChecker = (
	env?: tsvfs.VirtualTypeScriptEnvironment
) => getProgram(env).getTypeChecker() as InternalTypeChecker

export interface StringifiableType extends ts.Type {
	toString(): string
	isUnresolvable: boolean
}

export const getStringifiableType = (node: ts.Node): StringifiableType => {
	const typeChecker = getInternalTypeChecker()
	// in a call like attest<object>({a: true}),
	// passing arg.expression avoids inferring {a: true} as object
	const nodeType = typeChecker.getTypeAtLocation(node)
	const stringified = typeChecker.typeToString(nodeType)
	return Object.assign(nodeType, {
		toString: () => stringified,
		isUnresolvable: (nodeType as any).intrinsicName === "error"
	})
}

type AnalyzeTypeAssertionsOptions = {
	isInitialCache?: boolean
}

let __assertionCache: undefined | AssertionsByFile

export const getAssertionsByFile = ({
	isInitialCache
}: AnalyzeTypeAssertionsOptions = {}): AssertionsByFile => {
	if (__assertionCache) {
		return __assertionCache
	}
	const config = getConfig()
	if (!isInitialCache) {
		return getCachedAssertionData(config)
	}
	const instance = TsServer.instance
	const filePaths = instance.programFilePaths
	const diagnosticsByFile = getDiagnosticsByFile()
	const assertionsByFile: AssertionsByFile = {}
	for (const path of filePaths) {
		const file = instance.getSourceFileOrThrow(path)
		const assertionsInFile = getAssertionsInFile(
			file,
			diagnosticsByFile,
			config.attestAliases
		)
		if (assertionsInFile.length) {
			assertionsByFile[getFileKey(file.fileName)] = assertionsInFile
		}
	}
	__assertionCache = assertionsByFile
	return assertionsByFile
}
