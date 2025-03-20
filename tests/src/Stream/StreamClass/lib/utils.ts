import type {
	IBasicStream,
	IReversibleStream
} from "../../../../../dist/src/Stream/interfaces.js"

import { comparisonUtilTest, utilTest } from "lib/lib.js"

import { utils } from "../../../../../dist/main.js"
const {
	isFinishable,
	isNavigable,
	isRewindable,
	uniFinish,
	uniNavigate,
	uniRewind
} = utils.Stream.StreamClass

export const [isFinishableTest, isNavigableTest, isRewindableTest] = [
	[isFinishable, "isFinishable"],
	[isNavigable, "isNavigable"],
	[isRewindable, "isRewindable"]
].map(([util, name]) => utilTest(util as Function, name as string))

export const uniFinishTest = comparisonUtilTest(
	(resultElem: any, expStream: IBasicStream) =>
		expStream.isEnd && resultElem === expStream.curr
)(uniFinish, "uniFinish")

export const uniNavigateTest = comparisonUtilTest(
	(resultElem: any, expStream: IBasicStream) => expStream.curr === resultElem
)(uniNavigate, "uniNavigate")

export const uniRewindTest = comparisonUtilTest(
	(resultElem: any, expStream: IReversibleStream) =>
		expStream.curr === resultElem && expStream.isStart
)(uniRewind, "uniRewind")
