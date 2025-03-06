import type { FreezableBuffer } from "../../Collection/Buffer/interfaces.js"
import type { IInputStream } from "./interfaces.js"

import { StreamClass } from "../StreamClass/abstract.js"

import {
	inputStreamDefaultIsEnd,
	inputStreamCurr,
	inputStreamIsEnd,
	inputStreamIsStart,
	inputStreamNext,
	inputStreamPrev
} from "./refactor.js"

export const InputStream = StreamClass({
	currGetter: inputStreamCurr,
	baseNextIter: inputStreamNext,
	basePrevIter: inputStreamPrev,
	isCurrEnd: inputStreamIsEnd,
	isCurrStart: inputStreamIsStart,
	defaultIsEnd: inputStreamDefaultIsEnd,
	hasPosition: true,
	buffer: true
}) as new <Type = any>(buffer?: FreezableBuffer<Type>) => IInputStream<Type>
