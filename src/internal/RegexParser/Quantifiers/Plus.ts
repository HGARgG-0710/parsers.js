import type { array } from "@hgargg-0710/one"
import type { INodeType, IStreamChooser } from "../../../interfaces.js"
import { Plus } from "../Nodes.js"
import { handleQuantifier } from "./Greedy.js"

export const maybePlus: array.Pairs<INodeType, IStreamChooser> = [
	[Plus, handleQuantifier]
]
