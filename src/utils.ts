import { boolean, object, type } from "@hgargg-0710/one"
import type { Summat } from "@hgargg-0710/summat.ts"
import type { Enum } from "./classes.js"
import { BadIndex } from "./constants.js"
import type {
	IBufferized,
	ICopiable,
	IIndexAssignable,
	IIndexed,
	IMappable,
	IPersistentAccumulator,
	ISizeable,
	IStateful,
	IStateSettable
} from "./interfaces.js"
import type { IPosed } from "./Stream/interfaces/Position.js"

const { prop, structCheck } = object
const { eqcurry, T } = boolean
const { isFunction } = type

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

/**
 * Returns the `.length` of the given `Indexed` object
 */
export const length = prop("length") as <Type = any>(
	x: IIndexed<Type>
) => number

/**
 * Returns the `.size` of the given `Sizeable` object
 */
export const size = prop("size") as (x: ISizeable) => number

/**
 * Returns the `.state` of the given `Stateful`
 */
export const state = prop("state") as (x: IStateful) => Summat

/**
 * Returns the `.buffer` property of the given `Bufferized`
 */
export const buffer = prop("buffer") as <Type = any>(
	x: IBufferized<Type>
) => IPersistentAccumulator<Type>

/**
 * Returns the `.pos` property of the given `Posed` object
 */
export const pos = prop("pos") as <Type = any>(x: IPosed<Type>) => Type

/**
 * Sets the value of the `x.assignedIndex` property to `assignedIndex`
 */
export const assignIndex = <Type = any>(
	x: IIndexAssignable<Type>,
	assignedIndex: Type
) => (x.assignedIndex = assignedIndex)

/**
 * Returns a function mapping `enums` using `f`
 */
export const fromEnum =
	<T = any, Type = any>(f?: IMappable<T, Type>) =>
	(enums: Enum<T>) =>
		enums.map(f)

export const resource = prop("resource")

export const isLF = eqcurry("\n")

export const isCopiable = structCheck<ICopiable>({ copy: isFunction })

export const isStateful = structCheck<IStateful & IStateSettable>({
	state: T,
	setState: isFunction
})

export * as HashMap from "./utils/HashMap.js"
export * as IndexMap from "./utils/IndexMap.js"
export * as Node from "./utils/Node.js"
export * as Stream from "./utils/Stream.js"
