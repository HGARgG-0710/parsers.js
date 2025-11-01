import type {
	INode,
	IRegexBuilder,
	IRegexMatcher,
	ITableHandler,
	ITyped
} from "../../interfaces.js"
import { DepthStream } from "../../objects/Stream.js"
import { mapTypes } from "../../utils/Node.js"
import { compilerBuilderErrHandler } from "./Errors.js"
import { RegexCompilerTableStorage } from "./RegexCompilerTable.js"
import { RegexNodeStream } from "./RegexNodeStream.js"
import { RegexTypeHandler } from "./RegexTypeHandler.js"

// TODO : add the return type for `IRegexCompilerHandler` and `IRegexCompilerFunction`...
export type IRegexCompilerHandler = ITableHandler<DepthStream<INode>>

export type IRegexCompilerFunction = (
	input: DepthStream<INode>,
	handler: IRegexCompilerHandler
) => any

export type IRegexCompilerErrorHandler = (
	input: DepthStream<INode>,
	_handler: IRegexCompilerHandler
) => void

export type IRegexCompilerTypeTable = [ITyped, IRegexCompilerFunction][]

class RegexCompilerAlgorithmBuilder {
	static readonly instance = new RegexCompilerAlgorithmBuilder()

	private buildAlgorithm: ITableHandler

	init(builder: IRegexBuilder) {
		this.buildAlgorithm = RegexTypeHandler(
			mapTypes(RegexCompilerTableStorage.instance.get(builder)),
			compilerBuilderErrHandler
		)
	}

	algorithm(input: DepthStream<INode>) {
		return this.buildAlgorithm(input)
	}

	private constructor() {}
}

export class RegexCompiler {
	static readonly instance = new RegexCompiler()

	private builder: IRegexBuilder

	private build(regexAstStream: DepthStream<INode>) {
		this.builder.addItem(
			RegexCompilerAlgorithmBuilder.instance.algorithm(regexAstStream)
		)
	}

	private init(builder: IRegexBuilder) {
		this.builder = builder
		RegexCompilerAlgorithmBuilder.instance.init(builder)
	}

	compile(source: string, builder: IRegexBuilder): IRegexMatcher {
		this.init(builder)
		this.builder.begin()
		this.build(RegexNodeStream(source))
		return this.builder.finalize()
	}

	private constructor() {}
}
