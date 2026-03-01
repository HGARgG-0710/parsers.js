import type {
	INodeType,
	IStatelessStreamChooser
} from "../../../../interfaces.js"
import { NoneOrMore, Temp } from "../Nodes.js"
import { handleQuantifier } from "./Common.js"

export const maybeStar: Iterable<[INodeType, IStatelessStreamChooser]> = [
	[Temp.Star, handleQuantifier(NoneOrMore)]
]
