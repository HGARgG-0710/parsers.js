import type { Summat } from "@hgargg-0710/summat.ts"
import type { IInitializable, IStateful } from "../../interfaces.js"
import type { IComposition } from "../interfaces.js"
import type { Signature } from "./classes.js"

export type ISignatureCallback<StateType extends Summat = Summat> = (
	thisArg: IComplexComposition<StateType>
) => Iterable<Signature>

export interface IComplexComposition<StateType extends Summat = Summat>
	extends IComposition,
		IStateful<StateType>,
		IInitializable<[ISignatureCallback], IComplexComposition<StateType>> {}

export interface IParserState extends Summat {
	parser: IDynamicParser
}

export type IDynamicParser = IComplexComposition<IParserState>
