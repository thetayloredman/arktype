import type { Dict, List } from "../utils/generics.ts"
import type { ComparisonState, CompilationState } from "./node.ts"
import { Node } from "./node.ts"
import { Type } from "./type.ts"

export class PropsNode extends Node<typeof PropsNode> {
    readonly named: PropsRule["named"]
    readonly indexed: PropsRule["indexed"]

    constructor(definition: PropsRule) {
        super(PropsNode, definition)
        this.named = definition.named
        this.indexed = definition.indexed
    }

    static compile(rule: PropsRule, s: CompilationState) {
        const propChecks: string[] = []
        // // if we don't care about extraneous keys, compile props so we can iterate over the definitions directly
        // for (const k in named) {
        //     const prop = named[k]
        //     c.path.push(k)
        //     propChecks.push(prop.type.compile(c))
        //     c.path.pop()
        // }
        return propChecks.length ? s.mergeChecks(propChecks) : "true"
    }

    static intersect(l: PropsNode, r: PropsNode, s: ComparisonState) {
        const indexed = [...l.indexed]
        for (const [rKey, rValue] of r.indexed) {
            const matchingIndex = indexed.findIndex(([lKey]) => lKey === rKey)
            if (matchingIndex === -1) {
                indexed.push([rKey, rValue])
            } else {
                // TODO: path updates here
                indexed[matchingIndex][1] = Type.intersect(
                    indexed[matchingIndex][1],
                    rValue,
                    s
                )
            }
        }
        const named = { ...l.named, ...r.named }
        for (const k in named) {
            let propResult = named[k]
            if (k in l) {
                if (k in r) {
                    // We assume l and r were properly created and the named
                    // props from each PropsNode have already been intersected
                    // with any matching index props. Therefore, the
                    // intersection result will already include index values
                    // from both sides whose key types allow k.
                    propResult = NamedPropNode.intersect(
                        l.named[k],
                        r.named[k],
                        s
                    )
                } else {
                    // If a named key from l matches any index keys of r, intersect
                    // the value associated with the name with the index value.
                    for (const [rKey, rValue] of r.indexed) {
                        if (rKey.allows(k)) {
                            const rValueAsProp = new NamedPropNode({
                                kind: "optional",
                                type: rValue
                            })
                            propResult = NamedPropNode.intersect(
                                propResult,
                                rValueAsProp,
                                s
                            )
                        }
                    }
                }
            } else {
                // If a named key from r matches any index keys of l, intersect
                // the value associated with the name with the index value.
                for (const [lKey, lValue] of l.indexed) {
                    if (lKey.allows(k)) {
                        const lValueAsProp = new NamedPropNode({
                            kind: "optional",
                            type: lValue
                        })
                        propResult = NamedPropNode.intersect(
                            propResult,
                            lValueAsProp,
                            s
                        )
                    }
                }
            }
            if (
                propResult.type.isDisjoint() &&
                propResult.kind !== "optional"
            ) {
                return propResult.type
            }
            named[k] = propResult
        }
        return new PropsNode({ named, indexed })
    }
}

export type PropsRule = {
    named: Dict<string, NamedPropNode>
    indexed: List<[keyType: Type, valueType: Type]>
}

export type PropKind = "required" | "optional" | "prerequisite"

export type NamedPropDefinition = {
    kind: PropKind
    type: Type
}

export type NamedPropRule = {
    kind: PropKind
    type: Type
}

export class NamedPropNode extends Node<typeof NamedPropNode> {
    kind: PropKind
    type: Type

    constructor(public rule: NamedPropRule) {
        super(NamedPropNode, rule)
        this.kind = rule.kind
        this.type = new Type(rule)
    }

    static compile(rule: NamedPropRule, s: CompilationState) {
        return rule.type.compile(s)
    }

    static intersect(l: NamedPropNode, r: NamedPropNode, s: ComparisonState) {
        const kind =
            l.kind === "prerequisite" || r.kind === "prerequisite"
                ? "prerequisite"
                : l.kind === "required" || r.kind === "required"
                ? "required"
                : "optional"
        const type = Type.intersect(l.type, r.type, s)
        return new NamedPropNode({ kind, type })
    }
}