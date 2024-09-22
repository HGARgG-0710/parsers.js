import { ClassConstructorTest } from "lib/lib.js"
import { isProlongedStream } from "../../../../../dist/src/Stream/ProlongedStream/utils.js"

import { function as _f } from "@hgargg-0710/one"
import { isStreamClassInstance } from "../../../../../dist/src/Stream/StreamClass/utils.js"
import type { EffectiveProlongedStream } from "../../../../../dist/src/Stream/ProlongedStream/interfaces.js"
const { and } = _f

const isProlongedStreamInternal = and(isProlongedStream, isStreamClassInstance) as (
	x: any
) => x is EffectiveProlongedStream

const ProlongedStreamConstructorTest = ClassConstructorTest<EffectiveProlongedStream>(
	isProlongedStreamInternal
)
