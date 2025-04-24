import { functional, object, type } from "@hgargg-0710/one"
import { isCollection } from "../utils.js"
import type { IBufferized, IFreezableSequence } from "./interfaces.js"

const { and } = functional
const { structCheck } = object
const { isBoolean, isFunction } = type

/**
 * Returns whether the given `x` is a `FreezableBuffer`
 */
export const isFreezableBuffer = and(
	structCheck({
		isFrozen: isBoolean,
		freeze: isFunction,
		read: isFunction,
		write: isFunction
	}),
	isCollection
) as <Type = any>(x: any) => x is IFreezableSequence<Type>

/**
 * Returns whether the given `x` is a `Bufferized`
 */
export const isBufferized = structCheck<IBufferized>({
	buffer: isFreezableBuffer
}) as <Type = any>(x: any) => x is IBufferized<Type>
