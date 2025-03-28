import type { Summat } from "@hgargg-0710/summat.ts"
import type { IStateful } from "../../../interfaces.js"
import type { IComposition } from "../interfaces.js"

export interface IComplexComposition<StateType extends Summat = Summat>
	extends IComposition,
		IStateful<StateType> {}

export interface IParserState extends Summat {
	parser: IDynamicParser
}

export type IDynamicParser = IComplexComposition<IParserState>
