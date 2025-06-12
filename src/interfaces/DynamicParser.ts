import type { Summat } from "@hgargg-0710/summat.ts"
import type { ICopiable, IInitializable } from "../interfaces.js"
import type { IStreamArray } from "./Stream.js"

/**
 * This is an interface employed by the library's
 * self-modifying parsers to store complex parser
 * state and allow the user to reference the parser's
 * internal state and composition (`.parse: IParse<FinalType, InitType>`).
 */
export interface IParseState<FinalType = any, InitType = any> extends Summat {
	readonly parse: IParse<FinalType, InitType>
}

/**
 * This is an interface for representing a self-modifying
 * parser's internal [modifiable] `IStream`-composition
 * (`.streams: IStreamArray`), accessing its state
 * (`.state: IParserState`), and registering the changes
 * made to the `.streams: IStreamArray` via the `.update()`
 * call.
 */
export interface IParse<FinalType = any, InitType = any>
	extends ICopiable,
		IInitializable<[InitType?, Summat?]> {
	readonly state: IParseState<FinalType, InitType>
	readonly streams: IStreamArray
	update(): void
}
