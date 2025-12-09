import assert from "node:assert"
import type { INode, IRegexMatcher } from "../../interfaces.js"
import type { IRegexCompilerHandler } from "../../interfaces/Regex.js"
import { AutoMap, Regex } from "../../objects.js"
import { TreeStream } from "../../objects/Stream.js"
import { RegexParser } from "../RegexParser/Parser.js"
import { compilerBuilderErrHandler } from "./Errors.js"
import { RegexCompilerTable } from "./RegexCompilerTable.js"
import { RegexTypeHandler } from "./RegexTypeHandler.js"

export type IRegexCompilerErrorHandler<Out = Regex.Raw> = (
	input: TreeStream<INode>,
	_handler: IRegexCompilerHandler<Out>
) => void

class RegexCompilerAlgorithmMap {
	private readonly algorithms = new AutoMap<
		Regex.Extension[],
		RegexCompilerAlgorithm
	>((extensions) => new RegexCompilerAlgorithm(extensions))

	get(extensions: Regex.Extension[]) {
		return this.algorithms.get(extensions)
	}
}

class RegexCompilerAlgorithm {
	private static readonly algorithms = new RegexCompilerAlgorithmMap()

	static with(extensions: Regex.Extension[]) {
		return this.algorithms.get(extensions)
	}

	private readonly bodyMap = new AutoMap<
		RegexCompilerTable,
		IRegexCompilerHandler<number | string | Regex.Raw>
	>((table) => this.build(table))

	private body?: IRegexCompilerHandler<number | string | Regex.Raw>

	private build(table: RegexCompilerTable) {
		return RegexTypeHandler(
			table.get(this.extensions),
			compilerBuilderErrHandler
		)
	}

	with(table: RegexCompilerTable) {
		this.body = this.bodyMap.get(table)
		return this
	}

	performOn(input: TreeStream<INode>) {
		assert(this.body)
		return this.body(input)
	}

	constructor(private readonly extensions: Regex.Extension[]) {}
}

export class RegexCompiler {
	static readonly instance = new RegexCompiler()

	compile(source: string, config: Regex.Config): IRegexMatcher {
		const { finalizer, extensions, factory } = config
		return finalizer.toConcrete(
			RegexCompilerAlgorithm.with(extensions)
				.with(RegexCompilerTable.with(factory))
				.performOn(
					new TreeStream(RegexParser.with(extensions).parse(source))
				) as Regex.Raw
		)
	}

	private constructor() {}
}
