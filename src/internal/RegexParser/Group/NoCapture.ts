import { type IOwnedStream, type IRawStreamArray } from "../../../interfaces.js"
import { skip } from "../../../objects/Error.js"
import { PeekStream } from "../../../objects/Stream.js"
import { SingletonWrapperStream } from "../../../samples/Stream.js"
import { maybeCharClass } from "../Class/CharClass.js"
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
import { CurrCharHandler } from "../Utils/CurrCharHandler.js"
import { HandleExtensionGroup } from "./Extension.js"
import { HandlePlainGroup } from "./Plain.js"

const skipEq = skip("=")

const NoCaptureGroupStream = SingletonWrapperStream(NoCaptureGroup)
const NoCaptureGroupLimitStream = GroupLimitStream((input) => {
	skipEq(input) // =
	return 0
})

const OtherGroupHandler = CurrCharHandler<IRawStreamArray>(
	{
		"#": HandleExtensionGroup(ParseNoCaptureRecursively)
	},
	HandlePlainGroup(ParseNoCaptureRecursively)
)

function handleNoCaptureGroup(input: IOwnedStream<string>) {
	input.next() // (
	return OtherGroupHandler(input)
}

const maybeNoCaptureGroup = { "(": handleNoCaptureGroup }

const NoCaptureRegexTokenizer = CurrCharHandler<IRawStreamArray>(
	{
		...maybeEscaped,
		...maybeNegation,
		...maybeTypeMatch,
		...maybeNoCaptureGroup,
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
	return [
		NoCaptureGroupStream(),
		GroupBodyStream(),
		ParseNoCaptureRecursively,
		NoCaptureGroupLimitStream(),
		PeekStream()
	]
}
