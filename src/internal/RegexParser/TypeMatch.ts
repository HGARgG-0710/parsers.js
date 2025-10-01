import type { array } from "@hgargg-0710/one"
import { SourceBuilder } from "../../classes.js"
import { ContentNode } from "../../classes/Node.js"
import type {
	INode,
	IOwnedStream,
	IPeekable,
	IPeekableStream,
	IStreamChooser
} from "../../interfaces.js"
import {
	CollectionStream,
	EndBracketStream,
	isCurr,
	WrapperStream
} from "../../samples/Stream.js"
import { consumable } from "../../utils/Stream.js"
import { HandleSingleChar } from "./SingleChar.js"

const TypeMatch = ContentNode<string, string>("type-match")
const AsString = ContentNode<string, INode<string>>("as-string")
const AsInt = ContentNode<string, INode<string>>("as-int")

const AsIntStream = WrapperStream(AsInt)

const AsStringStream = WrapperStream(AsString)

const TypeMatchStream = CollectionStream(
	TypeMatch,
	consumable(new SourceBuilder())
)

const TypeMatchLimitsStream = EndBracketStream(isCurr("}"))

function isTypeMatchStart(stream: IPeekableStream<string>) {
	return stream.peek(1) === "{"
}

function HandleIntTypeMatch(input: IOwnedStream<string> & IPeekable<string>) {
	if (!isTypeMatchStart(input)) return HandleSingleChar()
	input.next() // i
	input.next() // {
	return [AsIntStream(), TypeMatchStream(), TypeMatchLimitsStream()]
}

function HandleStringTypeMatch(
	input: IOwnedStream<string> & IPeekable<string>
) {
	if (!isTypeMatchStart(input)) return HandleSingleChar()
	input.next() // s
	input.next() // {
	return [AsStringStream(), TypeMatchStream(), TypeMatchLimitsStream()]
}

export const maybeTypeMatch: array.Pairs<string, IStreamChooser> = [
	["i", HandleIntTypeMatch],
	["s", HandleStringTypeMatch]
]
