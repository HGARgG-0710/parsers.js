import { isPredicateStream } from "../../../../../dist/src/Stream/PredicateStream/utils.js"

import { function as _f } from "@hgargg-0710/one"
import { isStreamClassInstance } from "../../../../../dist/src/Stream/StreamClass/utils.js"
import { isLookaheadHaving } from "Stream/lib/classes.js"
import type { EffectivePredicateStream } from "../../../../../dist/src/Stream/PredicateStream/interfaces.js"
import { ClassConstructorTest } from "lib/lib.js"
const { and } = _f

const isPredicateStreamInternal = and(
	isPredicateStream,
	isStreamClassInstance,
	isLookaheadHaving
) as (x: any) => x is EffectivePredicateStream

const PredicateStreamConstructorTest = ClassConstructorTest<EffectivePredicateStream>(
	isPredicateStreamInternal
)
