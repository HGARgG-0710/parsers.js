import { not } from "../aliases.js"
import { PositionalStream } from "src/types/Stream/PositionalStream.js"
import { type Position } from "src/types/Stream/Position.js"
import { StreamLocator } from "./StreamLocator.js"
import { function as _f } from "@hgargg-0710/one"
import type { ParserMap } from "../parsers/ParserMap.js"
import type { ParsingState } from "../parsers/GeneralParser.js"

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
