import type { ParseableInput } from "../../../dist/src/classes.js"
import type { IIndexed, IParseable } from "../../../dist/src/interfaces.js"
import { MethodTest, MutableClassTest } from "../lib.js"
import { read } from "../Readable/lib.js"
import { sameSizeTest, size } from "../Sizeable/lib.js"

import { array, object, type } from "@hgargg-0710/one"
import { assertDistinct } from "../Copiable/lib.js"

const { structCheck } = object
const { isFunction, isNumber } = type

export function readWhole<T = any>(instance: IParseable<T>) {
	return array.numbers(instance.size).map((i) => instance.read(i))
}

export enum TestTypes {
	EMPTY = 0,
	NON_EMPTY = 1
}

const ParseableInterface = {
	interfaceName: "IParseable",
	conformance: structCheck<IParseable<string>>({
		read: isFunction,
		size: isNumber,
		copy: isFunction
	})
}

const copy = new MethodTest("copy", function (this: ParseableInput) {
	const copied = this.copy()
	sameSizeTest(this, copied)
	read.withInstance(copied, 0, this.size, readWhole(this))
	assertDistinct(this, copied)
})

class ParseableInputTest extends MutableClassTest<ParseableInput> {
	read(from: number, to: number, expected: IIndexed<string>) {
		this.testMethod("read", from, to, expected)
	}

	size(expectedSize: number) {
		this.testMethod("size", expectedSize)
	}

	copy() {
		this.testMethod("copy")
	}

	constructor() {
		super([ParseableInterface], [read, size, copy])
	}
}

export const parseableInputTest = new ParseableInputTest()
