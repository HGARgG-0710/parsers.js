import { delegate, thisReturningDelegate, delegateProperty } from "../../utils.js"

export const [subDelegate, subThisDelegate, subPropDelegate] = [
	delegate,
	thisReturningDelegate,
	delegateProperty
].map((x) => x("sub"))

export const [subReplaceKey, subSet, subDelete, subReplace] = [
	"replaceKey",
	"set",
	"delete"
].map(subThisDelegate)

export const [subSize, subKeys, subValues, subDefault] = [
	"size",
	"keys",
	"values",
	"default"
].map(subPropDelegate)

export const [subIndex, subByIndex, subGetIndex] = ["index", "byIndex", "getIndex"].map(
	delegate
)
