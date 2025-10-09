import { RegexParser } from "../RegexParser/Parser.js"

export class RegexCompiler {
	static readonly instance = new RegexCompiler()

	compile(source: string) {
		const regexAST = RegexParser.instance.parse(source)
		// ! Compilation code...
	}

	private constructor() {}
}
