import type {
	ICellNode,
	IErrorData,
	IErrorDataGetter,
	IStream
} from "../../interfaces.js"
import { findErrorDataUpstream, ParseError } from "../../objects/Error.js"
import { isHex } from "../../samples/alphabet.js"

const VALID_UNICODE_CODE_LENGTH = 6

class InvalidUnicodeCodeLengthError extends ParseError.GenericParseError {
	private printBadCodeLength(length: number) {
		return `bad unicode code length detected (${VALID_UNICODE_CODE_LENGTH} expected): ${length}`
	}

	private badCodeLength() {
		return this.printBadCodeLength(this.errData.getInfo("badCodeLength"))
	}

	protected mandatoryFields(): string[] {
		return [this.badCodeLength()]
	}
}

class InvalidHexError extends ParseError.GenericParseError {
	private printBadHex(hex: string) {
		return `invalid hex provided: ${hex}`
	}

	private badHex() {
		return this.printBadHex(this.errData.getInfo("badHex"))
	}

	protected mandatoryFields(): string[] {
		return [this.badHex()]
	}
}

function prepareInvalidUnicodeCodeLengthError(
	errData: IErrorData,
	length: number
) {
	errData.setInfo("badCodeLength", length)
	return errData
}

const currUnicodeHex = (stream: IStream<ICellNode<string>>) => stream.curr.value

export function validateUnicodeCodeLength(
	stream: IStream<ICellNode<string>>,
	errDataGetter: IErrorDataGetter<ICellNode<string>> = findErrorDataUpstream
) {
	const codeLength = currUnicodeHex(stream).length
	if (codeLength !== VALID_UNICODE_CODE_LENGTH)
		throw new InvalidUnicodeCodeLengthError(
			prepareInvalidUnicodeCodeLengthError(
				errDataGetter(stream),
				codeLength
			)
		)
}

function prepareHexError(errorData: IErrorData, hex: string) {
	errorData.setInfo("badHex", hex)
	return errorData
}

export function validateHex(
	stream: IStream<ICellNode<string>>,
	errDataGetter: IErrorDataGetter<ICellNode<string>> = findErrorDataUpstream
) {
	const unicodeHex = currUnicodeHex(stream)
	if (!isHex(unicodeHex))
		throw new InvalidHexError(
			prepareHexError(errDataGetter(stream), unicodeHex)
		)
}
