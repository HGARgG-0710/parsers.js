import { ArrayCollection } from "src/Pattern/Collection/classes.js"
import { GeneralParser, DefineFinished } from "../GeneralParser/classes.js"
import type { ParserMap } from "../ParserMap/interfaces.js"
import { firstFinished } from "../utils.js"
import type { SkipType, SkipState, FixedSkipState } from "./interfaces.js"
import { fixedParserChange, skipParserChange } from "./methods.js"
import type { Position } from "src/Stream/PositionalStream/Position/interfaces.js"

export function SkipParser<KeyType = any, OutType = any>(
	parser: ParserMap<SkipType<Iterable<OutType>>, SkipState<OutType>>
) {
	return GeneralParser<SkipState<OutType>>(
		DefineFinished(
			{
				parser,
				result: ArrayCollection(),
				change: skipParserChange<KeyType, OutType>
			},
			firstFinished<SkipState<OutType>>
		)
	)
}

export function FixedSkipParser(n: Position) {
	const fixedChange = fixedParserChange(n)
	return <OutType = any>(
		parser: ParserMap<Iterable<OutType>, FixedSkipState<OutType>>
	) =>
		GeneralParser<FixedSkipState<OutType>>(
			DefineFinished(
				{
					change: fixedChange<OutType>,
					parser,
					result: ArrayCollection()
				},
				firstFinished<FixedSkipState<OutType>>
			)
		)
}

export const StreamParser = FixedSkipParser(1)
