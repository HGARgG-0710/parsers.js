import assert from "node:assert"
import { Config } from "../../global.js"

export function charAfter(x: string) {
	return String.fromCodePoint(x.codePointAt(0)! + 1)
}

export function charBefore(x: string) {
	const codePoint = x.codePointAt(0)!
	assert(codePoint > 0)
	return String.fromCodePoint(codePoint - 1)
}

export function toLowerCase(char: string) {
	return char.toLocaleLowerCase(Config.unicode.locales)
}

export function toUpperCase(char: string) {
	return char.toLocaleUpperCase(Config.unicode.locales)
}
