import { TreeStream } from "../../objects/Stream.js"
import { RegexParser } from "../RegexParser/Parser.js"

export function RegexNodeStream(source: string) {
	return new TreeStream(RegexParser.instance.parse(source))
}
