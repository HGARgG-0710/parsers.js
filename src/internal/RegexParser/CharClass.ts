import type { array } from "@hgargg-0710/one"
import { TableHandler } from "../../classes.js"
import { BasicHash } from "../../classes/HashMap.js"
import {
	BaseNode,
	ContentNode,
	RecursiveNode,
	TokenNode
} from "../../classes/Node.js"
import {
	LimitStream,
	NodeStream,
	SingletonStream
} from "../../classes/Stream.js"
import type {
	ICollectionNode,
	ICommonStream,
	ICompositeStream,
	INode,
	IOwnedStream,
	IPeekable,
	IStreamChooser
} from "../../interfaces.js"
import { ObjectMap } from "../../samples/TerminalMap.js"
import { HandleEscaped } from "./Escaped.js"
import { HandleSingleChar } from "./SingleChar.js"

const Hyphen = TokenNode("hyphen")

const ClassUnit = ContentNode("char-class-unit")

class ClassRange extends BaseNode<string> {
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

const CharClass = RecursiveNode("char-class")

const HyphenStream = SingletonStream(() => new Hyphen())

const isClassEnd = (input: IOwnedStream<string>) => input.curr === "]"

const CharClassLimitStream = LimitStream((input: IOwnedStream<string>) => {
	const isEnd = isClassEnd(input)
	if (isEnd) input.next() // ]
	return !isEnd
})

const ClassUnitStream = SingletonStream(
	(input: IOwnedStream<string>) => new ClassUnit(input.curr)
)

class ClassRangeStream extends NodeStream<INode<string>> {
	private classRange: ClassRange

	private updateCurr() {
		this.curr = this.classRange
	}

	private readNextUnit() {
		const unit = this.resource!.curr
		this.resource!.next()
		return unit
	}

	isCurrEnd(): boolean {
		return true
	}

	next() {
		this.endStream()
	}

	// ! DOESN'T CHECK FOR POSSIBILITY OF A MISSING SECOND ITEM!!! [like in 'a-' instead of 'a-z']
	setResource(resource: IOwnedStream): void {
		super.setResource(resource)
		const fromUnit = this.readNextUnit() // the child Stream dies
		this.reviveChild() // needs to be renewed
		const toUnit = this.readNextUnit()
		this.classRange = new ClassRange(fromUnit, toUnit)
		this.updateCurr()
	}
}

class CharClassStream extends NodeStream<INode<string>> {
	private charClass: ICollectionNode<string>

	setResource(resource: IOwnedStream): void {
		super.setResource(resource)
		this.charClass = new CharClass([])
		this.curr = this.charClass

		let couldReviveLast = true
		while (couldReviveLast) {
			this.charClass.push(this.resource!.curr)
			this.resource!.next()
			couldReviveLast = this.reviveChild() // all `ClassRangeStream/ClassUnitStream` children have 1-element lifetime
		}

		// by the end of the loop, all possible children are exhausted,
		// BUT, since for continuation of parent's life we only care about
		// the `this.isEnd`, THIS WORKS
	}

	isCurrEnd(): boolean {
		return true
	}

	next(): void {
		// marking this stream as finished
		this.endStream()
	}
}

const ClassUnitHandler = TableHandler<
	IOwnedStream<string>,
	ICommonStream<INode<string>>
>(
	new BasicHash(
		ObjectMap(
			{
				"\\": HandleEscaped
			},
			HandleSingleChar
		)
	)
)

function HandleHyphen(input: IOwnedStream<string>) {
	input.next()
	return [HyphenStream()]
}

function HandleUnit(input: IOwnedStream<string>) {
	return [ClassUnitStream(), ClassUnitHandler(input)]
}

function HandleUnitOrHyphen(input: IOwnedStream<string>) {
	return (input.curr === "-" ? HandleHyphen : HandleUnit)(input)
}

function HandleRange(this: ICompositeStream, input: IOwnedStream<string>) {
	return [new ClassRangeStream().setState(this.state), HandleUnitOrHyphen]
}

function isRangeAhead(input: IOwnedStream<string> & IPeekable<string>) {
	const peekLength = input.curr === "\\" ? 2 : 1
	return input.peek(peekLength) === "-" // \?-? [peekLength == 2], or ?-? [peekLength == 1]
}

function ClassElementHandler(input: IOwnedStream<string> & IPeekable<string>) {
	return [isRangeAhead(input) ? HandleRange : HandleUnit]
}

export function HandleCharClass(
	this: ICompositeStream,
	input: IOwnedStream<string> & IPeekable<string>
) {
	input.next() // [
	return [
		new CharClassStream().setState(this.state),
		ClassElementHandler,
		CharClassLimitStream()
	]
}

export const maybeCharClass: array.Pairs<string, IStreamChooser> = [
	["[", HandleCharClass]
]
