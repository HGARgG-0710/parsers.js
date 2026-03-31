import { object, type } from "@hgargg-0710/one"
import type { IDebugPrintable } from "../interfaces.js"

const { structCheck } = object
const { isFunction } = type

export const isDebugPrintable = structCheck<IDebugPrintable>({
	debugPrint: isFunction
})

export function debugPrint(item: any): string {
	return isDebugPrintable(item) ? item.debugPrint() : String(item)
}
