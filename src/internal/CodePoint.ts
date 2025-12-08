import assert from "node:assert"

export function charAfter(x: string) {
	return String.fromCodePoint(x.codePointAt(0)! + 1)
}

export function charBefore(x: string) {
	const codePoint = x.codePointAt(0)!
	assert(codePoint > 0)
	return String.fromCodePoint(codePoint - 1)
}
