import type { ICellNode, INode, IPoolNode } from "../../interfaces.js"
import {
	BaseNode,
	CachedContentNode,
	CachedTokenNode,
	ContentNode,
	RecursiveNode,
	SingleChildNode
} from "../../objects/Node.js"
import { isType } from "../../utils/Node.js"

export namespace Temp {
	export const Comma = CachedTokenNode("comma", "Comma")
	export const Hyphen = CachedTokenNode("hyphen", "Hyphen")
	export const Pipe = CachedTokenNode("pipe", "Pipe")
}

export const Plus = CachedTokenNode("plus", "Plus")
export const QMark = CachedTokenNode("qmark", "QMark")
export const Star = CachedTokenNode("star", "Star")

export const Digit = CachedTokenNode("digit", "Digit")
export const EscapedLiteral = ContentNode("escaped-literal", "EscapedLiteral")
export const Newline = CachedTokenNode("newline", "Newline")
export const Space = CachedTokenNode("space", "Space")
export const Tab = CachedTokenNode("tab", "Tab")
export const UnicodeChar = ContentNode("unicode-char", "UnicodeChar")
export const VTab = CachedTokenNode("vtab", "VTab")
export const Word = CachedTokenNode("word", "Word")

export const IgnoreCaseGroup = SingleChildNode(
	"ignore-case-group",
	"IgnoreCaseGroup"
)

export const LookaheadGroup = SingleChildNode(
	"lookahead-group",
	"LookaheadGroup"
)

export const Group = SingleChildNode("group", "Group")

export const Range = SingleChildNode("range", "Range")
export const InfiniteRange = SingleChildNode("infinite-range", "InfiniteRange")
export const TrivialRange = SingleChildNode("trivial-range", "TrivialRange")

export class LimitsRange extends BaseNode {
	static readonly debugName = "LimitsRange"
	static readonly type = "limits-range"

	get type() {
		return LimitsRange.type
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

export const RangeBoundary = ContentNode("range-boundary", "RangeBoundary")

abstract class ByGreedinessQuantifier extends BaseNode {
	get lastChild(): number {
		return 1
	}

	read(i: number): INode {
		return i === 0 ? this.item : this.quantifier
	}

	debugPrint(): string {
		return `${
			this.debugName
		} { child: ${this.item.debugPrint()}, range: ${this.quantifier.debugPrint()} }`
	}

	constructor(
		private readonly item: INode,
		private readonly quantifier: IPoolNode<[INode]>
	) {
		super()
	}
}

export class NonGreedy extends ByGreedinessQuantifier {
	static readonly type = "non-greedy"
	static readonly debugName = "NonGreedy"
	static is = isType(NonGreedy.type)

	get type() {
		return NonGreedy.type
	}

	get debugName() {
		return NonGreedy.debugName
	}
}

export class Greedy extends ByGreedinessQuantifier {
	static readonly type = "greedy"
	static readonly debugName = "Greedy"
	static is = isType(Greedy.type)

	get type() {
		return Greedy.type
	}

	get debugName() {
		return Greedy.debugName
	}
}

export const ClassUnit = SingleChildNode("char-class-unit", "ClassUnit")
export class ClassRange extends BaseNode {
	static readonly debugName = "ClassRange"
	static readonly type = "char-class-range"

	private start: INode
	private end: INode

	get debugName() {
		return ClassRange.debugName
	}

	get type() {
		return ClassRange.type
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
export const AnyChar = CachedTokenNode("any-char", "AnyChar")
export const GroupBody = RecursiveNode("group-body", "GroupBody")
export const Negated = SingleChildNode("negated", "Negated")
export const SingleChar = CachedContentNode("char", "SingleChar")
export const TypeMatch = ContentNode("type-match", "TypeMatch")
export const AsString = ContentNode("as-string", "AsString")
export const AsInt = ContentNode("as-int", "AsInt")
export const RootNode = SingleChildNode("regex-root", "RootNode")
