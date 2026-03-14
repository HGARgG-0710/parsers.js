import { Config } from "../../../global.js"
import { WrapperApp } from "../../../global/App.js"
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
	private readonly asApp = new WrapperApp((source: string) =>
		this.parseErrorAware(source)
	)

	private get errPrinter() {
		return Config.regex.errorPrinter
	}

	private parserBasic(source: string) {
		return consume<INode>(this.raw(new ParseableInput(source))).get()[0]
	}

	private parseErrorAware(source: string) {
		return this.errPrinter.execute(() => this.parserBasic(source))
	}

	// ! pre-doc: IMPORTANT - the user is advised to CACHE config objects, because `extensions` identity is what determines the necessity to re-build the parser anew...
	// 		[which is, obviously more expensive computationally]
	parse(source: string) {
		return this.asApp.run(source)
	}

	constructor(extensions: Regex.Extension[]) {
		this.raw = getParser(extensions)
	}
}

export const BasicPeekHash = PeekHash(BasicHash)
