import { delegate, delegateProperty } from "../../utils.js"

export const [inputDelegate, inputPropDelegate] = [delegate, delegateProperty].map((x) =>
	x("input")
)

export const [
	underStreamPrev,
	underStreamNext,
	underStreamIsEnd,
	underStreamIsStart,
	underStreamRewind,
	underStreamFinish
] = ["prev", "next", "isCurrEnd", "isCurrStart", "rewind", "finish"].map(inputDelegate)

export const [underStreamCurr, underStreamDefaultIsEnd, underStreamDefaultIsStart] = [
	"curr",
	"isEnd",
	"isStart"
].map(inputPropDelegate)
