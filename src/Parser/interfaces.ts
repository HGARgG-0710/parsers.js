import type { Collection } from "src/Pattern/Collection/interfaces.js"
import type { ParsingState } from "./GeneralParser/interfaces.js"
import type { BasicStream } from "src/Stream/BasicStream/interfaces.js"

export type BaseParsingState = ParsingState<BasicStream, any, any>
export type BaseMapParsingState = ParsingState<BasicStream, any, any>
export type DefaultMapParsingState = ParsingState<BasicStream, Collection, Collection>

export * as BasicParser from "./BasicParser/interfaces.js"
export * as GeneralParser from "./GeneralParser/interfaces.js"
export * as LayeredParser from "./LayeredParser/interfaces.js"
export * as ParserMap from "./ParserMap/interfaces.js"
export * as PatternValidator from "./PatternValidator/interfaces.js"
export * as PositionalValidator from "./PositionalValidator/interfaces.js"
export * as SkipParser from "./SkipParser/interfaces.js"
export * as StreamLocator from "./StreamLocator/interfaces.js"
export * as StreamTokenizer from "./StreamTokenizer/interfaces.js"
export * as StreamValidator from "./StreamValidator/interfaces.js"
