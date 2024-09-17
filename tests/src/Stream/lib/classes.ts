import {
	arraysSame,
	classSpecificAmbigiousMethodTest,
	classSpecificAmbigiousPropertyTest,
	equals
} from "lib/lib.js"
import type { BasicStream } from "../../../../dist/src/Stream/BasicStream/interfaces.js"
import type {
	ChangeType,
	ReversibleStream
} from "../../../../dist/src/Stream/ReversibleStream/interfaces.js"
import type { BoundNameType } from "../../../../dist/src/Stream/StreamClass/interfaces.js"
import { next, previous } from "../../../../dist/src/aliases.js"

import { finish } from "../../../../dist/src/Stream/FinishableStream/utils.js"

import assert from "assert"
import { it } from "node:test"
import type { Rewindable } from "../../../../dist/src/Stream/RewindableStream/interfaces.js"
import type { Finishable } from "../../../../dist/src/Stream/FinishableStream/interfaces.js"

export const [
	streamNextTest,
	streamPrevTest,
	streamNavigateTest,
	streamLimitTest,
	streamNestTest,
	streamTransformTest,
	streamCopyTest
] = ["next", "prev", "navigate", "limit", "nest", "transform", "copy"].map(
	classSpecificAmbigiousMethodTest<BasicStream>
)

export const [
	streamInputTest,
	streamPredicateTest,
	streamFromTest,
	streamToTest,
	streamPosTest,
	streamCurrNested
] = ["input", "predicate", "from", "to", "pos", "currNested"].map(
	classSpecificAmbigiousPropertyTest<BasicStream>
)

export const [basicStreamNextTest, basicStreamPrevTest, basicStreamNavigateTest] = [
	streamNextTest,
	streamPrevTest,
	streamNavigateTest
].map((x) => x(equals))

const pickTestDirection = (direction: boolean): [BoundNameType, ChangeType] =>
	direction ? ["isEnd", next] : ["isStart", previous]

export function generalBoundTest(direction: boolean) {
	const [boundName, change] = pickTestDirection(direction)
	const [beginningBoundName] = pickTestDirection(!direction)
	return function (compare: (x: any, y: any) => boolean, timesRecheck: number = 1) {
		return function (stream: ReversibleStream, expected: any[]) {
			it(`property: .${boundName}`, () => {
				if (!direction) finish(stream)

				assert(stream[beginningBoundName])
				if (expected.length) assert(!stream[boundName])

				let last = null
				let i = 0
				while (!stream[boundName]) {
					assert(compare((last = stream.curr), expected[i++]))
					change(stream)
				}

				assert.strictEqual(i, expected.length)

				if (i) {
					assert.strictEqual(last, stream.curr)
					while (timesRecheck--) assert.strictEqual(stream.curr, change(stream))
				}
			})
		}
	}
}

export const [generalIsEndTest, generalIsStartTest] = [true, false].map(generalBoundTest)

export function generalJumpTest(direction: boolean) {
	const [boundName, change] = pickTestDirection(direction)
	const label = direction ? "rewind" : "finish"
	return function (compare: (x: any, y: any) => boolean) {
		return function (
			stream: ReversibleStream & Rewindable & Finishable,
			expectedBuffer: any[]
		) {
			it(`method: .${label}`, () => {
				if (!direction) finish(stream)

				const bufferCopy = []
				while (!stream[boundName]) {
					bufferCopy.push(stream)
					change(stream)
				}

				assert(
					compare(
						stream[label](),
						bufferCopy[direction ? 0 : bufferCopy.length - 1]
					)
				)

				const bufferRepeat = []
				while (!stream[label]()) {
					bufferRepeat.push(stream.curr)
					change(stream)
				}

				assert(arraysSame(bufferCopy, bufferRepeat, compare))
				assert(arraysSame(bufferCopy, expectedBuffer, compare))
			})
		}
	}
}
