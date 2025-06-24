import type { ParseableInput } from "../../../dist/src/classes.js"
import type { IIndexed, IParseable } from "../../../dist/src/interfaces.js"
import { ClassTest } from "../lib.js"
import { read } from "../Readable/lib.js"
import { size } from "../Sizeable/lib.js"

import { object, type } from "@hgargg-0710/one"

const { structCheck } = object
const { isFunction, isNumber } = type

export const EMPTY = 0
export const NON_EMPTY = 1

const ParseableInterface = {
	interfaceName: "IParseable",
	conformance: structCheck<IParseable<string>>({
		read: isFunction,
		size: isNumber,
		copy: isFunction
	})
}

class ParseableInputTest extends ClassTest<ParseableInput> {
	read(from: number, to: number, expected: IIndexed<string>) {
		this.testMethod("read", from, to, expected)
	}

	size(expectedSize: number) {
		this.testMethod("size", expectedSize)
	}

	constructor() {
		super([ParseableInterface], [read, size])
	}
}

export const parseableInputTest = new ParseableInputTest()
