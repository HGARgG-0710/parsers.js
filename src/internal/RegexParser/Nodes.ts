import type { ICellNode, INode, IPoolNode } from "../../interfaces.js"
import {
	BaseNode,
	ContentNode,
	RecursiveNode,
	SingleChildNode,
	TokenNode
} from "../../objects/Node.js"
import { isType } from "../../utils/Node.js"

export const Digit = TokenNode("digit", "Digit")
export const EscapedLiteral = ContentNode("escaped-literal", "EscapedLiteral")
export const Newline = TokenNode("newline", "Newline")
export const Space = TokenNode("space", "Space")
export const Tab = TokenNode("tab", "Tab")
export const UnicodeChar = ContentNode("unicode-char", "UnicodeChar")
export const VTab = TokenNode("vtab", "VTab")
export const Word = TokenNode("word", "Word")

export const IgnoreCaseGroup = SingleChildNode(
	"ignore-case-group",
	"IgnoreCaseGroup"
)

export const LookaheadGroup = SingleChildNode(
	"lookahead-group",
	"LookaheadGroup"
)

export const Group = SingleChildNode("group", "Group")
export const Plus = TokenNode("plus", "Plus")
export const QMark = TokenNode("qmark", "QMark")
export const InfiniteRange = SingleChildNode("infinite-range", "InfiniteRange")
export const TrivialRange = SingleChildNode("trivial-range", "TrivialRange")

export class LimitsRange extends BaseNode {
	static readonly debugName = "LimitsRange"

	get type() {
		return "limits-range"
	}

	get lastChild() {
		return 1
	}

	get debugName() {
		return LimitsRange.debugName
	}

	debugPrint(): string {
		return `${
			this.debugName
		} { from: ${this.from.debugPrint()}, to: ${this.to.debugPrint()} }`
	}

	read(i: number): INode {
		return i === 0 ? this.from : this.to
	}

	constructor(
		private readonly from: ICellNode<string>,
		private readonly to: ICellNode<string>
	) {
		super()
	}
}

export const Range = SingleChildNode("range", "Range")

// internal, temp node (exists for convinience and validation purposes),
// doesn't actully appear in the AST
export const Comma = TokenNode("comma", "Comma")

export const RangeBoundary = ContentNode("range-boundary", "RangeBoundary")

abstract class ByGreedinessRange extends BaseNode {
	get lastChild(): number {
		return 1
	}

	read(i: number): INode {
		return i === 0 ? this.child : this.range
	}

	debugPrint(): string {
		return `${
			this.debugName
		} { child: ${this.child.debugPrint()}, range: ${this.range.debugPrint()} }`
	}

	constructor(
		private readonly child: INode,
		private readonly range: IPoolNode<[INode]>
	) {
		super()
	}
}

export class NonGreedyRange extends ByGreedinessRange {
	static readonly type = "non-greedy-range"
	static readonly debugName = "NonGreedyRange"
	static is = isType(NonGreedyRange.type)

	get type() {
		return NonGreedyRange.type
	}

	get debugName() {
		return NonGreedyRange.debugName
	}
}

export class GreedyRange extends ByGreedinessRange {
	static readonly type = "greedy-range"
	static readonly debugName = "GreedyRange"
	static is = isType(GreedyRange.type)

	get type() {
		return GreedyRange.type
	}

	get debugName() {
		return GreedyRange.debugName
	}
}

export const Star = TokenNode("star", "Star")
export const NonGreedyStar = SingleChildNode("non-greedy-star", "NonGreedyStar")
export const GreedyStar = SingleChildNode("greedy-star", "GreedyStar")

// temporary (not part of AST), internal, exists for convinience
export const Hyphen = TokenNode("hyphen", "Hyphen")

export const ClassUnit = ContentNode("char-class-unit", "ClassUnit")

export class ClassRange extends BaseNode {
	static readonly debugName = "ClassRange"

	private start: INode
	private end: INode

	get debugName() {
		return ClassRange.debugName
	}

	get type() {
		return "char-class-range"
	}

	get lastChild() {
		return 1
	}

	read(i: number): INode {
		return i === 0 ? this.start : this.end
	}

	debugPrint(): string {
		return `${
			this.debugName
		} { start: ${this.start.debugPrint()}, end: ${this.end.debugPrint()} }`
	}

	constructor(start?: INode, end?: INode) {
		super()
		if (start) this.start = start
		if (end) this.end = end
	}
}

export const CharClass = RecursiveNode("char-class", "CharClass")
export const Disjunct = RecursiveNode("disjunct", "Disjunct")
export const Disjunction = RecursiveNode("disjunction", "Disjunction")
export const AnyChar = TokenNode("any-char", "AnyChar")
export const GroupBody = RecursiveNode("group-body", "GroupBody")
export const Negated = SingleChildNode("negated", "Negated")
export const Pipe = TokenNode("pipe", "Pipe")
export const SingleChar = ContentNode("char", "SingleChar")
export const TypeMatch = ContentNode("type-match", "TypeMatch")
export const AsString = ContentNode("as-string", "AsString")
export const AsInt = ContentNode("as-int", "AsInt")
export const RootNode = SingleChildNode("regex-root", "RootNode")
