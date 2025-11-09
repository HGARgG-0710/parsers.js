import type {
	IOwnedStream,
	IPeekable,
	IPeekableStream
} from "../../interfaces.js"
import { SourceBuilder } from "../../objects.js"
import { PeekStream } from "../../objects/Stream.js"
import {
	CollectionStream,
	EndBracketStream,
	isNonEscaped,
	SingletonWrapperStream
} from "../../samples/Stream.js"
import { consumable } from "../../utils/Stream.js"
import { AsInt, AsString, TypeMatch } from "./Nodes.js"
import { HandleSingleChar } from "./SingleChar.js"

const AsIntStream = SingletonWrapperStream(AsInt)

const AsStringStream = SingletonWrapperStream(AsString)

const TypeMatchStream = CollectionStream(
	TypeMatch,
	consumable(new SourceBuilder())
)

const TypeMatchLimitsStream = EndBracketStream(isNonEscaped("}"))

function isTypeMatchStart(stream: IPeekableStream<string>) {
	return stream.peek(1) === "{"
}

function HandleIntTypeMatch(input: IOwnedStream<string> & IPeekable<string>) {
	if (!isTypeMatchStart(input)) return HandleSingleChar()
	input.next() // i
	input.next() // {
	return [
		AsIntStream(),
		TypeMatchStream(),
		TypeMatchLimitsStream(),
		PeekStream()
	]
}

function HandleStringTypeMatch(
	input: IOwnedStream<string> & IPeekable<string>
) {
	if (!isTypeMatchStart(input)) return HandleSingleChar()
	input.next() // s
	input.next() // {
	return [
		AsStringStream(),
		TypeMatchStream(),
		TypeMatchLimitsStream(),
		PeekStream()
	]
}

export const maybeTypeMatch = {
	i: HandleIntTypeMatch,
	s: HandleStringTypeMatch
}
