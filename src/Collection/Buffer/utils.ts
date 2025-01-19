import type { FreezableBuffer, Bufferized } from "./interfaces.js"
import { isCollection } from "../utils.js"

import { type, object, boolean, functional } from "@hgargg-0710/one"
const { T } = boolean
const { and } = functional
const { structCheck } = object
const { isBoolean, isFunction } = type

export const isFreezableBuffer = and(
	structCheck({
		value: T,
		isFrozen: isBoolean,
		freeze: isFunction,
		read: isFunction
	}),
	isCollection
) as <Type = any>(x: any) => x is FreezableBuffer<Type>

export const isBufferized = structCheck<Bufferized>({ buffer: isFreezableBuffer }) as <
	Type = any
>(
	x: any
) => x is Bufferized<Type>
