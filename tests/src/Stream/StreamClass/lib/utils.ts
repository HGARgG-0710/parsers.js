import { comparisonUtilTest, utilTest } from "lib/lib.js"
import type { BasicStream } from "../../../../../dist/src/Stream/interfaces.js"
import type { BasicReversibleStream } from "../../../../../dist/src/Stream/ReversibleStream/interfaces.js"

import { utils } from "../../../../../dist/main.js"
const { isFinishable, isNavigable, isRewindable, uniFinish, uniNavigate, uniRewind } =
	utils.Stream.StreamClass

export const [isFinishableTest, isNavigableTest, isRewindableTest] = [
	[isFinishable, "isFinishable"],
	[isNavigable, "isNavigable"],
	[isRewindable, "isRewindable"]
].map(([util, name]) => utilTest(util as Function, name as string))

export const uniFinishTest = comparisonUtilTest(
	(resultElem: any, expStream: BasicStream) =>
		expStream.isEnd && resultElem === expStream.curr
)(uniFinish, "uniFinish")

export const uniNavigateTest = comparisonUtilTest(
	(resultElem: any, expStream: BasicStream) => expStream.curr === resultElem
)(uniNavigate, "uniNavigate")

export const uniRewindTest = comparisonUtilTest(
	(resultElem: any, expStream: BasicReversibleStream) =>
		expStream.curr === resultElem && expStream.isStart
)(uniRewind, "uniRewind")
