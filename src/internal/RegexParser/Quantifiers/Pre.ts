import type { array } from "@hgargg-0710/one"
import { SingletonStream } from "../../../classes/Stream.js"
import type { IOwnedStream, IStreamChooser } from "../../../interfaces.js"
import { HandleRange } from "./Range.js"
import { Plus } from "./Plus.js"
import { Star } from "./Star.js"
import { QMark } from "./QMark.js"

const PlusStream = SingletonStream(() => new Plus())
const StarStream = SingletonStream(() => new Star())
const QMarkStream = SingletonStream(() => new QMark())

function handlePlus(input: IOwnedStream<string>) {
	input.next() // +
	return PlusStream()
}

function handleStar(input: IOwnedStream<string>) {
	input.next() // *
	return StarStream()
}

function handleQmark(input: IOwnedStream<string>) {
	input.next() // ?
	return QMarkStream()
}

export const maybePreQuantifier: array.Pairs<string, IStreamChooser> = [
	["+", handlePlus],
	["*", handleStar],
	["?", handleQmark],
	["{", HandleRange]
]
