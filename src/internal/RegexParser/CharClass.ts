import type { array } from "@hgargg-0710/one"
import type {
	ICommonStream,
	ICompositeStream,
	INode,
	IOwnedStream,
	IPeekable,
	IStream,
	IStreamChooser
} from "../../interfaces.js"
import { TableHandler } from "../../objects.js"
import { expectKind, tryReviveChild } from "../../objects/Error.js"
import { BasicHash } from "../../objects/HashMap.js"
import { SingleNodeStream, SingletonStream } from "../../objects/Stream.js"
import {
	CachedTokenStream,
	EndBracketStream,
	isCurr
} from "../../samples/Stream.js"
import { ObjectMap } from "../../samples/TerminalMap.js"
import { consumeSingletonRevivables } from "../../utils/Stream.js"
import { HandleEscaped } from "./Escaped.js"
import { CharClass, ClassRange, ClassUnit, Hyphen } from "./Nodes.js"
import { HandleSingleChar } from "./SingleChar.js"

const expectHyphen = expectKind(Hyphen)
const expectClassUnit = expectKind(ClassUnit)

const HyphenStream = CachedTokenStream(Hyphen)

const CharClassLimitStream = EndBracketStream(isCurr("]"))

const ClassUnitStream = SingletonStream((input: IStream<string>) =>
	ClassUnit.make(input.curr)
)

class ClassRangeStream extends SingleNodeStream<INode> {
	private classRange: ClassRange

	private updateCurr() {
		this.curr = this.classRange
	}

	private readClassUnit() {
		expectClassUnit(this.resource!)
		return this.readNextItem()
	}

	private readHyphen() {
		expectHyphen(this.resource!)
		return this.readNextItem()
	}

	private readNextItem() {
		const unit = this.resource!.curr
		this.resource!.next()
		return unit
	}

	setResource(resource: IOwnedStream): void {
		super.setResource(resource)
		const fromUnit = this.readClassUnit() // the child Stream dies
		tryReviveChild(this) // needs to be renewed
		this.readHyphen()
		tryReviveChild(this) // needs to be renewed
		const toUnit = this.readClassUnit()
		this.classRange = new ClassRange(fromUnit, toUnit)
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

function HandleUnitOrHyphen(input: IOwnedStream<string>) {
	return (input.curr === "-" ? HandleHyphen : HandleUnit)(input)
}

function HandleClassRange(this: ICompositeStream, input: IOwnedStream<string>) {
	return [new ClassRangeStream().setState(this.state), HandleUnitOrHyphen]
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
