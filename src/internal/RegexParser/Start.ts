import { TokenNode } from "../../classes/Node.js"
import { HandlerStream } from "../../classes/Stream.js"
import type { IOwnedStream, IPosed } from "../../interfaces.js"
import { next } from "../../utils/Stream.js"

const StartToken = TokenNode("regex-start")

function StartHandler(input: IOwnedStream<string> & IPosed<number>) {
	const curr = next(input)
	return input.isStart && curr === ":" ? new StartToken() : curr
}

export const StartStream = HandlerStream(StartHandler)
