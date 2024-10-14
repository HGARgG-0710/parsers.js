import type { ParserFunction } from "../TableMap/interfaces.js"
import type { LocatorState } from "./interfaces.js"
import { GeneralParser, DefineFinished } from "../GeneralParser/classes.js"
import { streamLocatorChange, streamLocatorFinished } from "./methods.js"

export function StreamLocator(locator: ParserFunction<LocatorState, boolean>) {
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
