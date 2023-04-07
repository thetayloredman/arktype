import type { Domain } from "../utils/domains.js"
import type { ComparisonState, CompilationState } from "./node.js"
import { Node } from "./node.js"

export class DomainNode<rule extends Domain = Domain> extends Node<
    typeof DomainNode
> {
    constructor(rule: rule) {
        super(DomainNode, rule)
    }

    static intersection(l: DomainNode, r: DomainNode, s: ComparisonState) {
        return l === r ? l : s.addDisjoint("domain", l, r)
    }

    static compile(constraint: Domain, s: CompilationState) {
        return constraint === "object"
            ? `(typeof ${s.data} === "object" && ${s.data} !== null) || typeof ${s.data} === "function"`
            : constraint === "null" || constraint === "undefined"
            ? `${s.data} === ${constraint}`
            : `typeof ${s.data} === "${constraint}"`
    }
}
