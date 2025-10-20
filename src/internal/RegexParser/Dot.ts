import type { array } from "@hgargg-0710/one"
import type { IOwnedStream, IStreamChooser } from "../../interfaces.js"
import { CachedTokenStream } from "../../samples/Stream.js"
import { AnyChar } from "./Nodes.js"

const AnyCharStream = CachedTokenStream(AnyChar)

function handleDot(input: IOwnedStream<string>) {
	input.next() // .
	return [AnyCharStream()]
}

export const maybeDot: array.Pairs<string, IStreamChooser> = [[".", handleDot]]
