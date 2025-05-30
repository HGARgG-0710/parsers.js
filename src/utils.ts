import { boolean } from "@hgargg-0710/one"
import { BadIndex } from "./constants.js"
import type { IKeysHaving, IResource, IValuesHaving } from "./interfaces.js"

const { eqcurry } = boolean

/**
 * Returns whether or not the given `number` is greater than `BadIndex`
 */
export const isGoodIndex = (x: number) => x > BadIndex

/**
 * Given a string, returns whether it's a valid hexidecimal number
 */
export const isHex = (x: string) => /^[0-9A-Fa-f]+$/.test(x)

/**
 * Given a string, return whether it's a valid decimal number
 */
export const isDecimal = (x: string) => /^[0-9]+$/.test(x)

export const isLF = eqcurry("\n")

export function withResource<T = any>(
	resource: IResource,
	callback: (r: IResource) => T
) {
	const retval = callback(resource)
	resource.cleanup()
	return retval
}

/**
 * Returns the pair of `indexMap.keys` and `indexMap.values`
 */
export function table<KeyType = any, ValueType = any>(
	kv: IKeysHaving<KeyType> & IValuesHaving<ValueType>
): [KeyType[], ValueType[]] {
	return [kv.keys, kv.values]
}

export * as Node from "./utils/Node.js"
export * as Stream from "./utils/Stream.js"
