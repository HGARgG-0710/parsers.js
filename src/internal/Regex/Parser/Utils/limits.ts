import { skip } from "../../../../objects/Error.js"
import {
	isCurr,
	isNext,
	isNotNext,
	isNotNonEscapedNext
} from "../../../../samples/Stream.js"

export const skipOpbrace = skip("{")
export const isNextOpbrace = isNext("{")
export const isNotNextClbrace = isNotNext("}")
export const isCurrClbrace = isCurr("}")
export const isNotNonEscapedNextClbrace = isNotNonEscapedNext("}")
