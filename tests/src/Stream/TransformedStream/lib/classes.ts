import { ClassConstructorTest } from "lib/lib.js"
import { isStreamClassInstance } from "../../../../../dist/src/Stream/StreamClass/utils.js"
import type { EffectiveTransformedStream } from "../../../../../dist/src/Stream/TransformedStream/interfaces.js"
import { isTransformedStream } from "../../../../../dist/src/Stream/TransformedStream/utils.js"

import { function as _f } from "@hgargg-0710/one"
const { and } = _f

const isTransformedStreamInternal = and(isTransformedStream, isStreamClassInstance) as (
	x: any
) => x is EffectiveTransformedStream

const TransformedStreamConstructorTest = ClassConstructorTest(isTransformedStreamInternal)
