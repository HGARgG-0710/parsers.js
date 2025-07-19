import type { array } from "@hgargg-0710/one"
import { TableHandler } from "../../classes.js"
import { BasicHash } from "../../classes/HashMap.js"
import { BaseNode, ContentNode } from "../../classes/Node.js"
import {
	DyssyncOwningStream,
	LimitStream,
	SingletonStream
} from "../../classes/Stream.js"
import type {
	INode,
	IOwnedStream,
	IPeekable,
	IStreamChooser
} from "../../interfaces.js"
import { ObjectMap } from "../../samples/TerminalMap.js"
import { BaseEscapedHandler } from "./Escaped.js"
import { HandleSingleChar } from "./SingleChar.js"

// TODO: THIS IS ANOTHER ONE OF *THOSE* nodes/Streams pairs... - it must survive SEVERAL DIFFERENT UNDER-STREAM BIRTHS- AND DEATHS-!
// * Supposed to keep an underlying *array* of items [either `ClassUnit`, or `ClassRange`]
class CharClass extends BaseNode<string> {}

// ! Supposed to keep TWO PIECES - `.from: string` and `.to: string`;
// * ALSO - supposed to outlive underyling 'Stream's!
class ClassRange extends BaseNode<string> {}

const ClassUnit = ContentNode("class-unit")

const CharClassLimitStream = LimitStream((input) => input.curr === "]")

// ! For `CharClass`
class CharClassStream extends DyssyncOwningStream.generic!<INode<string>>() {}

// ! Does only two `this.resource.next()` calls INSIDE its own `next()`!
// * Has only ONE `.next()` call available;
class ClassRangeStream extends DyssyncOwningStream.generic!<INode<string>>() {}

const ClassUnitStream = SingletonStream(
	(input: IOwnedStream<string>) => new ClassUnit(input.curr)
)

const ClassUnitHandler = TableHandler(
	new BasicHash(
		ObjectMap(
			{
				"\\": BaseEscapedHandler
			},
			HandleSingleChar
		)
	)
)

function HandleUnit(input: IOwnedStream<string>) {
	return [ClassUnitStream(), ClassUnitHandler(input)]
}

function HandleRange(input: IOwnedStream<string>) {
	return [new ClassRangeStream(), HandleUnit]
}

function isRangeAhead(input: IOwnedStream<string> & IPeekable<string>) {
	const peekLength = input.curr === "\\" ? 2 : 1
	return input.peek(peekLength) === "-" // \?-? [peekLength == 2], or ?-? [peekLength == 1]
}

function ClassElementHandler(input: IOwnedStream<string> & IPeekable<string>) {
	return (isRangeAhead(input) ? HandleRange : HandleUnit)(input)
}

export function HandleCharClass(input: IOwnedStream<string> & IPeekable<string>) {
	input.next() // [
	return [new CharClassStream(), ClassElementHandler, CharClassLimitStream()]
}

export const maybeCharClass: array.Pairs<string, IStreamChooser> = [
	["[", HandleCharClass]
]
