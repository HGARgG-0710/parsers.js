import { GeneralParser, DefineFinished } from "../GeneralParser/classes.js"
import type { ParserMap } from "../ParserMap/interfaces.js"
import type { LocatorState } from "./interfaces.js"
import { streamLocatorChange, streamLocatorFinished } from "./methods.js"

export function StreamLocator<KeyType = any>(
	locator: ParserMap<KeyType, boolean, LocatorState<KeyType>>
) {
	return GeneralParser<LocatorState<KeyType>>(
		DefineFinished<LocatorState<KeyType>>(
			{
				change: streamLocatorChange<KeyType>,
				parser: locator,
				result: [false, 0]
			},
			streamLocatorFinished
		)
	)
}
