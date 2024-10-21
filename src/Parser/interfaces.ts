import type { Collection } from "../Pattern/Collection/interfaces.js"
import type { ParsingState } from "./GeneralParser/interfaces.js"
import type { BasicStream } from "../Stream/interfaces.js"

export type BaseParsingState = ParsingState<BasicStream, any, any>
export type BaseMapParsingState = ParsingState<BasicStream, any, any>
export type DefaultMapParsingState = ParsingState<BasicStream, Collection, Collection>

export type * as BasicParser from "./BasicParser/interfaces.js"
export type * as GeneralParser from "./GeneralParser/interfaces.js"
export type * as LayeredParser from "./LayeredParser/interfaces.js"
export type * as PatternValidator from "./PatternValidator/interfaces.js"
export type * as PositionalValidator from "./PositionalValidator/interfaces.js"
export type * as SkipParser from "./SkipParser/interfaces.js"
export type * as StreamLocator from "./StreamLocator/interfaces.js"
export type * as StreamTokenizer from "./StreamTokenizer/interfaces.js"
export type * as StreamValidator from "./StreamValidator/interfaces.js"
export type * as TableMap from "./TableMap/interfaces.js"
