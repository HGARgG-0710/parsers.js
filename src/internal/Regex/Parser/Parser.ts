import { Config } from "../../../global.js"
import type { ICommonStream, INode, IParseable } from "../../../interfaces.js"
import { AutoMap, ParseableInput, Regex } from "../../../objects.js"
import { BasicHash, PeekHash } from "../../../objects/HashMap.js"
import { consume } from "../../../utils/Stream.js"
import { getParser } from "./ParserBuilder.js"

class RegexParserMap {
	private readonly parsers = new AutoMap<Regex.Extension[], RegexParser>(
		(extensions) => new RegexParser(extensions)
	)

	get(extensions: Regex.Extension[]) {
		return this.parsers.get(extensions)
	}
}

export class RegexParser {
	private static readonly parsers = new RegexParserMap()

	static with(extensions: Regex.Extension[]) {
		return this.parsers.get(extensions)
	}

	private readonly raw: (input: IParseable) => ICommonStream<INode>

	private get errPrinter() {
		return Config.regex.errorPrinter
	}

	private parseSource(source: string) {
		return consume<INode>(this.raw(new ParseableInput(source))).get()[0]
	}

	// ! pre-doc: IMPORTANT - the user is advised to CACHE config objects, because `extensions` identity is what determines the necessity to re-build the parser anew...
	parse(source: string) {
		// * Vital note: there is NO CLEANUP HERE
		// because the user may (accidentally) be
		// re-parsing the same expressions over-and-over again.
		return this.errPrinter.execute(() => this.parseSource(source))
	}

	constructor(extensions: Regex.Extension[]) {
		this.raw = getParser(extensions)
	}
}

export const BasicPeekHash = PeekHash(BasicHash)
