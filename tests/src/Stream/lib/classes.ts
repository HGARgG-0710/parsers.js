import assert from "assert"

import { arraysSame, classSpecificAmbigiousMethodTest, equals } from "lib/lib.js"
import type { BasicStream } from "../../../../dist/src/Stream/BasicStream/interfaces.js"
import type {
	ChangeType,
	ReversibleStream
} from "../../../../dist/src/Stream/ReversibleStream/interfaces.js"
import type { BoundNameType } from "../../../../dist/src/Stream/StreamClass/interfaces.js"
import { next, previous } from "../../../../dist/src/utils.js"

import { finish } from "../../../../dist/src/Stream/FinishableStream/utils.js"

import type { Rewindable } from "../../../../dist/src/Stream/RewindableStream/interfaces.js"
import type { Finishable } from "../../../../dist/src/Stream/FinishableStream/interfaces.js"

export const [streamNavigateTest, streamCopyTest] = ["navigate", "copy"].map(
	classSpecificAmbigiousMethodTest<BasicStream>
)

export const [basicStreamNavigateTest] = [streamNavigateTest].map((x) => x(equals))

const pickTestDirection = (direction: boolean): [BoundNameType, ChangeType] =>
	direction ? ["isEnd", next] : ["isStart", previous]

export function generalBoundTest(direction: boolean) {
	const [boundName, change] = pickTestDirection(direction)
	const [beginningBoundName] = pickTestDirection(!direction)
	return function (compare: (x: any, y: any) => boolean, timesRecheck: number = 1) {
		return function (
			stream: ReversibleStream,
			expected: any[],
			lowCompare = compare
		) {
			if (!direction) finish(stream)

			assert(stream[beginningBoundName])
			if (expected.length) assert(!stream[boundName])

			let last = null
			let i = 0
			while (!stream[boundName]) {
				last = stream.curr
				assert(lowCompare(stream, expected[i++]))
				change(stream)
			}

			assert.strictEqual(i, expected.length)

			if (i) {
				assert.strictEqual(last, stream.curr)
				while (timesRecheck--) assert.strictEqual(stream.curr, change(stream))
			}
		}
	}
}

export function generalJumpTest(direction: boolean) {
	const [boundName, change] = pickTestDirection(direction)
	const methodName = direction ? "rewind" : "finish"
	return function (compare: (x: any, y: any) => boolean) {
		return function (
			stream: ReversibleStream & Rewindable & Finishable,
			expectedBuffer: any[],
			lowCompare = compare
		) {
			if (!direction) finish(stream)

			const bufferCopy = []
			while (!stream[boundName]) {
				bufferCopy.push(stream)
				change(stream)
			}

			assert(
				lowCompare(
					stream[methodName](),
					bufferCopy[direction ? 0 : bufferCopy.length - 1]
				)
			)

			const bufferRepeat = []
			while (!stream[methodName]()) {
				bufferRepeat.push(stream.curr)
				change(stream)
			}

			assert(arraysSame(bufferCopy, bufferRepeat, compare))
			assert(arraysSame(bufferCopy, expectedBuffer, compare))
		}
	}
}

export const [generalIsEndTest, generalIsStartTest] = [true, false].map(generalBoundTest)
export const [generalRewindTest, generalFinishTest] = [true, false].map(generalJumpTest)

export const isLookaheadHaving = (x: object) => "hasLookAhead" in x
