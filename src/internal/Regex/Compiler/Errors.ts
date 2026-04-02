import { Config } from "../../../global.js"
import type { INode, IRegexCompilerHandler } from "../../../interfaces.js"
import { ConstructorError } from "../../../objects/Error.js"
import { TabbingProvider } from "../../../objects/Logger.js"
import type { TreeStream } from "../../../objects/Stream.js"
import { getNewline } from "../../../samples/space.js"

class RegexCompilationError extends ConstructorError {
	protected readonly paddingProvider = new TabbingProvider(
		3,
		Config.errors.tab,
		getNewline()
	)

	protected getReason() {
		return "item kind unrecognized"
	}

	protected makeMessage(item: INode): string {
		return `Error compiling the item: ${item.debugPrint()} to a Regex object. \n\tREASON: \n\t\t${this.getReason()}`
	}

	constructor(item: INode) {
		super()
		this.message = this.makeMessage(item)
	}
}

class RegexRangeKindError extends RegexCompilationError {
	private validRangeKindsList() {
		return this.paddingProvider.tabList(
			"TrivialRange",
			"InfiniteRange",
			"LimitsRange"
		)
	}

	protected override getReason(): string {
		return `item given is not an instance of any one of the valid range kinds:${this.validRangeKindsList()}`
	}
}

class RegexRangeBoundaryError extends RegexCompilationError {
	private validRangeBoundryKindsList() {
		return this.paddingProvider.tabList(
			"EscapedLiteral",
			"SingleChar",
			"UnicodeChar",
			"Newline",
			"Tab",
			"VTab",
			"FormFeed"
		)
	}

	protected override getReason(): string {
		return `item given is not a valid range boundary, i.e. one of:${this.validRangeBoundryKindsList()}`
	}
}

class RegexNegatedBuilderError extends RegexCompilationError {
	private validNegatedBuilderKindsList() {
		return this.paddingProvider.tabList("CharClass", "BoundaryClass")
	}

	protected override getReason(): string {
		return `item given is not a valid negated builder:${this.validNegatedBuilderKindsList()}`
	}
}

export function defaultCompilerErrHandler<T = any>(
	input: TreeStream<INode>,
	_handler: IRegexCompilerHandler<T>
) {
	throw new RegexCompilationError(input.curr)
}

export function rangeKindsErrHandler<T = any>(
	input: TreeStream<INode>,
	_handler: IRegexCompilerHandler<T>
) {
	throw new RegexRangeKindError(input.curr)
}

export function rangeBoundaryKindsErrHandler<T = any>(
	input: TreeStream<INode>,
	_handler: IRegexCompilerHandler<T>
) {
	throw new RegexRangeBoundaryError(input.curr)
}

export function negatedBuilderKindsErrHandler<T = any>(
	input: TreeStream<INode>,
	_handler: IRegexCompilerHandler<T>
) {
	throw new RegexNegatedBuilderError(input.curr)
}
