import assert from "assert"

export class CodePointNavigator {
	static charAfter(x: string) {
		return String.fromCodePoint(x.codePointAt(0)! + 1)
	}

	static charBefore(x: string) {
		const codePoint = x.codePointAt(0)!
		assert(codePoint > 0)
		return String.fromCodePoint(codePoint - 1)
	}
}
