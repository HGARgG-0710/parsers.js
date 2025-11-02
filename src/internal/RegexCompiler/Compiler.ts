import type {
	IConcreteRegexFinalizer,
	INode,
	IRegexMatcher,
	ITableHandler,
	ITyped
} from "../../interfaces.js"
import type { Regex } from "../../objects.js"
import { DepthStream } from "../../objects/Stream.js"
import { mapTypes } from "../../utils/Node.js"
import { compilerBuilderErrHandler } from "./Errors.js"
import { RegexCompilerTable } from "./RegexCompilerTable.js"
import { RegexNodeStream } from "./RegexNodeStream.js"
import { RegexTypeHandler } from "./RegexTypeHandler.js"

export type IRegexCompilerHandler<Out = Regex.Raw> = ITableHandler<
	DepthStream<INode>,
	Out
>

export type IRegexCompilerFunction<Out = Regex.Raw> = (
	input: DepthStream<INode>,
	handler: IRegexCompilerHandler<Out>
) => any

export type IRegexCompilerErrorHandler<Out = Regex.Raw> = (
	input: DepthStream<INode>,
	_handler: IRegexCompilerHandler<Out>
) => void

export type IRegexCompilerTypeTable = [ITyped, IRegexCompilerFunction][]

class RegexCompilerAlgorithmBuilder {
	static readonly instance = new RegexCompilerAlgorithmBuilder()

	private readonly buildAlgorithm: IRegexCompilerHandler

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
		return RegexCompilerAlgorithmBuilder.instance.algorithm(regexAstStream)	
	}

	compile(source: string, finalizer: IConcreteRegexFinalizer): IRegexMatcher {
		return finalizer.concrete(this.build(RegexNodeStream(source)))
	}

	private constructor() {}
}
