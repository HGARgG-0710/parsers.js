import type { array } from "@hgargg-0710/one"
import type { INodeType, IStreamChooser } from "../../../interfaces.js"
import { Star } from "../Nodes.js"
import { handleQuantifier } from "./Greedy.js"

export const maybeStar: array.Pairs<INodeType, IStreamChooser> = [
	[Star, handleQuantifier]
]
