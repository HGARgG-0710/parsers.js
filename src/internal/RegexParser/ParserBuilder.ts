import type {
	IInputStream,
	INode,
	IOwnedStream,
	IParseable,
	IRawStreamArray
} from "../../interfaces.js"
import {
	CachingLocator,
	PosCarryingLocator
} from "../../modules/Stream/objects/Locator.js"
import { DynamicParser, ErrorData, Regex } from "../../objects.js"
import {
	CompositeStream,
	InputStream,
	PeekStream,
	PosStream
} from "../../objects/Stream.js"
import { SingletonWrapperStream } from "../../samples/Stream.js"
import { ProduceDisjunction } from "./Disjunction.js"
import { RootNode } from "./Nodes.js"
import { QuantifierProcessor } from "./Quantifiers.js"
import { RegexTokenizer } from "./Tokenizer.js"

const RootNodeStream = SingletonWrapperStream(RootNode)

function regexWorkStreamMaker(extensions: Regex.Extension[]) {
	const recursiveParser = ParseRegexRecursively(extensions)
	return () =>
		CompositeStream<INode>(
			RootNodeStream(),
			...recursiveParser(),
			PosStream.pool.create()
		)()
}

const regexInputStreamMaker = () => new InputStream<string>()

const regexErrorDataMaker = (inputStream: IInputStream<string, IParseable>) =>
	new ErrorData.StreamListErrorData(
		inputStream,
		(inputStream) =>
			new ErrorData.ErrorPosition.PosCarrying(
				inputStream,
				new CachingLocator(PosCarryingLocator.downwards)
			)
	)

export function ParseRegexRecursively(extensions: Regex.Extension[]) {
	const Tokenizer = RegexTokenizer(extensions)
	return function (input?: IOwnedStream<string>): IRawStreamArray {
		return [
			ProduceDisjunction,
			QuantifierProcessor,
			PeekStream(),
			Tokenizer
		]
	}
}

export function getParser(extensions: Regex.Extension[]) {
	return DynamicParser(
		new DynamicParser.Config(
			regexWorkStreamMaker(extensions),
			regexInputStreamMaker,
			regexErrorDataMaker
		)
	)
}
