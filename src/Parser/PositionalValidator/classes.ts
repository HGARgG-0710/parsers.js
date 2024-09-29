import { function as _f, boolean } from "@hgargg-0710/one"
const { trivialCompose } = _f
const { not } = boolean

import { StreamLocator } from "../StreamLocator/classes.js"
import type { ParserMap } from "../ParserMap/interfaces.js"
import type { PositionalValidatorState } from "./interfaces.js"

export function PositionalValidator(
	validatorMap: ParserMap<boolean, PositionalValidatorState>
) {
	const locator = StreamLocator(trivialCompose(not, validatorMap))
	return function (input: PositionalValidatorState) {
		const [found, pos] = locator(input).result
		return [!found, pos]
	}
}
