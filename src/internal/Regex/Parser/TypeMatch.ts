import assert from "assert"
import type {
	ICommonStream,
	IOwnedStream,
	IPeekable,
	IStreamStep
} from "../../../interfaces.js"
import { ensureCurrDecimal, skip } from "../../../objects/Error.js"
import { LimitStream, ValidatorStream } from "../../../objects/Stream.js"
import {
	CollectionStream,
	EndBracketStream,
	EscapedStream,
	SingletonWrapperStream,
	StateAccessStream
} from "../../../samples/Stream.js"
import { getStringConsumable } from "../../../utils/Stream.js"
import { EnableClbrackStream } from "./Contract.js"
import { validateNonEmptyTypeMatch } from "./Errors.js"
import { AsInt, AsString, TypeMatch } from "./Nodes.js"
import { HandleSingleChar } from "./SingleChar.js"
import {
	isNextOpbrace,
	isNotNextClbrace,
	isNotNonEscapedNextClbrace,
	skipOpbrace
} from "./Utils/limits.js"

const AsIntStream = SingletonWrapperStream(AsInt)
const AsIntValidatorStream = ValidatorStream(ensureCurrDecimal)
const AsStringStream = SingletonWrapperStream(AsString)
const TypeMatchStream = CollectionStream(TypeMatch, getStringConsumable())

function TypeMatchLimitStream(modifier: string, longAs: IStreamStep<string>) {
	assert.strictEqual(modifier.length, 1)
	const skipModifier = skip(modifier)
	const validateNonEmpty = validateNonEmptyTypeMatch(modifier)
	return EndBracketStream(
		new LimitStream.Limits.Builder<string>()
			.setFrom((input) => {
				skipModifier(input) // the modifier (i, s, etc)
				skipOpbrace(input) // {
				return 0
			})
			.setIsEmpty((input) => validateNonEmpty(input))
			.setLongAs(longAs)
	)
}

const StringTypeLimitStream = TypeMatchLimitStream(
	"s",
	isNotNonEscapedNextClbrace
)

const IntTypeLimitStream = TypeMatchLimitStream("i", isNotNextClbrace)

function HandleTypeMatchMaybe(
	typeMatchParser: (input: IOwnedStream<string>) => ICommonStream[]
) {
	return function (input: IOwnedStream<string> & IPeekable<string>) {
		if (!isNextOpbrace(input)) return HandleSingleChar()
		return typeMatchParser(input)
	}
}

function HandleIntTypeMatch() {
	return [
		AsIntStream(),
		TypeMatchStream(),
		AsIntValidatorStream(),
		IntTypeLimitStream(),
		StateAccessStream<string>()
	]
}

function HandleStringTypeMatch() {
	return [
		AsStringStream(),
		TypeMatchStream(),
		EscapedStream(),
		StringTypeLimitStream(),
		StateAccessStream<string>(),
		EnableClbrackStream()
	]
}

export const maybeTypeMatch = {
	i: HandleTypeMatchMaybe(HandleIntTypeMatch),
	s: HandleTypeMatchMaybe(HandleStringTypeMatch)
}
