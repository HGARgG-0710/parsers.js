import type { array } from "@hgargg-0710/one"
import type {
	IOwnedStream,
	IRawStreamArray,
	IStreamChooser
} from "../../../interfaces.js"
import { TableHandler } from "../../../objects.js"
import { CurrentHash } from "../../../objects/HashMap.js"
import { PeekStream } from "../../../objects/Stream.js"
import { SingletonWrapperStream } from "../../../samples/Stream.js"
import { BasicMap, ObjectMap } from "../../../samples/TerminalMap.js"
import { maybeCharClass } from "../CharClass.js"
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

const OtherGroupHandler = TableHandler(
	new CurrentHash(
		ObjectMap(
			{
				"#": HandleExtensionGroup(ParseNoCaptureRecursively)
			},
			HandlePlainGroup(ParseNoCaptureRecursively)
		)
	)
)

function handleOtherGroup(input: IOwnedStream<string>) {
	input.next() // (
	return [OtherGroupHandler(input)]
}

const maybeOtherGroup: array.Pairs<string, IStreamChooser> = [
	["(", handleOtherGroup]
]

const NoCaptureRegexTokenizer = TableHandler<
	IOwnedStream<string>,
	IRawStreamArray
>(
	new CurrentHash(
		BasicMap(
			[
				...maybeEscaped,
				...maybeNegation,
				...maybeTypeMatch,
				...maybeOtherGroup,
				...maybeCharClass,
				...maybeDot,
				...maybePreQuantifier,
				...maybePipe
			],
			HandleSingleChar
		)
	)
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
		GroupLimitStream()
	]
}
