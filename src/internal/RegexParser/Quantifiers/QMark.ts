import type { array } from "@hgargg-0710/one"
import type { INodeType, IStreamChooser } from "../../../interfaces.js"
import { Optional, Temp } from "../Nodes.js"
import { handleQuantifier } from "./Greedy.js"

export const maybeQMark: array.Pairs<INodeType, IStreamChooser> = [
	[Temp.QMark, handleQuantifier(Optional)]
]
