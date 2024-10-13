import type { EffectiveInputStream } from "../../../../../dist/src/Stream/InputStream/interfaces.js"
import {
	blockExtension,
	ClassConstructorTest,
	InitClassConstructorTest
} from "lib/lib.js"

import {
	InitReversedStreamClassConstructorTest,
	isCopiable,
	isInputted,
	isPosed,
	isSuperable,
	ReversedStreamClassConstructorTest
} from "Stream/StreamClass/lib/classes.js"

import { function as _f, typeof as type } from "@hgargg-0710/one"
const { and } = _f
const { isNumber } = type

const isInputStream = and(isSuperable, isCopiable, isInputted, isPosed(isNumber)) as (
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
