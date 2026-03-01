import type {
	INodeType,
	IStatelessStreamChooser
} from "../../../../interfaces.js"
import { OneOrMore, Temp } from "../Nodes.js"
import { handleQuantifier } from "./Common.js"

export const maybePlus: Iterable<[INodeType, IStatelessStreamChooser]> = [
	[Temp.Plus, handleQuantifier(OneOrMore)]
]
