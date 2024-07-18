import {
	not,
	PositionalStream,
	StreamLocator,
	type ParserMap,
	type Position
} from "main.js"
import { function as _f } from "@hgargg-0710/one"
import type { ParsingState } from "src/parsers/GeneralParser.js"

const { trivialCompose } = _f

export function PositionalValidator<KeyType = any>(
	validatorMap: ParserMap<KeyType, boolean>
) {
	const locator = StreamLocator(trivialCompose(not, validatorMap))
	return function (
		input: ParsingState<PositionalStream, [boolean, Position], boolean>
	) {
		const [found, pos] = locator(input).result
		return [!found, pos]
	}
}
