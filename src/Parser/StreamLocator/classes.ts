import { GeneralParser, DefineFinished } from "../GeneralParser/classes.js"
import type { ParserMap } from "../ParserMap/interfaces.js"
import type { LocatorState } from "./interfaces.js"
import { streamLocatorChange, streamLocatorFinished } from "./methods.js"

export function StreamLocator(locator: ParserMap<boolean, LocatorState>) {
	return GeneralParser<LocatorState>(
		DefineFinished<LocatorState>(
			{
				change: streamLocatorChange,
				parser: locator,
				result: [false, 0]
			},
			streamLocatorFinished
		)
	)
}
