import type { EffectivePredicateStream } from "../../../../../dist/src/Stream/PredicateStream/interfaces.js"
import {
	blockExtension,
	ClassConstructorTest,
	InitClassConstructorTest
} from "lib/lib.js"
import {
	InitStreamClassConstructorTest,
	isInputted,
	isLookahead,
	isPosed,
	isProddable,
	isSuperable,
	StreamClassConstructorTest
} from "Stream/StreamClass/lib/classes.js"

import { object, function as _f, typeof as type } from "@hgargg-0710/one"
const { and } = _f
const { structCheck } = object
const { isFunction, isNumber } = type

export function GeneratedPredicateStreamTest(hasPosition: boolean = false) {
	const predicateStreamPrototypeProps = ["super", "prod"]
	const predicateStreamOwnProps = ["predicate", "lookAhead", "input"].concat(
		hasPosition ? ["pos"] : []
	)

	const isPredicateStream = and(
		structCheck({
			predicate: isFunction
		}),
		...(
			[isLookahead, isSuperable, isInputted, isProddable] as ((x: any) => boolean)[]
		).concat(hasPosition ? [isPosed(isNumber)] : [])
	) as (x: any) => x is EffectivePredicateStream

	const PredicateStreamConstructorTest = blockExtension(
		StreamClassConstructorTest,
		ClassConstructorTest<EffectivePredicateStream>(
			isPredicateStream,
			predicateStreamPrototypeProps,
			predicateStreamOwnProps
		)
	)

	const InitPredicateStreamConstructorTest = blockExtension(
		InitStreamClassConstructorTest,
		InitClassConstructorTest<EffectivePredicateStream>(
			isPredicateStream,
			predicateStreamPrototypeProps,
			predicateStreamOwnProps
		)
	)
}
