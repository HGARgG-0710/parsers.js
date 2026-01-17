import {
	CachedTokenStream,
	DefaultChooser
} from "../../../../samples/Stream.js"
import { Word } from "../Nodes.js"

const WordStream = CachedTokenStream(Word)
export const HandleWord = DefaultChooser(WordStream)
