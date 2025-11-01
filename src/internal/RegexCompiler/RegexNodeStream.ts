import { DepthStream } from "../../objects/Stream.js"
import { RegexParser } from "../RegexParser/Parser.js"

export function RegexNodeStream(source: string) {
	return new DepthStream(RegexParser.instance.parse(source))
}
