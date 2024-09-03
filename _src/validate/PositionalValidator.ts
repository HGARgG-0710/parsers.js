import { function as _f, boolean } from "@hgargg-0710/one"
const { trivialCompose } = _f
const { not } = boolean

import { PositionalStream } from "../types/Stream/PositionalStream.js"
import { StreamLocator } from "./StreamLocator.js"
import type { ParserMap } from "../parsers/ParserMap.js"
import type { ParsingState } from "../parsers/GeneralParser.js"
import type { LocatorOutput } from "./StreamLocator.js"

export type PositionalValidatorState<KeyType = any> = ParsingState<
	PositionalStream,
	LocatorOutput,
	boolean,
	KeyType
>

export function PositionalValidator<KeyType = any>(
	validatorMap: ParserMap<KeyType, boolean, PositionalValidatorState<KeyType>>
) {
	const locator = StreamLocator(trivialCompose(not, validatorMap))
	return function (input: PositionalValidatorState<KeyType>) {
		const [found, pos] = locator(input).result
		return [!found, pos]
	}
}
