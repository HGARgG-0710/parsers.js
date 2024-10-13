import type { ReversedStream } from "../../../../../dist/src/Stream/ReversibleStream/interfaces.js"

import {
	blockExtension,
	ClassConstructorTest,
	InitClassConstructorTest
} from "lib/lib.js"

import {
	InitReversedStreamClassConstructorTest,
	isInputted,
	isPosed,
	isSuperable,
	ReversedStreamClassConstructorTest
} from "Stream/StreamClass/lib/classes.js"

import { function as _f, typeof as type } from "@hgargg-0710/one"
const { and } = _f
const { isNumber } = type

export function GeneratedReversedStreamTest(hasPosition: boolean = false) {
	const reversedStreamPrototypeProps = ["super"]
	const reversedStreamOwnProps = ["input"].concat(hasPosition ? ["pos"] : [])

	const isReversedStream = and(
		...([isSuperable, isInputted] as ((x: any) => boolean)[]).concat(
			hasPosition ? [isPosed(isNumber)] : []
		)
	) as (x: any) => x is ReversedStream

	const ReversedStreamConstructorTest = blockExtension(
		ReversedStreamClassConstructorTest,
		ClassConstructorTest<ReversedStream>(
			isReversedStream,
			reversedStreamPrototypeProps,
			reversedStreamOwnProps
		)
	)

	const InitReversedStreamConstructorTest = blockExtension(
		InitReversedStreamClassConstructorTest,
		InitClassConstructorTest<ReversedStream>(
			isReversedStream,
			reversedStreamPrototypeProps,
			reversedStreamOwnProps
		)
	)
}
