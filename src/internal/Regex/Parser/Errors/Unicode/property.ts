import type { IErrorDataGetter, IStream } from "../../../../../interfaces.js"
import {
	findErrorDataDownstream,
	ParseError,
	tabbed,
	validateId
} from "../../../../../objects/Error.js"
import { isNonDigitId } from "../../../../../samples/alphabet.js"
import { isIdentifier } from "../../../../../samples/xml.js"
import { isCurrClbrace, isCurrEquality } from "../../Utils/limits.js"

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

class EmptyUnicodePropertyNameError extends ParseError.GenericParseError {
	private emptyNameMessage(): string {
		return "empty unicode property `Name` is not allowed in `\\p{Name=Value}` expressions"
	}

	protected override mandatoryFields(): string[] {
		return tabbed(this.emptyNameMessage())
	}
}

export function validateUnicodePropertyNonEmpty(
	input: IStream<string>,
	errDataGetter: IErrorDataGetter<string> = findErrorDataDownstream
) {
	if (isCurrClbrace(input))
		throw EmptyUnicodePropertyError.prepare(errDataGetter(input))
	return false
}

export function validateUnicodePropertyNameNonEmpty(
	input: IStream<string>,
	errDataGetter: IErrorDataGetter<string> = findErrorDataDownstream
) {
	if (isCurrEquality(input))
		throw EmptyUnicodePropertyNameError.prepare(errDataGetter(input))
	return false
}
