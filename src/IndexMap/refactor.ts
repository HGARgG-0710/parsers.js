import type { Sizeable } from "./interfaces.js"
import { isGoodIndex } from "../utils.js"

export const inBound = (index: number, collection: Sizeable) =>
	isGoodIndex(index) && index < collection.size
