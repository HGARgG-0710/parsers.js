import { ClassConstructorTest } from "lib/lib.js"

import { isReversedStreamClassInstance } from "../../../../../dist/src/Stream/StreamClass/utils.js"
import { isReversibleStream } from "../../../../../dist/src/Stream/ReversibleStream/utils.js"
import { isInputted } from "../../../../../dist/src/Stream/UnderStream/utils.js"
import type { ReversedStream } from "../../../../../dist/src/Stream/ReversibleStream/interfaces.js"

import { function as _f } from "@hgargg-0710/one"
const { and } = _f

const isReversibleStreamInternal = and(
	isReversedStreamClassInstance,
	isReversibleStream,
	isInputted
) as (x: any) => x is ReversedStream

const ReversedStreamConstructorTest = ClassConstructorTest<ReversedStream>(
	isReversibleStreamInternal
)
