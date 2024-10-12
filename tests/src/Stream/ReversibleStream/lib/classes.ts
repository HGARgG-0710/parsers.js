import type { ReversedStream } from "../../../../../dist/src/Stream/ReversibleStream/interfaces.js"

import {
	blockExtension,
	ClassConstructorTest,
	InitClassConstructorTest
} from "lib/lib.js"

import { function as _f } from "@hgargg-0710/one"
import {
	InitReversedStreamClassConstructorTest,
	isInputted,
	isPosed,
	isSuperable,
	ReversedStreamClassConstructorTest
} from "Stream/StreamClass/lib/classes.js"
const { and } = _f

export function GeneratedReversedStreamTest(hasPosition: boolean = false) {
	const reversedStreamPrototypeProps = ["super"]
	const reversedStreamOwnProps = ["input"].concat(hasPosition ? ["pos"] : [])

	const isReversedStream = and(
		...([isSuperable, isInputted] as ((x: any) => boolean)[]).concat(
			hasPosition ? [isPosed] : []
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
