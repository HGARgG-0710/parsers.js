import { object } from "@hgargg-0710/one"
import assert from "node:assert"
import type { IStreamChooser, IStreamPredicate } from "../../../interfaces.js"
import { Regex, TableHandler } from "../../../objects.js"
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

function getExtensionGroupsParsers(
	recursive: IStreamChooser,
	extensions: Regex.Extension[]
) {
	return dekv(
		Pairs.from(
			extensions
				.filter((ext) => ext.getParserTableRow)
				.map((ext) => {
					const row = ext.getParserTableRow!(recursive)
					const char = row[0]
					assert(char.length === 1)
					return row
				})
		)
	)
}

export function HandleExtensionGroup(extensions: Regex.Extension[]) {
	const recursiveParser = ParseRegexRecursively(extensions)
	return TableHandler(
		new BasicPeekHash(
			ObjectMap(
				{
					...getExtensionGroupsParsers(recursiveParser, extensions),
					i: () => [
						IgnoreCaseGroupStream(),
						GroupBodyStream(),
						recursiveParser,
						IgnoreCaseLimitStream(),
						PeekStream()
					]
				},
				HandleSingleChar
			)
		)
	)
}
