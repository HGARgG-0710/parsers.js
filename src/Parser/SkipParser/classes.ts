import { ArrayCollection } from "src/Pattern/Collection/classes.js"
import { GeneralParser, DefineFinished } from "../GeneralParser/classes.js"
import type { ParserMap } from "../ParserMap/interfaces.js"
import { firstFinished } from "../utils.js"
import type { SkipType, SkipState, FixedSkipState } from "./interfaces.js"
import { fixedParserChange, skipParserChange } from "./methods.js"
import type { Position } from "_src/types.js"

export function SkipParser<KeyType = any, OutType = any>(
	parser: ParserMap<KeyType, SkipType<Iterable<OutType>>, SkipState<KeyType, OutType>>
) {
	return GeneralParser<SkipState<KeyType, OutType>>(
		DefineFinished(
			{
				parser,
				result: ArrayCollection(),
				change: skipParserChange<KeyType, OutType>
			},
			firstFinished<SkipState<KeyType, OutType>>
		)
	)
}

export function FixedSkipParser(n: Position) {
	const fixedChange = fixedParserChange(n)
	return <KeyType = any, OutType = any>(
		parser: ParserMap<KeyType, Iterable<OutType>, FixedSkipState<KeyType, OutType>>
	) =>
		GeneralParser<FixedSkipState<KeyType, OutType>>(
			DefineFinished(
				{
					change: fixedChange<KeyType, OutType>,
					parser,
					result: ArrayCollection()
				},
				firstFinished<FixedSkipState<KeyType, OutType>>
			)
		)
}

export const StreamParser = FixedSkipParser(1)
