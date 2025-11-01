import type {
	IConcreteRegexFinalizer,
	INode,
	IRegexMatcher,
	ITableHandler,
	ITyped
} from "../../interfaces.js"
import { DepthStream } from "../../objects/Stream.js"
import { mapTypes } from "../../utils/Node.js"
import { compilerBuilderErrHandler } from "./Errors.js"
import { RawRegexBuilder } from "./RegexBuilder.js"
import { RegexCompilerTable } from "./RegexCompilerTable.js"
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

	private readonly buildAlgorithm: ITableHandler

	algorithm(input: DepthStream<INode>) {
		return this.buildAlgorithm(input)
	}

	private constructor() {
		this.buildAlgorithm = RegexTypeHandler(
			mapTypes(RegexCompilerTable.instance.get()),
			compilerBuilderErrHandler
		)
	}
}

export class RegexCompiler {
	static readonly instance = new RegexCompiler()

	private build(regexAstStream: DepthStream<INode>) {
		RawRegexBuilder.instance.addItem(
			RegexCompilerAlgorithmBuilder.instance.algorithm(regexAstStream)
		)
	}

	compile(source: string, finalizer: IConcreteRegexFinalizer): IRegexMatcher {
		const builder = RawRegexBuilder.instance
		builder.begin()
		this.build(RegexNodeStream(source))
		return finalizer.concrete(builder.get())
	}

	private constructor() {}
}
