import type {
    AbstractableConstructor,
    Constructor,
    Domain,
    evaluate,
    inferDomain,
    isUnknown,
    List,
    listable
} from "@arktype/utils"
import {
    domainOf,
    isArray,
    throwInternalError,
    throwParseError
} from "@arktype/utils"
import { writeIndivisibleMessage } from "../../parse/ast/divisor.js"
import type {
    inferMorphOut,
    Morph,
    Narrow,
    NarrowCast,
    Out
} from "../../parse/tuple.js"
import type { ParseContext } from "../../scope.js"
import { Disjoint } from "../disjoint.js"
import type { NodeKinds } from "../kinds.js"
import { createNodeOfKind, precedenceByKind } from "../kinds.js"
import type {
    BasisInput,
    BasisNode,
    inferBasis
} from "../primitive/basis/basis.js"
import type { ClassNode } from "../primitive/basis/class.js"
import { classNode } from "../primitive/basis/class.js"
import type { DomainNode } from "../primitive/basis/domain.js"
import { domainNode } from "../primitive/basis/domain.js"
import type { ValueNode } from "../primitive/basis/value.js"
import { valueNode } from "../primitive/basis/value.js"
import type { Range } from "../primitive/range.js"
import type { SerializedRegexLiteral } from "../primitive/regex.js"
import type { CompositeNode } from "./composite.js"
import { defineComposite } from "./composite.js"
import type { inferPropsInput } from "./inferProps.js"
import type { PropsInput } from "./props.js"
import type { TypeNode } from "./type.js"
import { builtins } from "./type.js"

export type PredicateNodeConfig = defineComposite<{
    kind: "predicate"
    input: PredicateInput | PredicateChildren
    rule: PredicateChildren
    meta: {}
}>

export interface PredicateNode extends CompositeNode<PredicateNodeConfig> {
    basis: BasisNode | null
    constraints: ConstraintNode[]
    getConstraint: <k extends ConstraintKind>(k: k) => ConstraintKinds[k]
    value: ValueNode | undefined
    keyof(): TypeNode
    constrain<kind extends ConstraintKind>(
        kind: kind,
        input: ConstraintsInput[kind]
    ): PredicateNode
}

export const predicateNode = defineComposite<PredicateNode>(
    {
        kind: "predicate",
        parse: (input, ctx) => {
            let children: PredicateChildren
            if (isArray(input)) {
                children = input
            } else {
                const basis = input.basis && basisNodeFrom(input.basis, ctx)
                children = basis ? [basis] : []
                for (const kind of constraintKindNames) {
                    if (input[kind]) {
                        const node = createNodeOfKind(
                            kind,
                            input[kind] as never,
                            ctx
                        )
                        assertAllowsConstraint(basis, node)
                        children.push(node)
                    }
                }
            }
            // sort by precedence, and then alphabetically by kind
            return children.sort((l, r) =>
                precedenceByKind[l.kind] > precedenceByKind[r.kind]
                    ? 1
                    : precedenceByKind[l.kind] < precedenceByKind[r.kind]
                    ? -1
                    : l.kind > r.kind
                    ? 1
                    : -1
            )
        },
        getReferences: (children) =>
            children.flatMap((child) =>
                child.hasKind("props") ? child.references : []
            ),
        compile: (children, state) => {
            let result = ""
            const initialChild = children.at(0)
            const basis = initialChild?.isBasis() ? initialChild : undefined
            if (basis) {
                state.bases.push(basis)
            }
            for (const child of children) {
                const childResult = child.compile(state)
                if (childResult) {
                    result = result ? `${result}\n${childResult}` : childResult
                }
            }
            if (basis) {
                state.bases.pop()
            }
            return result
        },
        intersect: (l, r): PredicateNode | Disjoint => {
            // TODO: can props imply object basis for compilation?
            // TODO: Fix
            // const basis = l.basis
            //     ? r.basis
            //         ? l.basis.intersect(r.basis)
            //         : l.basis
            //     : r.basis
            const basis = l.basis
            if (basis instanceof Disjoint) {
                return basis
            }
            // check l.basis instead of l.value since l.value will
            // only be set if the value is "pure", i.e. has no morphs
            if (l.basis?.hasKind("value")) {
                if (!r.allows(l.basis.rule)) {
                    return Disjoint.from("assignability", r, l.basis)
                }
            } else if (r.basis?.hasKind("value")) {
                if (!l.allows(r.basis.rule)) {
                    return Disjoint.from("assignability", l, r.basis)
                }
            }
            const rules: PredicateChildren = basis ? [basis] : []
            for (const kind of constraintKindNames) {
                const lNode = l.getConstraint(kind)
                const rNode = r.getConstraint(kind)
                if (lNode) {
                    if (rNode) {
                        // TODO: fix
                        const result = lNode
                        // lNode.intersect(rNode as never)
                        // we may be missing out on deep discriminants here if e.g.
                        // there is a range Disjoint between two arrays, each of which
                        // contains objects that are discriminable. if we need to find
                        // these, we should avoid returning here and instead collect Disjoints
                        // similarly to in PropsNode
                        if (result instanceof Disjoint) {
                            return result
                        }
                        rules.push(result)
                    } else {
                        rules.push(lNode)
                    }
                } else if (rNode) {
                    rules.push(rNode)
                }
            }
            // TODO: bad context source
            return predicateNode(rules, l.context)
        }
    },
    (base) => {
        const initialRule = base.rule.at(0)
        const basis = initialRule?.isBasis() ? initialRule : null
        const constraints = (
            basis ? base.rule.slice(1) : base.rule
        ) as ConstraintNode[]
        const description =
            base.rule.length === 0
                ? "unknown"
                : constraints.length
                ? `(${constraints
                      .map((rule) => rule.toString())
                      .join(" and ")})`
                : `${basis}`
        return {
            description,
            basis,
            constraints,
            getConstraint: (k) =>
                constraints.find(
                    (constraint) => constraint.kind === k
                ) as never,
            value:
                // we only want simple unmorphed values
                basis?.hasKind("value") && base.rule.length === 1
                    ? basis
                    : undefined,
            constrain(kind, input): PredicateNode {
                const constraint = createNodeOfKind(
                    kind,
                    input as never,
                    base.context
                )
                assertAllowsConstraint(this.basis, constraint)
                const result = this.intersect(
                    predicateNode([constraint], base.context)
                )
                if (result instanceof Disjoint) {
                    return result.throw()
                }
                return result
            },
            keyof() {
                if (!this.basis) {
                    return builtins.never()
                }
                const propsKey = this.getConstraint("props")?.keyof()
                return propsKey?.or(this.basis.keyof()) ?? this.basis.keyof()
            }
        }
    }
)

// if (
//     // s.lastOperator === "&" &&
//     rules.morphs?.some(
//         (morph, i) => morph !== branch.tree.morphs?.[i]
//     )
// ) {
//     throwParseError(
//         writeImplicitNeverMessage(s.path, "Intersection", "of morphs")
//     )
// }

export const assertAllowsConstraint = (
    basis: BasisNode | null,
    node: ConstraintNode
) => {
    if (basis?.hasKind("value")) {
        throwInvalidConstraintError(
            node.kind,
            "a non-literal type",
            basis.toString()
        )
        return
    }
    const domain = basis?.domain ?? "unknown"
    switch (node.kind) {
        case "divisor":
            if (domain !== "number") {
                throwParseError(writeIndivisibleMessage(domain))
            }
            return
        case "range":
            // TODO: reeanble
            // const bounds = node["rule"] as Range
            // if (domain !== "string" && domain !== "number") {
            //     const isDateClassBasis =
            //         basis?.hasKind("class") && basis.extendsOneOf(Date)
            //     if (isDateClassBasis) {
            //         assertValidLimit(bounds, "Date")
            //         return
            //     }
            //     const hasSizedClassBasis =
            //         basis?.hasKind("class") && basis.extendsOneOf(Array)
            //     if (!hasSizedClassBasis) {
            //         throwParseError(writeUnboundableMessage(domain))
            //     }
            // }
            // assertValidLimit(bounds, "number")
            return
        case "regex":
            if (domain !== "string") {
                throwInvalidConstraintError("regex", "a string", domain)
            }
            return
        case "props":
            if (domain !== "object") {
                throwInvalidConstraintError("props", "an object", domain)
            }
            return
        case "narrow":
            return
        default:
            throwInternalError(
                `Unexpected rule kind '${(node as ConstraintNode).kind}'`
            )
    }
}

export const writeInvalidConstraintMessage = (
    kind: ConstraintKind,
    typeMustBe: string,
    typeWas: string
) => {
    return `${kind} constraint may only be applied to ${typeMustBe} (was ${typeWas})`
}

export const throwInvalidConstraintError = (
    ...args: Parameters<typeof writeInvalidConstraintMessage>
) => throwParseError(writeInvalidConstraintMessage(...args))

const constraintKindNames = [
    "divisor",
    "range",
    "regex",
    "props",
    "narrow"
] as const satisfies List<ConstraintKind>

export type ListableInputKind = "regex" | "narrow"

export type PredicateChildren =
    | [BasisNode, ...ConstraintNode[]]
    | ConstraintNode[]

export type ConstraintNode = ConstraintKinds[ConstraintKind]
type ConstraintKinds = Pick<
    NodeKinds,
    "range" | "divisor" | "regex" | "props" | "narrow"
>

export type PredicateChildKind = "basis" | ConstraintKind

export type ConstraintKind = keyof ConstraintKinds

export type PredicateInput<
    basis extends BasisInput | null = BasisInput | null
> =
    | Record<string, never>
    | evaluate<
          {
              basis: basis
          } & ConstraintsInput<basis>
      >

export type ConstraintsInput<
    basis extends BasisInput | null = BasisInput | null
> = BasisInput extends basis
    ? {
          // TODO: remove morphs here? just to get rid of some type errors reincluding
          [k in ConstraintKind | "morph"]?: k extends ConstraintKind
              ? unknownConstraintInput<k>
              : listable<Morph>
      }
    : basis extends BasisInput
    ? constraintsOf<basis>
    : functionalConstraints<unknown>

type unknownConstraintInput<kind extends ConstraintKind> = kind extends "props"
    ? PropsInput
    :
          | ConstraintKinds[kind]["rule"]
          // Add the unlisted version as a valid input for these kinds
          // TODO: fix these types, derive from nodes?
          | (kind extends ListableInputKind
                ? readonly ConstraintKinds[kind]["rule"][]
                : never)

export type inferPredicateDefinition<input extends PredicateInput> =
    input["morph"] extends Morph<any, infer out>
        ? (In: inferPredicateInput<input>) => Out<inferMorphOut<out>>
        : input["morph"] extends readonly [...any[], Morph<any, infer out>]
        ? (In: inferPredicateInput<input>) => Out<inferMorphOut<out>>
        : inferPredicateInput<input>

type inferPredicateInput<input extends PredicateInput> =
    input["narrow"] extends NarrowCast<any, infer narrowed>
        ? narrowed
        : input["narrow"] extends List<Narrow>
        ? inferNarrowArray<input["narrow"]> extends infer result
            ? isUnknown<result> extends true
                ? inferNonFunctionalConstraints<input>
                : result
            : never
        : inferNonFunctionalConstraints<input>

type inferNarrowArray<
    filters extends List,
    result = unknown
> = filters extends readonly [infer head, ...infer tail]
    ? inferNarrowArray<
          tail,
          result &
              (head extends NarrowCast<any, infer narrowed>
                  ? narrowed
                  : unknown)
      >
    : evaluate<result>

type inferNonFunctionalConstraints<input extends PredicateInput> =
    input["basis"] extends BasisInput
        ? input["props"] extends PropsInput
            ? inferPropsInput<input["props"]>
            : inferBasis<input["basis"]>
        : unknown

type constraintsOf<basis extends BasisInput> = basis extends Domain
    ? functionalConstraints<inferDomain<basis>> & domainConstraints<basis>
    : basis extends Constructor
    ? functionalConstraints<InstanceType<Constructor>> & classConstraints<basis>
    : basis extends readonly ["===", infer value]
    ? // Exact values cannot be filtered, but can be morphed
      Pick<functionalConstraints<value>, "morph">
    : never

type domainConstraints<basis extends Domain> = basis extends "object"
    ? {
          props?: PropsInput
      }
    : basis extends "string"
    ? {
          regex?: listable<SerializedRegexLiteral>
          range?: Range
      }
    : basis extends "number"
    ? {
          divisor?: number
          range?: Range
      }
    : {}

type functionalConstraints<input> = {
    narrow?: listable<Narrow<input>>
    // TODO: remove?
    morph?: listable<Morph<input>>
}

type classConstraints<base extends Constructor> = base extends
    | typeof Array
    | typeof Date
    ? {
          props?: PropsInput
          range?: Range
      }
    : {
          props?: PropsInput
      }

export type basisNodeFrom<input extends BasisInput> = input extends Domain
    ? DomainNode
    : input extends AbstractableConstructor
    ? ClassNode
    : ValueNode

export const basisNodeFrom = (
    input: BasisInput,
    ctx: ParseContext
): DomainNode | ClassNode | ValueNode => {
    switch (typeof input) {
        case "string":
            return domainNode(input, ctx)
        case "object":
            return valueNode(input[1], ctx)
        case "function":
            return classNode(input, ctx)
        default:
            return throwInternalError(
                `Unexpectedly got a basis input of type ${domainOf(input)}`
            )
    }
}
