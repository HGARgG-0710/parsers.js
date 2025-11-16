import type {
	ICommonStream,
	IOwnedStream,
	IPeekable,
	IPeekableStream
} from "../../interfaces.js"
import { SourceBuilder } from "../../objects.js"
import { ensureCurrDecimal } from "../../objects/Error.js"
import { ValidatorStream } from "../../objects/Stream.js"
import {
	CollectionStream,
	EndBracketStream,
	EscapedStream,
	isNonEscaped,
	SingletonWrapperStream
} from "../../samples/Stream.js"
import { consumable } from "../../utils/Stream.js"
import { AsInt, AsString, TypeMatch } from "./Nodes.js"
import { HandleSingleChar } from "./SingleChar.js"

const AsIntStream = SingletonWrapperStream(AsInt)
const AsIntValidatorStream = ValidatorStream(ensureCurrDecimal)

const AsStringStream = SingletonWrapperStream(AsString)

const TypeMatchStream = CollectionStream(
	TypeMatch,
	consumable(new SourceBuilder())
)

const TypeMatchLimitsStream = EndBracketStream(isNonEscaped("}"))

function isTypeMatchStart(stream: IPeekableStream<string>) {
	return stream.peek(1) === "{"
}

function HandleTypeMatchMaybe(
	typeMatchParser: (input: IOwnedStream<string>) => ICommonStream[]
) {
	return function (input: IOwnedStream<string> & IPeekable<string>) {
		if (!isTypeMatchStart(input)) return HandleSingleChar()
		return typeMatchParser(input)
	}
}

function HandleIntTypeMatch(input: IOwnedStream<string> & IPeekable<string>) {
	input.next() // i
	input.next() // {
	return [
		AsIntStream(),
		TypeMatchStream(),
		AsIntValidatorStream(),
		TypeMatchLimitsStream()
	]
}

function HandleStringTypeMatch(
	input: IOwnedStream<string> & IPeekable<string>
) {
	input.next() // s
	input.next() // {
	return [
		AsStringStream(),
		TypeMatchStream(),
		EscapedStream(),
		TypeMatchLimitsStream()
	]
}

export const maybeTypeMatch = {
	i: HandleTypeMatchMaybe(HandleIntTypeMatch),
	s: HandleTypeMatchMaybe(HandleStringTypeMatch)
}
