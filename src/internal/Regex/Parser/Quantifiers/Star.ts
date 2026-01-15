import type { array } from "@hgargg-0710/one"
import type {
	INodeType,
	IStatelessStreamChooser
} from "../../../../interfaces.js"
import { NoneOrMore, Temp } from "../Nodes.js"
import { handleQuantifier } from "./Common.js"

export const maybeStar: array.Pairs<INodeType, IStatelessStreamChooser> = [
	[Temp.Star, handleQuantifier(NoneOrMore)]
]
