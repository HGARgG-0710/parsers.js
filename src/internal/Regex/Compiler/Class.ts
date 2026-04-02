import type {
	ICellNode,
	INode,
	IRegexCompilerHandler,
	IRegexFactory,
	IRegexPartBuilder
} from "../../../interfaces.js"
import type { Regex } from "../../../objects.js"
import type { TreeStream } from "../../../objects/Stream.js"
import {
	BoundaryClass,
	CharClass,
	EscapedLiteral,
	FormFeed,
	Newline,
	SingleChar,
	Tab,
	UnicodeChar,
	VTab
} from "../Parser/Nodes.js"
import { compileUnicodeChar } from "./Cell.js"
import { compileComplexPart } from "./Complex.js"
import {
	compileFormFeed,
	compileNewlineLiteral,
	compileTab,
	compileVTab
} from "./Elementary.js"
import {
	negatedBuilderKindsErrHandler,
	rangeBoundaryKindsErrHandler
} from "./Errors.js"
import { RegexTypeHandler } from "./RegexTypeHandler.js"

export function compileCharClass(factory: IRegexFactory) {
	return compileComplexPart(() => factory.charClass())
}

export function compileBoundaryClass(factory: IRegexFactory) {
	return compileComplexPart(() => factory.boundaryClass())
}

export function compileClassRange(factory: IRegexFactory) {
	const boundaryCompiler = rangeBoundaryHandler(factory)
	return function (
		input: TreeStream<INode>,
		handler: IRegexCompilerHandler<Regex.Raw>
	) {
		input.next() // ClassRange
		const from = boundaryCompiler(input, handler)
		input.next()
		const to = boundaryCompiler(input, handler)
		return factory.charRange(from, to)
	}
}

function handleCellBoundary(
	input: TreeStream<INode>,
	_handler: IRegexCompilerHandler
) {
	return (input.curr as ICellNode<string>).value
}

function handleUnicodeBoundary(factory: IRegexFactory) {
	const unicodeCharCompiler = compileUnicodeChar(factory)
	return function (
		input: TreeStream<INode>,
		_handler: IRegexCompilerHandler
	) {
		return unicodeCharCompiler(input, _handler).char
	}
}

function handleTabBoundary(factory: IRegexFactory) {
	const tabCompiler = compileTab(factory)
	return function (
		input: TreeStream<INode>,
		_handler: IRegexCompilerHandler
	) {
		return tabCompiler(input, _handler).char
	}
}

function handleVTabBoundary(factory: IRegexFactory) {
	const vTabCompiler = compileVTab(factory)
	return function (
		input: TreeStream<INode>,
		_handler: IRegexCompilerHandler
	) {
		return vTabCompiler(input, _handler).char
	}
}

function handleFormFeedBoundary(factory: IRegexFactory) {
	const formFeedCompiler = compileFormFeed(factory)
	return function (
		input: TreeStream<INode>,
		_handler: IRegexCompilerHandler
	) {
		return formFeedCompiler(input, _handler).char
	}
}

function handleNewlineBoundary(factory: IRegexFactory) {
	const newlineCompiler = compileNewlineLiteral(factory)
	return function (
		input: TreeStream<INode>,
		_handler: IRegexCompilerHandler
	) {
		return newlineCompiler(input, _handler).char
	}
}

function rangeBoundaryHandler(factory: IRegexFactory) {
	return RegexTypeHandler<string>(
		[
			[EscapedLiteral, handleCellBoundary],
			[SingleChar, handleCellBoundary],
			[UnicodeChar, handleUnicodeBoundary(factory)],
			[Newline, handleNewlineBoundary(factory)],
			[Tab, handleTabBoundary(factory)],
			[VTab, handleVTabBoundary(factory)],
			[FormFeed, handleFormFeedBoundary(factory)]
		],
		rangeBoundaryKindsErrHandler
	)
}

function negatedBuilderPicker(factory: IRegexFactory) {
	return RegexTypeHandler<IRegexPartBuilder>(
		[
			[CharClass, () => factory.negCharClass()],
			[BoundaryClass, () => factory.negBoundaryClass()]
		],
		negatedBuilderKindsErrHandler
	)
}

export function compileNegated(factory: IRegexFactory) {
	const builderPicker = negatedBuilderPicker(factory)
	return function (input: TreeStream<INode>, handler: IRegexCompilerHandler) {
		input.next() // Negated
		return compileComplexPart(() => builderPicker(input))(input, handler)
	}
}
