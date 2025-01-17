// * The file contains various delegate methods used by the library's classes

import { delegate, delegateProperty } from "../utils.js"

export const [valueDelegate, valuePropDelegate] = [
	delegate,
	delegateProperty
].map((x) => x("value"))

export const [valueCurr, valueDefaultIsEnd, valueDefaultIsStart] = [
	"curr",
	"isEnd",
	"isStart"
].map(valuePropDelegate)

export const [valuePrev, valueNext, valueIsEnd, valueIsStart, valueRewind, valueFinish] =
	["prev", "next", "isCurrEnd", "isCurrStart", "rewind", "finish"].map(valueDelegate)
