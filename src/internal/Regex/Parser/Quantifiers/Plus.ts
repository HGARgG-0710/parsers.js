import type { array } from "@hgargg-0710/one"
import type {
	INodeType,
	IStatelessStreamChooser
} from "../../../../interfaces.js"
import { OneOrMore, Temp } from "../Nodes.js"
import { handleQuantifier } from "./Common.js"

export const maybePlus: array.Pairs<INodeType, IStatelessStreamChooser> = [
	[Temp.Plus, handleQuantifier(OneOrMore)]
]
