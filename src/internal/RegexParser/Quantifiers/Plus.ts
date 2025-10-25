import type { array } from "@hgargg-0710/one"
import type { INodeType, IStreamChooser } from "../../../interfaces.js"
import { OneOrMore, Temp } from "../Nodes.js"
import { handleQuantifier } from "./Greedy.js"

export const maybePlus: array.Pairs<INodeType, IStreamChooser> = [
	[Temp.Plus, handleQuantifier(OneOrMore)]
]
