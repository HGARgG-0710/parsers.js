import type {
	ICompositeStream,
	IInputStream,
	INode,
	IParseable,
	IRawStreamArray
} from "../../interfaces.js"
import {
	CachingLocator,
	PosCarryingLocator
} from "../../modules/Stream/objects/Locator.js"
import { ErrorData, Parametrized, Regex } from "../../objects.js"
import {
	CompositeStream,
	InputStream,
	ParseStream,
	PeekStream,
	PosStream
} from "../../objects/Stream.js"
import { SingletonWrapperStream } from "../../samples/Stream.js"
import { ProduceDisjunction } from "./Disjunction.js"
import { RootNode } from "./Nodes.js"
import { QuantifierProcessor } from "./Quantifiers.js"
import { RegexTokenizer } from "./Tokenizer.js"

const RootNodeStream = SingletonWrapperStream(RootNode)

const regexWorkStreamMaker = new Parametrized(
	(extensions: Regex.Extension[]) => {
		return (): ICompositeStream<INode> =>
			CompositeStream<INode>(
				RootNodeStream(),
				...ParseRegexRecursively.for(extensions)(),
				PosStream.pool.create()
			)()
	}
)

const regexInputStreamMaker = () => new InputStream<string>()

const regexErrorDataMaker = (
	inputStream: IInputStream<string, IParseable<string>>
) =>
	new ErrorData.StreamListErrorData(
		inputStream,
		(inputStream) =>
			new ErrorData.ErrorPosition.PosCarrying(
				inputStream,
				new CachingLocator(PosCarryingLocator.upwards)
			)
	)

export const ParseRegexRecursively = new Parametrized(
	(extensions: Regex.Extension[]) => {
		return (): IRawStreamArray => [
			ProduceDisjunction,
			QuantifierProcessor,
			PeekStream(),
			RegexTokenizer.for(extensions)
		]
	}
)

export function getParser(extensions: Regex.Extension[]) {
	return ParseStream(
		new ParseStream.Config(
			regexWorkStreamMaker.for(extensions),
			regexInputStreamMaker,
			regexErrorDataMaker
		)
	)()
}
