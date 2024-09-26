import type { PositionalInputtedStream } from "./interfaces.js"

export function positionalStreamNext<Type = any>(
	this: PositionalInputtedStream<Type, number>
) {
	++this.pos
	return this.input.next()
}
