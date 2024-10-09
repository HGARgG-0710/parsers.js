import type { EffectiveInputStream } from "../../../../../dist/src/Stream/InputStream/interfaces.js"
import {
	blockExtension,
	ClassConstructorTest,
	InitClassConstructorTest
} from "lib/lib.js"

import { function as _f } from "@hgargg-0710/one"
import {
	InitReversedStreamClassConstructorTest,
	isCopiable,
	isInputted,
	isPosed,
	isSuperable,
	ReversedStreamClassConstructorTest
} from "Stream/StreamClass/lib/classes.js"
const { and } = _f

const isInputStream = and(isSuperable, isCopiable, isInputted, isPosed) as (
	x: any
) => x is EffectiveInputStream

const inputStreamPrototypeProps = ["super", "copy"]
const inputStreamOwnProps = ["input", "pos"]

const InputStreamConstructorTest = blockExtension(
	ReversedStreamClassConstructorTest,
	ClassConstructorTest<EffectiveInputStream>(
		isInputStream,
		inputStreamPrototypeProps,
		inputStreamOwnProps
	)
)

const InitInputStreamConstructorTest = blockExtension(
	InitReversedStreamClassConstructorTest,
	InitClassConstructorTest(
		isInputStream,
		inputStreamPrototypeProps,
		inputStreamOwnProps
	)
)
