import {
	blockExtension,
	ClassConstructorTest,
	InitClassConstructorTest
} from "lib/lib.js"
import type { EffectiveTransformedStream } from "../../../../../dist/src/Stream/TransformedStream/interfaces.js"

import {
	InitStreamClassConstructorTest,
	isInputted,
	isPosed,
	isSuperable,
	StreamClassConstructorTest
} from "Stream/StreamClass/lib/classes.js"

import { function as _f, object, typeof as type } from "@hgargg-0710/one"
const { and } = _f
const { structCheck } = object
const { isFunction, isNumber } = type

export function GeneratedTransformedStreamTest(hasPosition: boolean = false) {
	const transformedStreamPrototypeProps = ["super"]
	const transformedStreamOwnProps = ["transform", "input"].concat(
		hasPosition ? ["pos"] : []
	)

	const isTransformedStream = and(
		structCheck({
			transform: isFunction
		}),
		...([isSuperable, isInputted] as ((x: any) => boolean)[]).concat(
			hasPosition ? [isPosed(isNumber)] : []
		)
	) as (x: any) => x is EffectiveTransformedStream

	const TransformedStreamConstructorTest = blockExtension(
		StreamClassConstructorTest,
		ClassConstructorTest<EffectiveTransformedStream>(
			isTransformedStream,
			transformedStreamPrototypeProps,
			transformedStreamOwnProps
		)
	)

	const InitTransformedStreamConstructorTest = blockExtension(
		InitStreamClassConstructorTest,
		InitClassConstructorTest<EffectiveTransformedStream>(
			isTransformedStream,
			transformedStreamPrototypeProps,
			transformedStreamOwnProps
		)
	)
}
