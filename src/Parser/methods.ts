import type { BasicStream } from "src/Stream/interfaces.js"
import type { ParsingState } from "./GeneralParser/interfaces.js"
import type { BaseParsingState } from "./interfaces.js"

export const firstFinished = function <T extends BaseParsingState = ParsingState>(
	this: T
) {
	return (this.streams as BasicStream[])[0].isEnd
}

export * as BasicParser from "./BasicParser/methods.js"
export * as LayeredParser from "./LayeredParser/methods.js"
export * as SkipParser from "./SkipParser/methods.js"
export * as StreamLocator from "./StreamLocator/methods.js"
export * as StreamTokenizer from "./StreamTokenizer/methods.js"
export * as StreamValidator from "./StreamValidator/methods.js"
