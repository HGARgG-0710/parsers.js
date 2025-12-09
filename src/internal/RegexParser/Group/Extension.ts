import { object } from "@hgargg-0710/one"
import assert from "node:assert"
import type {
	IOwnedStream,
	IRawStreamArray,
	IStreamChooser,
	IStreamPredicate
} from "../../../interfaces.js"
import { Parametrized, Regex, TableHandler } from "../../../objects.js"
import { skip } from "../../../objects/Error.js"
import { PeekStream } from "../../../objects/Stream.js"
import { Pairs } from "../../../samples.js"
import { SingletonWrapperStream } from "../../../samples/Stream.js"
import { ObjectMap } from "../../../samples/TerminalMap.js"
import { GroupBodyStream, GroupLimitStream } from "../Group.js"
import { IgnoreCaseGroup } from "../Nodes.js"
import { BasicPeekHash } from "../Parser.js"
import { ParseRegexRecursively } from "../ParserBuilder.js"
import { HandleSingleChar } from "../SingleChar.js"

const { dekv } = object

const skipExtension = skip("#")
const skipIgnoreCase = skip("i")

function ExtensionGroupLimitStream(from: IStreamPredicate<string>) {
	return GroupLimitStream((input) => {
		skipExtension(input) // #
		return from(input)
	})
}

const IgnoreCaseGroupStream = SingletonWrapperStream(IgnoreCaseGroup)
const IgnoreCaseLimitStream = ExtensionGroupLimitStream((input) => {
	skipIgnoreCase(input) // i
	return 0
})

const getExtensionGroupsParsers = new Parametrized(
	(extensions: Regex.Extension[]) => {
		return dekv(
			Pairs.from(
				extensions
					.filter((ext) => ext.getParserTableRow)
					.map((ext) => {
						const row = ext.getParserTableRow!(
							ParseRegexRecursively
						)
						const [char] = row
						assert(char.length === 1)
						return row
					})
			)
		)
	}
)

export const HandleExtensionGroup = new Parametrized(
	(extensions: Regex.Extension[]) =>
		TableHandler<IOwnedStream, IRawStreamArray>(
			new BasicPeekHash(
				ObjectMap<IStreamChooser>(
					{
						...getExtensionGroupsParsers.for(extensions),
						i: (): IRawStreamArray => [
							IgnoreCaseGroupStream(),
							GroupBodyStream(),
							ParseRegexRecursively.for(extensions),
							IgnoreCaseLimitStream(),
							PeekStream()
						]
					},
					HandleSingleChar
				)
			)
		)
)
