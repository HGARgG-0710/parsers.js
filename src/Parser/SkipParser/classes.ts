import { ArrayCollection } from "../../Pattern/Collection/classes.js"
import { GeneralParser, DefineFinished } from "../GeneralParser/classes.js"
import type { ParserMap } from "../ParserMap/interfaces.js"
import { firstFinished } from "../utils.js"
import type { SkipType, SkipState, FixedSkipState } from "./interfaces.js"
import { fixedParserChange, skipParserChange } from "./methods.js"
import type { Position } from "../../Stream/PositionalStream/Position/interfaces.js"

export function SkipParser<OutType = any>(
	parser: ParserMap<SkipType<Iterable<OutType>>, SkipState<OutType>>
) {
	return GeneralParser<SkipState<OutType>>(
		DefineFinished(
			{
				parser,
				result: ArrayCollection(),
				change: skipParserChange<OutType>
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
