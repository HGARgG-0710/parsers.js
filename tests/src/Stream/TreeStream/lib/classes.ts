import { ClassConstructorTest } from "lib/lib.js"
import { isCopiable } from "../../../../../dist/src/Stream/CopiableStream/utils.js"
import { isNavigable } from "../../../../../dist/src/Stream/NavigableStream/utils.js"
import { isRewindable } from "../../../../../dist/src/Stream/RewindableStream/utils.js"
import { isReversedStreamClassInstance } from "../../../../../dist/src/Stream/StreamClass/utils.js"
import type { EffectiveTreeStream } from "../../../../../dist/src/Stream/TreeStream/interfaces.js"
import { isTreeStream } from "../../../../../dist/src/Stream/TreeStream/utils.js"

import { function as _f } from "@hgargg-0710/one"
const { and } = _f

const isTreeStreamInternal = and(
	isTreeStream,
	isRewindable,
	isCopiable,
	isNavigable,
	isReversedStreamClassInstance
) as (x: any) => x is EffectiveTreeStream

const TreeStreamConstructorTest =
	ClassConstructorTest<EffectiveTreeStream>(isTreeStreamInternal)
