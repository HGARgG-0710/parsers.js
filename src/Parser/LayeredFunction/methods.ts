import { LayeredFunction } from "./classes.js"

const { get, set } = Object.getOwnPropertyDescriptor(
	LayeredFunction.prototype,
	"layers"
)! as { get: () => any; set: (x: Function[]) => any }

export const layers = { get, set }
