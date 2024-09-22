import { function as _f } from "@hgargg-0710/one"
const { and } = _f

import { isReversedStreamClassInstance } from "../../../../../dist/src/Stream/StreamClass/utils.js"
import { isInputStream } from "../../../../../dist/src/Stream/InputStream/utils.js"
import type { EffectiveInputStream } from "../../../../../dist/src/Stream/InputStream/interfaces.js"

import { streamCopyTest, streamNavigateTest } from "Stream/lib/classes.js"
import { ClassConstructorTest } from "lib/lib.js"

const isInputStreamInternal = and(isInputStream, isReversedStreamClassInstance) as (
	x: any
) => x is EffectiveInputStream

const InputStreamConstructorTest =
	ClassConstructorTest<EffectiveInputStream>(isInputStreamInternal)
