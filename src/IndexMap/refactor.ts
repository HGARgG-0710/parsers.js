import type { Sizeable } from "./interfaces.js"
import { isGoodIndex } from "../utils.js"

export const inBound = (index: number, collection: Sizeable) =>
	isGoodIndex(index) && upperBound(collection)(index)

export const upperBound = (collection: Sizeable) => (index: number) =>
	index < collection.size
