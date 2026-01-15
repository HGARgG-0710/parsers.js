import type { array } from "@hgargg-0710/one"
import type {
	INodeType,
	IStatelessStreamChooser
} from "../../../../interfaces.js"
import { Optional, Temp } from "../Nodes.js"
import { handleQuantifier } from "./Common.js"

export const maybeQMark: array.Pairs<INodeType, IStatelessStreamChooser> = [
	[Temp.QMark, handleQuantifier(Optional)]
]
