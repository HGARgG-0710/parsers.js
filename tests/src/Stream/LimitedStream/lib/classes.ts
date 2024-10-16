import { it } from "node:test"
import assert from "assert"

import type {
	EffectiveLimitedStream,
	LimitedStream
} from "../../../../../dist/src/Stream/LimitedStream/interfaces.js"

import { isPosition, positionEqual } from "../../../../../dist/src/Position/utils.js"
import {
	blockExtension,
	ClassConstructorTest,
	classTest,
	InitClassConstructorTest
} from "lib/lib.js"
import {
	InitReversedStreamClassConstructorTest,
	isInputted,
	isLookahead,
	isPosed,
	isProddable,
	isSuperable,
	ReversedStreamClassConstructorTest
} from "Stream/StreamClass/lib/classes.js"

import { object, function as _f, typeof as type } from "@hgargg-0710/one"
const { structCheck } = object
const { and } = _f
const { isBoolean, isNumber } = type

export function GeneratedLimitedStreamTest(hasPosition: boolean = false) {
	const isLimitedStream = and(
		structCheck({
			from: isPosition,
			to: isPosition,
			hasLookAhead: isBoolean,
			direction: isBoolean
		}),
		...(
			[isLookahead, isSuperable, isProddable, isInputted] as ((x: any) => boolean)[]
		).concat(hasPosition ? [isPosed(isNumber)] : [])
	) as (x: any) => x is EffectiveLimitedStream

	const limitedStreamPrototypeProps = ["super", "prod"]
	const limitedStreamOwnProps = [
		"from",
		"to",
		"hasLookAhead",
		"direction",
		"lookAhead",
		"input"
	].concat(hasPosition ? ["pos"] : [])

	const LimitedStreamConstructorTest = blockExtension(
		ReversedStreamClassConstructorTest,
		ClassConstructorTest<EffectiveLimitedStream>(
			isLimitedStream,
			limitedStreamPrototypeProps,
			limitedStreamOwnProps
		)
	)

	const InitLimitedStreamConstructorTest = blockExtension(
		InitReversedStreamClassConstructorTest,
		InitClassConstructorTest<EffectiveLimitedStream>(
			isLimitedStream,
			limitedStreamPrototypeProps,
			limitedStreamOwnProps
		)
	)

	function LimitedStreamBaseTest(
		stream: LimitedStream,
		expected: any[],
		compare: (x: any, y: any) => boolean
	) {
		classTest("[base] LimitedStream", () => {
			positionEqual(stream.input, stream.from)
			let i = 0
			while (!stream.isEnd) assert(compare(stream.next(), expected[i++]))
			positionEqual(stream.input, stream.to)
		})
	}
}
