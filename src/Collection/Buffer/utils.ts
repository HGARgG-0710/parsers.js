import type { FreezableBuffer, Bufferized } from "./interfaces.js"
import { isCollection } from "../utils.js"

import { type, object, functional } from "@hgargg-0710/one"
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
		read: isFunction
	}),
	isCollection
) as <Type = any>(x: any) => x is FreezableBuffer<Type>

/**
 * Returns whether the given `x` is a `Bufferized`
 */
export const isBufferized = structCheck<Bufferized>({ buffer: isFreezableBuffer }) as <
	Type = any
>(
	x: any
) => x is Bufferized<Type>
