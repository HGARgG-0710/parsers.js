import type { ICellNode, IOwnedStream } from "../../../../interfaces.js"
import { skip } from "../../../../objects/Error.js"
import { LimitStream, ValidatorStream } from "../../../../objects/Stream.js"
import {
	CollectionStream,
	EndBracketStream
} from "../../../../samples/Stream.js"
import { getStringConsumable } from "../../../../utils/Stream.js"
import { validateUnicodeCodeLength } from "../Errors.js"
import { validateHex } from "../Errors/Unicode/hex.js"
import { UnicodeChar } from "../Nodes.js"
import { isNotNextClbrace, skipOpbrace } from "../Utils/limits.js"

const skipU = skip("u")

const UnicodeCharLimitStream = EndBracketStream(
	new LimitStream.Limits.Builder<string>()
		.setFrom((input) => {
			skipU(input) // u
			skipOpbrace(input) // {
			return 0
		})
		.setLongAs(isNotNextClbrace)
)

const UnicodeCharStream = CollectionStream(UnicodeChar, getStringConsumable())

const UnicodeCharValidatorStream = ValidatorStream(
	(resource: IOwnedStream<ICellNode<string>>) => {
		validateUnicodeCodeLength(resource)
		validateHex(resource)
	}
)

export function HandleUnicodeChar(input: IOwnedStream<string>) {
	return [
		UnicodeCharValidatorStream(),
		UnicodeCharStream(),
		UnicodeCharLimitStream()
	]
}
