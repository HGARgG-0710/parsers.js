import { it } from "node:test"
import assert from "assert"

import type {
	Posed,
	PositionalInputtedStream
} from "../../../../../dist/src/Stream/PositionalStream/interfaces.js"
import type { BasicReversibleStream } from "../../../../../dist/src/Stream/ReversibleStream/interfaces.js"
import type { Position } from "../../../../../dist/src/Stream/PositionalStream/Position/interfaces.js"

import { uniNavigate } from "../../../../../dist/src/Stream/StreamClass/Navigable/utils.js"
import {
	blockExtension,
	ClassConstructorTest,
	InitClassConstructorTest
} from "lib/lib.js"

import { boolean, function as _f } from "@hgargg-0710/one"
import {
	InitReversedStreamClassConstructorTest,
	isInputted,
	isPosed,
	isSuperable,
	ReversedStreamClassConstructorTest
} from "Stream/StreamClass/lib/classes.js"
const { equals } = boolean
const { and } = _f

function PositionalStreamPosTest(
	stream: Posed<Position> & BasicReversibleStream,
	goPos: Position,
	expectedPos: Position,
	posCompare: (x: any, y: any) => boolean = equals
) {
	it("property: .pos", () => {
		uniNavigate(stream, goPos)
		assert(posCompare(stream.pos, expectedPos))
	})
}

const positionalStreamPrototypeProps = ["super"]
const positionalStreamOwnProps = ["pos", "input"]

const isPositionalStream = and(isSuperable, isPosed, isInputted) as (
	x: any
) => x is PositionalInputtedStream

const PositionalStreamConstructorTest = blockExtension(
	ReversedStreamClassConstructorTest,
	ClassConstructorTest<PositionalInputtedStream>(
		isPositionalStream,
		positionalStreamPrototypeProps,
		positionalStreamOwnProps
	)
)

const InitPositionalStreamConstructorTest = blockExtension(
	InitReversedStreamClassConstructorTest,
	InitClassConstructorTest<PositionalInputtedStream>(
		isPositionalStream,
		positionalStreamPrototypeProps,
		positionalStreamOwnProps
	)
)
