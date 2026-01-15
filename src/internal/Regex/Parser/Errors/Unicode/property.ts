import { validateId } from "../../../../../objects/Error.js"
import { isNonDigitId } from "../../../../../samples/alphabet.js"
import { isIdentifier } from "../../../../../samples/xml.js"

export const validatePropertyName = validateId(isNonDigitId)
export const validatePropertyValue = validateId(isIdentifier)
