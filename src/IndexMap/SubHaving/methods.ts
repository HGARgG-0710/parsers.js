export const delegate = (delegatePropName: string) => (delegateMethodName: string) =>
	function (...delegateArgs: any[]) {
		return this[delegatePropName][delegateMethodName](...delegateArgs)
	}

export const thisReturningDelegate =
	(delegatePropName: string) => (delegateMethodName: string) =>
		function (...delegateArgs: any[]) {
			this[delegatePropName][delegateMethodName](...delegateArgs)
			return this
		}

export const delegateProperty = (delegatePropName: string) => (propName: string) =>
	function () {
		return this[delegatePropName][propName]
	}

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

export const [subIndex, subByIndex] = ["index", "byIndex"].map(delegate)
