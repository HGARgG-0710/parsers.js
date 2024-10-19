import type { ParserFunction } from "../TableMap/interfaces.js"
import type { SkipType, SkipState, FixedSkipState } from "./interfaces.js"
import type { Position } from "../../Position/interfaces.js"

import { ArrayCollection } from "../../Pattern/Collection/classes.js"
import { GeneralParser, DefineFinished } from "../GeneralParser/classes.js"
import { firstFinished } from "../methods.js"
import { fixedParserChange, skipParserChange } from "./methods.js"

export function SkipParser<OutType = any>(
	parser: ParserFunction<SkipState<OutType>, SkipType<Iterable<OutType>>>
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
		parser: ParserFunction<FixedSkipState<OutType>, Iterable<OutType>>
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
