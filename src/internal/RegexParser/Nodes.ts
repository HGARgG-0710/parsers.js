import type { ICellNode, INode } from "../../interfaces.js"
import {
	BaseNode,
	ContentNode,
	RecursiveNode,
	SingleChildNode,
	TokenNode
} from "../../objects/Node.js"
import { isType } from "../../utils/Node.js"

export const Digit = TokenNode("digit")
export const EscapedLiteral = ContentNode<string, string>("escaped-literal")
export const Newline = TokenNode("newline")
export const Space = TokenNode("space")
export const Tab = TokenNode("tab")
export const UnicodeChar = ContentNode<string, string>("unicode-char")
export const Vtab = TokenNode("vtab")
export const Word = TokenNode("word")
export const IgnoreCaseGroup = SingleChildNode("ignore-case-group")
export const LookaheadGroup = SingleChildNode("lookahead-group")
export const Group = SingleChildNode("group")
export const Plus = TokenNode("plus")
export const QMark = TokenNode("qmark")
export const InfiniteRange = SingleChildNode<string>("infinite-range")
export const TrivialRange = SingleChildNode<string>("trivial-range")

export class LimitsRange extends BaseNode<string> {
	get type() {
		return "limits-range"
	}

	get lastChild() {
		return 1
	}

	read(i: number): INode<string, any[]> {
		return i === 0 ? this.from : this.to
	}

	constructor(
		private readonly from: ICellNode<string>,
		private readonly to: ICellNode<string>
	) {
		super()
	}
}

export class Range extends BaseNode<string> {
	static readonly type = "range"
	static is(x: INode<string>) {
		return x.type === Range.type
	}

	private child: INode<string>

	get type() {
		return "range"
	}

	get lastChild(): number {
		return 0
	}

	read(i: number): INode<string, any[]> {
		return this.child
	}

	index(multind: number[]): INode<string, any[]> {
		const [, ...subIndex] = multind
		return this.child.index(subIndex)
	}

	add(item: INode<string>) {
		this.child = item
	}
}

// internal, temp node (exists for convinience and validation purposes),
// doesn't actully appear in the AST
export const CommaNode = TokenNode("comma")

export const RangeBoundary = ContentNode("range-boundary")

abstract class ByGreedinessRange extends BaseNode<string> {
	get lastChild(): number {
		return 1
	}

	read(i: number): INode<string, any[]> {
		return i === 0 ? this.child : this.range
	}

	constructor(
		private readonly child: INode<string>,
		private readonly range: Range
	) {
		super()
	}
}

export class NonGreedyRange extends ByGreedinessRange {
	static readonly type = "non-greedy-range"
	static is = isType(NonGreedyRange.type)

	get type() {
		return NonGreedyRange.type
	}
}

export class GreedyRange extends ByGreedinessRange {
	static readonly type = "greedy-range"
	static is = isType(GreedyRange.type)

	get type() {
		return GreedyRange.type
	}
}

export const Star = TokenNode("star")
export const NonGreedyStar = SingleChildNode("non-greedy-star")
export const GreedyStar = SingleChildNode("greedy-star")

// temporary (not part of AST), internal, exists for convinience
export const Hyphen = TokenNode("hyphen")

export const ClassUnit = ContentNode("char-class-unit")

export class ClassRange extends BaseNode<string> {
	private rangeStart: INode<string>
	private rangeEnd: INode<string>

	get type() {
		return "char-class-range"
	}

	get lastChild() {
		return 1
	}

	read(i: number): INode<string, any[]> {
		return i === 0 ? this.rangeStart : this.rangeEnd
	}

	constructor(from?: INode<string>, to?: INode<string>) {
		super()
		if (from) this.rangeStart = from
		if (to) this.rangeEnd = to
	}
}

export const CharClass = RecursiveNode("char-class")
export const Disjunct = RecursiveNode("disjunct")
export const Disjunction = RecursiveNode("disjunction")
export const AnyChar = TokenNode("any-char")
export const GroupBody = RecursiveNode("group-body")
export const Negated = SingleChildNode("negated")
export const Pipe = TokenNode("pipe")
export const SingleChar = ContentNode<string, string>("char")
export const TypeMatch = ContentNode<string, string>("type-match")
export const AsString = ContentNode<string, INode<string>>("as-string")
export const AsInt = ContentNode<string, INode<string>>("as-int")
