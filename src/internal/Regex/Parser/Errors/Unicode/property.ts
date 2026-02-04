import type { IErrorDataGetter, IStream } from "../../../../../interfaces.js"
import {
	findErrorDataUpstream,
	ParseError,
	tabbed,
	validateId
} from "../../../../../objects/Error.js"
import { isNonDigitId } from "../../../../../samples/alphabet.js"
import { isIdentifier } from "../../../../../samples/xml.js"
import { isCurrClbrace } from "../../Utils/limits.js"

export const validatePropertyName = validateId(isNonDigitId)
export const validatePropertyValue = validateId(isIdentifier)

class EmptyUnicodePropertyError extends ParseError.GenericParseError {
	private emptyUniPropMessage(): string {
		return "provided with an empty Unicode Property: \\p{}"
	}

	protected override mandatoryFields(): string[] {
		return tabbed(this.emptyUniPropMessage())
	}
}

export function validateUnicodePropertyNonEmpty(
	input: IStream<string>,
	errDataGetter: IErrorDataGetter<string> = findErrorDataUpstream
) {
	if (isCurrClbrace(input))
		throw EmptyUnicodePropertyError.prepare(errDataGetter(input))
	return false
}
