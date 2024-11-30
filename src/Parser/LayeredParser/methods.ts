import { LayeredParser } from "./classes.js"

const { get, set } = Object.getOwnPropertyDescriptor(
	LayeredParser.prototype,
	"layers"
)! as { get: () => any; set: (x: Function[]) => any }

export const layers = { get, set }
