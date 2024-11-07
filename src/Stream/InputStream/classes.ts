import type { FreezableBuffer } from "src/Collection/Buffer/interfaces.js"
import type { InputStream as InputStreamType } from "./interfaces.js"

import { StreamClass } from "../StreamClass/classes.js"

import {
	inputStreamDefaultIsEnd,
	inputStreamCurr,
	inputStreamIsEnd,
	inputStreamIsStart,
	inputStreamNext,
	inputStreamPrev
} from "./methods.js"

export const InputStream = StreamClass({
	currGetter: inputStreamCurr,
	baseNextIter: inputStreamNext,
	basePrevIter: inputStreamPrev,
	isCurrEnd: inputStreamIsEnd,
	isCurrStart: inputStreamIsStart,
	defaultIsEnd: inputStreamDefaultIsEnd,
	hasPosition: true,
	buffer: true
}) as new <Type = any>(buffer?: FreezableBuffer<Type>) => InputStreamType<Type>
