// * The file contains various delegate methods used by the library's classes

import { delegate, thisReturningDelegate, delegateProperty } from "src/utils.js"

export const [valueDelegate, valueThisDelegate, valuePropDelegate] = [
	delegate,
	thisReturningDelegate,
	delegateProperty
].map((x) => x("value"))

export const [valueReplaceKey, valueSet, valueDelete, valueReplace] = [
	"replaceKey",
	"set",
	"delete"
].map(valueThisDelegate)

export const [
	valueSize,
	valueKeys,
	valueValues,
	valueDefault,
	valueCurr,
	valueDefaultIsEnd,
	valueDefaultIsStart
] = ["size", "keys", "values", "default", "curr", "isEnd", "isStart"].map(
	valuePropDelegate
)

export const [
	valueIndex,
	valueByIndex,
	valueGetIndex,
	valuePrev,
	valueNext,
	valueIsEnd,
	valueIsStart,
	valueRewind,
	valueFinish, 
	valueLength
] = [
	"index",
	"byIndex",
	"getIndex",
	"prev",
	"next",
	"isCurrEnd",
	"isCurrStart",
	"rewind",
	"finish", 
	"length"
].map(valueDelegate)

export * as Collection from "./Collection/methods.js"
export * as EliminablePattern from "./EliminablePattern/methods.js"
export * as EnumSpace from "./EnumSpace/methods.js"
export * as TokenizablePattern from "./TokenizablePattern/methods.js"
export * as ValidatablePattern from "./ValidatablePattern/methods.js"
