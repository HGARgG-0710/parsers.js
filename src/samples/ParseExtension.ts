import { DynamicParser } from "../classes.js"
import { IdentityStream } from "../classes/Stream.js"
import type { ICompositeStream, IInputStream } from "../interfaces.js"

/**
 * This is a sample function for creation of an extension-parser,
 * based off `workerStream`, and accepting `childStream` as its
 * child-parser.
 *
 * It works (in practice) by redirecting the output from the
 * `IOwnedStream<InType>` obtained from the `DynamicParser`
 * curried call, and then producing a new `DynamicParser`-based
 * `ILinkedStream` based off `workerStream` as its extension-body,
 * and `childStream` as its extension-input.
 *
 * Example:
 *
 * ```ts
 * 	//  `someInputStream` is arbitrary
 * 	const baseParser = DynamicParser(CompositeStream(...)(), someInputStream)
 * 	const extension = ParseExtension(CompositeStream(...)())
 * 	const otherExtension = ParseExtension(CompositeStream(...)())
 *
 *		// serves as a composition
 * 	function ExtensionMaker (input: SomeInputType) {
 * 		return extension(baseParser(input))
 * 	}
 *
 * 	function OtherExtensionMaker(input: SomeInputType) {
 * 		// nesting extension-makers is valid
 * 		return otherExtension(ExtensionMaker(input))
 * 	}
 *
 * 	// exposed API example
 * 	export function parse(x: SomeInputType) {
 * 		return OtherExtensionMaker(x)
 * 	}
 * ```
 */
export function ParseExtension<InType = any, InitType = any>(
	workerStream: ICompositeStream
) {
	const protoExtension = DynamicParser(workerStream, new IdentityStream())
	return function (childStream: IInputStream<InType, InitType>) {
		return protoExtension(childStream)
	}
}
