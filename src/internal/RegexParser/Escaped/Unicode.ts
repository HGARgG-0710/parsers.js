import type { ICellNode, IOwnedStream } from "../../../interfaces.js"
import { skip } from "../../../objects/Error.js"
import { SourceBuilder } from "../../../objects/SourceBuilder.js"
import { LimitStream, ValidatorStream } from "../../../objects/Stream.js"
import {
	CollectionStream,
	EndBracketStream,
	isNotNext
} from "../../../samples/Stream.js"
import { consumable } from "../../../utils/Stream.js"
import { validateHex, validateUnicodeCodeLength } from "../Errors.js"
import { UnicodeChar } from "../Nodes.js"

const skipU = skip("u")
const skipOpbrace = skip("{")

const UnicodeLimitStream = EndBracketStream(
	LimitStream.Limits.builder<string>()
		.setFrom((input) => {
			skipU(input) // u
			skipOpbrace(input) // {
			return 0
		})
		.setLongAs(isNotNext("}"))
		.build()
)

const UnicodeCharStream = CollectionStream(
	UnicodeChar,
	consumable(new SourceBuilder())
)

const UnicodeCharValidatorStream = ValidatorStream(function (
	resource: IOwnedStream<ICellNode<string>>
) {
	validateUnicodeCodeLength(resource)
	validateHex(resource)
})

export function HandleUnicode(input: IOwnedStream<string>) {
	return [
		UnicodeCharValidatorStream(),
		UnicodeCharStream(),
		UnicodeLimitStream()
	]
}
