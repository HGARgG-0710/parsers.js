import type {
	INodeType,
	IStatelessStreamChooser
} from "../../../../interfaces.js"
import { Optional, Temp } from "../Nodes.js"
import { handleQuantifier } from "./Common.js"

export const maybeQMark: Iterable<[INodeType, IStatelessStreamChooser]> = [
	[Temp.QMark, handleQuantifier(Optional)]
]
