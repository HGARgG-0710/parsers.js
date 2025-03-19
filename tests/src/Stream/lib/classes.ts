import assert from "assert"
import { iterationTest, method, property } from "lib/lib.js"

import type {
	IChange,
	IPosed,
	IPosition
} from "../../../../dist/src/Position/interfaces.js"

import type {
	INavigable,
	IStreamClassInstance,
	IRewindable,
	IFinishable,
	IReversedStreamClassInstance
} from "../../../../dist/src/Stream/StreamClass/interfaces.js"

import type { IReversibleStream } from "../../../../dist/src/Stream/ReversibleStream/interfaces.js"

import { uniFinish } from "../../../../dist/src/Stream/StreamClass/utils.js"

import { next, previous } from "../../../../dist/src/Stream/utils.js"

import { array } from "@hgargg-0710/one"
const { same } = array

export function generalNavigateTest(
	instance: IStreamClassInstance & INavigable,
	expected: any,
	position: IPosition
) {
	method(
		"navigate",
		() => {
			instance.navigate(position)
			assert.strictEqual(instance.curr, expected)
		},
		position
	)
}

const pickTestDirection = (
	direction: boolean
): ["isEnd" | "isStart", IChange] =>
	direction ? ["isEnd", next] : ["isStart", previous]

export function generalBoundTest(direction: boolean) {
	const [boundName, change] = pickTestDirection(direction)
	const [beginningBoundName] = pickTestDirection(!direction)
	return function (
		stream: IReversibleStream,
		expected: any[],
		compare: (x: any, y: any) => boolean,
		timesRecheck: number = 1
	) {
		if (!direction) uniFinish(stream)

		assert(stream[beginningBoundName])
		if (expected.length) assert(!stream[boundName])

		let last = null
		let i = 0
		while (!stream[boundName]) {
			last = stream.curr
			assert(compare(stream, expected[i++]))
			change(stream)
		}

		assert.strictEqual(i, expected.length)

		if (i) {
			assert.strictEqual(last, stream.curr)
			while (timesRecheck--)
				assert.strictEqual(stream.curr, change(stream))
		}
	}
}

export function generalJumpTest(direction: boolean) {
	const [boundName, change] = pickTestDirection(direction)
	const methodName = direction ? "rewind" : "finish"
	return function (
		stream: IReversibleStream & IRewindable & IFinishable,
		expectedBuffer: any[],
		compare: (x: any, y: any) => boolean
	) {
		if (!direction) uniFinish(stream)

		const bufferCopy: any[] = []
		while (!stream[boundName]) {
			bufferCopy.push(stream)
			change(stream)
		}

		assert(
			compare(
				stream[methodName](),
				bufferCopy[direction ? 0 : bufferCopy.length - 1]
			)
		)

		const bufferRepeat: any[] = []
		while (!stream[methodName]()) {
			bufferRepeat.push(stream.curr)
			change(stream)
		}

		assert(same(bufferCopy, bufferRepeat, compare))
		assert(same(bufferCopy, expectedBuffer, compare))
	}
}

export const [generalIsEndTest, generalIsStartTest] = [true, false].map(
	generalBoundTest
)
export const [generalRewindTest, generalFinishTest] = [true, false].map(
	generalJumpTest
)

export const generalIterationTest = iterationTest<IStreamClassInstance>

export function generalPosTest(
	instance: IPosed<number> & IStreamClassInstance,
	initPos: number = 0,
	reCheck: number = 1
) {
	property(`.pos [from ${initPos}, re-checked ${reCheck} times]`, () => {
		assert.strictEqual(initPos, instance.pos)

		while (!instance.isEnd) {
			const prevPos = instance.pos
			instance.next()
			assert.strictEqual(prevPos + 1, instance.pos)
		}

		while (reCheck--) {
			const prevPos = instance.pos
			instance.next()
			assert.strictEqual(prevPos, instance.pos)
		}
	})
}

export function generalReversePosTest(
	instance: IPosed<number> & IReversedStreamClassInstance,
	initPos: number,
	reCheck: number = 1
) {
	property(
		`.pos [backwards, from ${initPos}, re-checked ${reCheck} times]`,
		() => {
			assert.strictEqual(initPos, instance.pos)

			while (!instance.isStart) {
				const prevPos = instance.pos
				instance.prev()
				assert.strictEqual(prevPos - 1, instance.pos)
			}

			while (reCheck--) {
				const prevPos = instance.pos
				instance.prev()
				assert.strictEqual(prevPos, instance.pos)
			}
		}
	)
}
