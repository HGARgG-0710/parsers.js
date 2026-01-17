import {
	CachedTokenStream,
	DefaultChooser
} from "../../../../samples/Stream.js"
import { Digit } from "../Nodes.js"

const DigitStream = CachedTokenStream(Digit)
export const HandleDigit = DefaultChooser(DigitStream)
