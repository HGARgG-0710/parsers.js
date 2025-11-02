import type { array } from "@hgargg-0710/one"
import type {
	ICommonStream,
	ICompositeStream,
	INode,
	IOwnedStream,
	IPeekable,
	IStreamChooser
} from "../../interfaces.js"
import { TableHandler } from "../../objects.js"
import { expectKind, tryReviveChild } from "../../objects/Error.js"
import { BasicHash } from "../../objects/HashMap.js"
import { SingleNodeStream } from "../../objects/Stream.js"
import {
	CachedTokenStream,
	EndBracketStream,
	isCurr,
	SingletonWrapperStream
} from "../../samples/Stream.js"
import { ObjectMap } from "../../samples/TerminalMap.js"
import { consumeSingletonRevivables } from "../../utils/Stream.js"
import { HandleEscaped, HandleRangeBoundaryEscaped } from "./Escaped.js"
import {
	CharClass,
	CharClassRangeBoundary,
	ClassRange,
	ClassUnit,
	Temp
} from "./Nodes.js"
import { HandleSingleChar } from "./SingleChar.js"

const expectHyphen = expectKind(Temp.Hyphen)
const expectRangeBoundary = expectKind(CharClassRangeBoundary)

const HyphenStream = CachedTokenStream(Temp.Hyphen)
const CharClassLimitStream = EndBracketStream(isCurr("]"))
const ClassUnitStream = SingletonWrapperStream(ClassUnit)
const RangeBoundaryStream = SingletonWrapperStream(CharClassRangeBoundary)

class ClassRangeStream extends SingleNodeStream<INode> {
	private classRange: ClassRange

	private updateCurr() {
		this.curr = this.classRange
	}

	private readBoundary() {
		expectRangeBoundary(this.resource!)
		return this.readNextItem()
	}

	private readHyphen() {
		expectHyphen(this.resource!)
		return this.readNextItem()
	}

	private readNextItem() {
		const unit = this.resource!.curr as INode
		this.resource!.next()
		return unit
	}

	setResource(resource: IOwnedStream): void {
		super.setResource(resource)
		const from = this.readBoundary() // the child Stream dies
		tryReviveChild(this) // needs to be renewed
		this.readHyphen()
		tryReviveChild(this) // needs to be renewed
		const to = this.readBoundary()
		this.classRange = new ClassRange(from, to)
		this.updateCurr()
	}
}

class CharClassStream extends SingleNodeStream<INode> {
	setResource(resource: IOwnedStream): void {
		super.setResource(resource)
		this.curr = consumeSingletonRevivables(this, new CharClass())
	}
}

const ClassUnitHandler = TableHandler<
	IOwnedStream<string>,
	ICommonStream<INode>
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
	input.next() // -
	return [HyphenStream()]
}

function HandleUnit(input: IOwnedStream<string>) {
	return [ClassUnitStream(), ClassUnitHandler(input)]
}

const RangeBoundaryHandler = TableHandler<
	IOwnedStream<string>,
	ICommonStream<INode>
>(
	new BasicHash(
		ObjectMap(
			{
				"\\": HandleRangeBoundaryEscaped
			},
			HandleSingleChar
		)
	)
)

function HandleRangeBoundary(input: IOwnedStream<string>) {
	return [RangeBoundaryStream(), RangeBoundaryHandler(input)]
}

function HandleBoundaryOrHyphen(input: IOwnedStream<string>) {
	return (input.curr === "-" ? HandleHyphen : HandleRangeBoundary)(input)
}

function HandleClassRange(this: ICompositeStream, input: IOwnedStream<string>) {
	return [new ClassRangeStream().setState(this.state), HandleBoundaryOrHyphen]
}

function isRangeAhead(input: IOwnedStream<string> & IPeekable<string>) {
	const peekLength = input.curr === "\\" ? 2 : 1
	return input.peek(peekLength) === "-" // \?-? [peekLength == 2], or ?-? [peekLength == 1]
}

function ClassElementHandler(input: IOwnedStream<string> & IPeekable<string>) {
	return [isRangeAhead(input) ? HandleClassRange : HandleUnit]
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
