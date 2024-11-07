import { isCollection } from "../utils.js"
import type { FreezableBuffer } from "./interfaces.js"

import { object, boolean, typeof as type, function as _f } from "@hgargg-0710/one"
const { structCheck } = object
const { T } = boolean
const { isBoolean, isFunction } = type
const { and } = _f

export const isFreezableBuffer = and(
	structCheck({
		value: T,
		isFrozen: isBoolean,
		freeze: isFunction,
		read: isFunction
	}),
	isCollection
) as <Type = any>(x: any) => x is FreezableBuffer<Type>
