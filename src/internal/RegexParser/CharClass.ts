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
import { BasicHash } from "../../objects/HashMap.js"
import { SingleNodeStream } from "../../objects/Stream.js"
import {
	EndBracketStream,
	isCurr,
	TokenStream,
	SingletonWrapperStream
} from "../../samples/Stream.js"
import { ObjectMap } from "../../samples/TerminalMap.js"
import { consumeSingletonRevivables } from "../../utils/Stream.js"
import { HandleEscaped } from "./Escaped.js"
import { CharClass, ClassRange, ClassUnit, Hyphen } from "./Nodes.js"
import { HandleSingleChar } from "./SingleChar.js"

const HyphenStream = TokenStream(Hyphen)

const CharClassLimitStream = EndBracketStream(isCurr("]"))

const ClassUnitStream = SingletonWrapperStream(ClassUnit)

class ClassRangeStream extends SingleNodeStream<INode<string>> {
	private classRange: ClassRange

	private updateCurr() {
		this.curr = this.classRange
	}

	private readNextUnit() {
		const unit = this.resource!.curr
		this.resource!.next()
		return unit
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

class CharClassStream extends SingleNodeStream<INode<string>> {
	setResource(resource: IOwnedStream): void {
		super.setResource(resource)
		this.curr = consumeSingletonRevivables(this, new CharClass([]))
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
