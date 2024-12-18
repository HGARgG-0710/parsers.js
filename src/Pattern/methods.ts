// * The file contains various delegate methods used by the library's classes

import { delegate, thisReturningDelegate, delegateProperty } from "../utils.js"

export const [valueDelegate, valueThisDelegate, valuePropDelegate] = [
	delegate,
	thisReturningDelegate,
	delegateProperty
].map((x) => x("value"))

export const [valueReplaceKey, valueReplace] = ["replaceKey", "replace"].map(
	valueThisDelegate
)

export const [
	valueKeys,
	valueValues,
	valueDefault,
	valueCurr,
	valueDefaultIsEnd,
	valueDefaultIsStart
] = ["keys", "values", "default", "curr", "isEnd", "isStart"].map(valuePropDelegate)

export const [
	valueIndex,
	valueByIndex,
	valuePrev,
	valueNext,
	valueIsEnd,
	valueIsStart,
	valueRewind,
	valueFinish
] = [
	"index",
	"byIndex",
	"prev",
	"next",
	"isCurrEnd",
	"isCurrStart",
	"rewind",
	"finish"
].map(valueDelegate)
