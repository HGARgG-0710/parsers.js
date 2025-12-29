import type { Summat } from "@hgargg-0710/summat.ts"
import type {
	ICompositeStream,
	IErrorDataMaker,
	IInputStream,
	IParseStream,
	IBaseParseStreamMaker,
	IRootStream
} from "../interfaces.js"
import { Parse } from "../internal/Parser/Parse.js"
import { ParseConcatStream } from "../internal/Parser/ParseConcatStream.js"
import { ParseLoopStream } from "../internal/Parser/ParseLoopStream.js"
import { ParseStream } from "../internal/Parser/ParseStream.js"

/**
 * A function for creation of self-modifying parsers.
 * They are based upon the provided `workStream: ICompositeStream<FinalType>`
 * to serve as the "body" of the parser, and the `inputStream`, as its input.
 *
 * The `inputStream` is being "fed" to the `workStream` via the `.init(inputStream)`
 * method call upon call to the inner function. The `state` is optional to the working
 * of the resulting parser, while the `input` is (depending on the implementation for `inputStream`)
 * is essential.
 *
 * The `input` argument typically represents some form of resource/string-wrapper,
 * or another user-provided source of parsing data (although chaining different
 * parsers is not at all uncommon, and can, in fact, provide great reusability
 * benefits, quite unique to the library's modular approach to treating of
 * parsers and their structure).
 *
 * Note that when a file connection
 * (such a `ReadingSource`, or, in general, an `IResource`), it is the USER'S responsibility
 * to conduct the cleanup.
 *
 * Note that it is also possible to run the result of `DynamicParser` on multiple different
 * `input` objects without requiring to re-create it all anew.
 *
 * The resulting self-modifying parser calls the underlying (initialized) `workStream`
 * until finished, while also permitting the user:
 *
 * 1. access to the global `.state` from within the `ICompositeStream`'s execution
 * 		via the `workStream.setState(state)` method call
 * 2. (modifying) internal access to the underlying `.streams: IStreamArray`
 * 		property of the (global) `ICompositeStream`, containing the 'IRawStream's
 * 		composing the `ICompositeStream` in question,
 * 		via the `this.state.parser.streams`
 * 3. to register the accumulated changes to the `.streams` via the
 * 		internal call to `this.state.parser.update()`
 *
 * Thus, these three capabilities permit the user to modify the parser
 * by means of preserving the information received by parsing appropriate
 * input.
 *
 * The sole rule of the calls to `.update()` is that it can ONLY occurr
 * after the last call to `.next()` HAS been finished. That is to say,
 * the user must plan their grammar in such a fashion so as to ensure
 * that the call to `.update()` is ALWAYS harmonious with the remainder
 * of their last '.next()' call to the `ICompositeStream` as it had been
 * before the `.update()` call in question.
 */
export function Parser<InType = any, FinalType = any, InitType = any>(
	config: Parser.Config<InType, FinalType, InitType>
) {
	const { workStream, inputStream, errDataMaker } = config
	return function (getState?: () => Summat) {
		return function (input: InitType): IParseStream<FinalType> {
			return new ParseStream(
				new Parse(workStream(), inputStream(), errDataMaker).init(
					input,
					getState?.()
				)
			)
		}
	}
}

export namespace Parser {
	// ! PRE-DOC: *important* - this is ONE OF THE TWO abstractions needed for proper utilisation
	// ! of lazy parsing in practical contexts:
	// * 	Specifically, oftentimes, in common formats (ex: XML, JSON, HTML, etc), one has a "root"
	// * 	element, inside of which the entirety of the document's contents are located. This poses
	// * 	a problem for lazy parsing, SINCE, the current implementation of 'ParseStream' REQUIRES
	// * 	one to perform EITHER: 1. a PARTIAL parse; 2. a FULL parse; This, in particular, means
	// * 	that one requires a way to parse INDIVIDUAL "preliminary" pieces at the top, that would
	// * 	include the "closing/opening" parts of a "Root Element".
	// %	THIS IS THE 'ROOT ELEMENT' PARSING PROBLEM
	// *	There are two types of solutions, and this is one;
	// ! 	One CAN use an arbitrarily-deep/long concatenation-parser of "incomplete" parsers (see below; a part of 'Parser.ts'),
	// 			It's more complex and better for seriously *nasty* cases, when you can't reliably predict
	// 			the "artificial" depth, and therefore, efficiently break up the parsing process. It's
	// 			very commonly used for Event-Based XML parsers (though it's not implemented quite the
	// 			same way...).
	// 			NOTE: in this version, the "tail" parsers must ALSO be present (i.e., one must SOMEHOW
	// 			keep track of them...)
	// * 	OR (this solution), one can combine a finite number of "incomplete" parsers, with a respective
	// * 	"tail" parser, which'd "clean up" the "open" tag/bracket/etc, by "skip(...)"-ping the closing
	// * 	tag/bracket/etc. It does nothing, merely serves to validate the integrity of a given open-close
	// * 	piece (in languages such YAML, it's empty and does nothing);
	// ^ 	VITAL: put this into the library's documentation (the Guide-s, specifically...)
	// 			To use the library effectively for large datasets, the user must UNDERSTAND
	// 			the existence of this specific problem, and its solutions.
	// ^ 	VITAL NOTE: this CAN'T (typically) be nested;
	// 			Important, since 'ParseStream' *does* properly support it (somewhat confusingly);
	export function Concat<Init = any, Out = any>(
		streamMakers: IBaseParseStreamMaker<Init, Out>[]
	) {
		return function (getState?: () => Summat) {
			return function (input: Init): IRootStream<Out> {
				return new ParseConcatStream(input, streamMakers, getState)
			}
		}
	}

	export function Nested<Init = any, Out = any>(
		open: IBaseParseStreamMaker<Init, Out>,
		between: IBaseParseStreamMaker<Init, Out>[],
		close: IBaseParseStreamMaker<Init, Out>
	) {
		return [open, ...between, close]
	}

	// ! pre-doc: this is an alternative solution of Root Element Problem to 'Parser.Concat'.
	// * Specifically, it gets the desired 'IParseStreamMaker' via the given factory-function.
	//  	It depends upon the current index of the Parser being created, as well as the
	//  	underlying implementation (most common and useful one being that the thing wil
	// 		simply return the same type of parser over and over again). This is a TOPLEVEL
	// 		parser, meaning it cannot (or, at least, should not) be reused as a Stream, and
	// 		no guarantee of it working is provided by the library (although, no doubt due to
	// 		its highly flexible design SOME applications are still possible and valid...)
	export function Loop<Init = any, Out = any>(
		streamMakerGetter: (i: number) => IBaseParseStreamMaker<Init, Out>,
		conseqEmptyStreamsAllowed?: number
	) {
		return function (getState?: () => Summat) {
			return function (input: Init) {
				return new ParseLoopStream(
					input,
					streamMakerGetter,
					conseqEmptyStreamsAllowed,
					getState
				)
			}
		}
	}

	export class Config<InType = any, FinalType = any, InitType = any> {
		constructor(
			readonly workStream: () => ICompositeStream<FinalType>,
			readonly inputStream: () => IInputStream<InType, InitType>,
			readonly errDataMaker: IErrorDataMaker<InType, InitType>
		) {}
	}
}
