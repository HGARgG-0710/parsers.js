import { not, PositionalStream, StreamLocator, type ParserMap } from "main.js"
import { function as _f } from "@hgargg-0710/one"

const { trivialCompose } = _f

export function PositionalValidator<KeyType = any>(
	validatorMap: ParserMap<KeyType, boolean>
) {
	// TODO: THE 'table' (refactor...): 
	const locator = StreamLocator(
		trivialCompose(not, (x: any) => validatorMap.index(x)(x))
	)
	return function (input: PositionalStream) {
		const [found, pos] = locator(input)
		return [!found, pos]
	}
}
