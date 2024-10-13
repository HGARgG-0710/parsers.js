import {
	blockExtension,
	ClassConstructorTest,
	InitClassConstructorTest
} from "lib/lib.js"
import type { EffectiveProlongedStream } from "../../../../../dist/src/Stream/ProlongedStream/interfaces.js"

import {
	InitStreamClassConstructorTest,
	isInputted,
	isPosed,
	isSuperable,
	StreamClassConstructorTest
} from "Stream/StreamClass/lib/classes.js"

import { object, function as _f, typeof as type } from "@hgargg-0710/one"
const { and } = _f
const { structCheck } = object
const { isNumber } = type

export function GeneratedProlongedStreamTest(hasPosition: boolean = false) {
	const prolongedStreamPrototypeProps = ["super"]
	const prolongedStreamOwnProps = ["streamIndex", "input"].concat(
		hasPosition ? ["pos"] : []
	)

	const isProlongedStream = and(
		structCheck({
			streamIndex: isNumber
		}),
		...([isSuperable, isInputted] as ((x: any) => boolean)[]).concat(
			hasPosition ? [isPosed(isNumber)] : []
		)
	) as (x: any) => x is EffectiveProlongedStream

	const ProlongedStreamConstructorTest = blockExtension(
		StreamClassConstructorTest,
		ClassConstructorTest<EffectiveProlongedStream>(
			isProlongedStream,
			prolongedStreamPrototypeProps,
			prolongedStreamOwnProps
		)
	)

	const InitProlongedStreamConstructorTest = blockExtension(
		InitStreamClassConstructorTest,
		InitClassConstructorTest<EffectiveProlongedStream>(
			isProlongedStream,
			prolongedStreamPrototypeProps,
			prolongedStreamOwnProps
		)
	)
}
