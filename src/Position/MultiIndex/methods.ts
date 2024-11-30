import { MultiIndex } from "./classes.js"

const { prototype } = MultiIndex

const { get, set } = Object.getOwnPropertyDescriptor(prototype, "levels")! as {
	get: () => any
	set: () => any
}

export const { firstLevel, lastLevel, slice, compare, equals, copy, convert } = prototype
export const layers = { get, set }

export namespace MultiIndexModifier {
	export const { nextLevel, prevLevel, resize, clear, incLast, decLast, extend, init } =
		MultiIndex.MultiIndexModifier.prototype
}
