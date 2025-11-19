import type {
	ICommonStream,
	IOwnedStream,
	IPeekable,
	IPeekableStream,
	IStream,
	IStreamStep
} from "../../interfaces.js"
import { SourceBuilder } from "../../objects.js"
import { ensureCurrDecimal, skip } from "../../objects/Error.js"
import { LimitStream, ValidatorStream } from "../../objects/Stream.js"
import {
	CollectionStream,
	EndBracketStream,
	EscapedStream,
	isCurr,
	isNotNext,
	isNotNonEscapedNext,
	SingletonWrapperStream
} from "../../samples/Stream.js"
import { consumable } from "../../utils/Stream.js"
import { AsInt, AsString, TypeMatch } from "./Nodes.js"
import { HandleSingleChar } from "./SingleChar.js"

const skipIntModifier = skip("i")
const skipStringModifier = skip("s")
const skipOpbrace = skip("{")

const AsIntStream = SingletonWrapperStream(AsInt)
const AsIntValidatorStream = ValidatorStream(ensureCurrDecimal)
const AsStringStream = SingletonWrapperStream(AsString)
const TypeMatchStream = CollectionStream(
	TypeMatch,
	consumable(new SourceBuilder())
)

const emptinessCondition = isCurr("}")

function TypeMatchLimitStream(
	skipModifier: (stream: IStream<string>) => void,
	longAs: IStreamStep<string>
) {
	return EndBracketStream(
		LimitStream.Limits.builder<string>()
			.setFrom((input) => {
				skipModifier(input) // the modifier (i, s, etc)
				skipOpbrace(input) // {
				return 0
			})
			.setIsEmpty(emptinessCondition)
			.setLongAs(longAs)
			.build()
	)
}

const StringTypeLimitsStream = TypeMatchLimitStream(
	skipStringModifier,
	isNotNonEscapedNext("}")
)

const IntTypeLimitsStream = TypeMatchLimitStream(
	skipIntModifier,
	isNotNext("}")
)

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
		IntTypeLimitsStream()
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
		StringTypeLimitsStream()
	]
}

export const maybeTypeMatch = {
	i: HandleTypeMatchMaybe(HandleIntTypeMatch),
	s: HandleTypeMatchMaybe(HandleStringTypeMatch)
}
