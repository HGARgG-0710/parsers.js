import { function as _f, boolean } from "@hgargg-0710/one"
const { trivialCompose } = _f
const { not } = boolean

import { StreamLocator } from "_src/validate.js"
import type { ParserMap } from "../ParserMap/interfaces.js"
import type { PositionalValidatorState } from "./interfaces.js"

export function PositionalValidator<KeyType = any>(
	validatorMap: ParserMap<KeyType, boolean, PositionalValidatorState<KeyType>>
) {
	const locator = StreamLocator(trivialCompose(not, validatorMap))
	return function (input: PositionalValidatorState<KeyType>) {
		const [found, pos] = locator(input).result
		return [!found, pos]
	}
}
