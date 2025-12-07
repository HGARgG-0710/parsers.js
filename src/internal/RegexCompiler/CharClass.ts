import { type } from "@hgargg-0710/one"
import type { ICellNode, INode, IRegexPartBuilder } from "../../interfaces.js"
import type { Regex } from "../../objects.js"
import type { TreeStream } from "../../objects/Stream.js"
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
} from "../RegexParser/Nodes.js"
import { compileUnicodeChar } from "./Cell.js"
import type { IRegexCompilerHandler } from "./Compiler.js"
import { compileComplexPart } from "./Complex.js"
import {
	compileFormFeed,
	compileNewline,
	compileTab,
	compileVTab
} from "./Elementary.js"
import { compilerBuilderErrHandler } from "./Errors.js"
import type { IRegexFactory } from "./RegexFactory.js"
import { RegexTypeHandler } from "./RegexTypeHandler.js"

const { isString } = type

export function compileCharClass(factory: IRegexFactory) {
	return compileComplexPart(() => factory.charClass())
}

export function compileBoundaryClass(factory: IRegexFactory) {
	return compileComplexPart(() => factory.boundaryClass())
}

export function compileClassRange(factory: IRegexFactory) {
	const boundaryCompiler = compileClassRangeBoundary(factory)
	return function (
		input: TreeStream<INode>,
		handler: IRegexCompilerHandler<Regex.Raw | string>
	) {
		input.next() // ClassRange
		const from = boundaryCompiler(input, handler)
		input.next()
		const to = boundaryCompiler(input, handler)
		return isString(from)
			? isString(to)
				? factory.charRange(from, to)
				: factory.charToNewlineRange(from, to)
			: isString(to)
			? factory.newlineToCharRange(from, to)
			: from // * explanation: this means that \n-\n is the range given
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

// ! Add a proper err handler later instead of the generic `compilerBuilderErrHandler`...
function rangeBoundaryHandler(factory: IRegexFactory) {
	return RegexTypeHandler<string | Regex.Raw>(
		[
			[EscapedLiteral, handleCellBoundary],
			[SingleChar, handleCellBoundary],
			[UnicodeChar, handleUnicodeBoundary(factory)],
			[Newline, compileNewline(factory)],
			[Tab, handleTabBoundary(factory)],
			[VTab, handleVTabBoundary(factory)],
			[FormFeed, handleFormFeedBoundary(factory)]
		],
		compilerBuilderErrHandler
	)
}

function compileClassRangeBoundary(factory: IRegexFactory) {
	const handleRangeBoundary = rangeBoundaryHandler(factory)
	return function (
		input: TreeStream<INode>,
		_handler: IRegexCompilerHandler<string | Regex.Raw>
	) {
		input.next() // CharClassRangeBoundary
		return handleRangeBoundary(input)
	}
}

// ! ADD A PROPER ERROR HANDLER HERE!!! (not the `compilerBuilderErrHandler`)
function negatedBuilderPicker(factory: IRegexFactory) {
	return RegexTypeHandler<IRegexPartBuilder>(
		[
			[CharClass, () => factory.negCharClass()],
			[BoundaryClass, () => factory.negBoundaryClass()]
		],
		compilerBuilderErrHandler
	)
}

export function compileNegated(factory: IRegexFactory) {
	const builderPicker = negatedBuilderPicker(factory)
	return function (input: TreeStream<INode>, handler: IRegexCompilerHandler) {
		input.next() // Negated
		return compileComplexPart(() => builderPicker(input))(input, handler)
	}
}
