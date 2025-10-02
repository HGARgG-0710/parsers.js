import { RegexParser } from "../RegexParser/Parser.js"

export class RegexCompiler {
	private readonly parser = new RegexParser()

	compile(source: string) {
		const regexAST = this.parser.parse(source)
		// ! Compilation code...
	}
}
