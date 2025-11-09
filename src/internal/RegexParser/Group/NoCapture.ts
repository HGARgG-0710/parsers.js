import { type IOwnedStream, type IRawStreamArray } from "../../../interfaces.js"
import { PeekStream } from "../../../objects/Stream.js"
import { SingletonWrapperStream } from "../../../samples/Stream.js"
import { maybeCharClass } from "../Class/CharClass.js"
import { CurrCharHandler } from "../CurrCharHandler.js"
import { ProduceDisjunction } from "../Disjunction.js"
import { maybeDot } from "../Dot.js"
import { maybeEscaped } from "../Escaped.js"
import { GroupBodyStream, GroupLimitStream } from "../Group.js"
import { maybeNegation } from "../Negation.js"
import { NoCaptureGroup } from "../Nodes.js"
import { maybePipe } from "../Pipe.js"
import { QuantifierProcessor } from "../Quantifiers.js"
import { maybePreQuantifier } from "../Quantifiers/Pre.js"
import { HandleSingleChar } from "../SingleChar.js"
import { maybeTypeMatch } from "../TypeMatch.js"
import { HandleExtensionGroup } from "./Extension.js"
import { HandlePlainGroup } from "./Plain.js"

const NoCaptureGroupStream = SingletonWrapperStream(NoCaptureGroup)

const OtherGroupHandler = CurrCharHandler<IRawStreamArray>(
	{
		"#": HandleExtensionGroup(ParseNoCaptureRecursively)
	},
	HandlePlainGroup(ParseNoCaptureRecursively)
)

function handleOtherGroup(input: IOwnedStream<string>) {
	input.next() // (
	return OtherGroupHandler(input)
}

const maybeOtherGroup = { "(": handleOtherGroup }

const NoCaptureRegexTokenizer = CurrCharHandler<IRawStreamArray>(
	{
		...maybeEscaped,
		...maybeNegation,
		...maybeTypeMatch,
		...maybeOtherGroup,
		...maybeCharClass,
		...maybeDot,
		...maybePreQuantifier,
		...maybePipe
	},
	HandleSingleChar
)

function ParseNoCaptureRecursively(input: IOwnedStream<string>) {
	return [
		ProduceDisjunction,
		QuantifierProcessor,
		PeekStream(),
		NoCaptureRegexTokenizer
	]
}

export function HandleNoCaptureGroup(input: IOwnedStream<string>) {
	input.next() // =
	return [
		NoCaptureGroupStream(),
		GroupBodyStream(),
		ParseNoCaptureRecursively,
		GroupLimitStream(),
		PeekStream()
	]
}
