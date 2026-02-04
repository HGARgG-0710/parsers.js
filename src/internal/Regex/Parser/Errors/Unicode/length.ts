import type {
	ICellNode,
	IErrorDataGetter,
	ISimpleErrorData,
	IStream
} from "../../../../../interfaces.js"
import {
	findErrorDataUpstream,
	ParseError,
	tabbed
} from "../../../../../objects/Error.js"
import { currUnicodeHex } from "./common.js"

const VALID_UNICODE_CODE_LENGTH = 6

class InvalidCodeLengthError extends ParseError.GenericParseError {
	protected static override populate(
		errData: ISimpleErrorData,
		length: number
	) {
		errData.setInfo("badCodeLength", length)
	}

	static override prepare<T extends ISimpleErrorData = ISimpleErrorData>(
		errData: T,
		length: number
	) {
		return super.prepare(errData, length)
	}

	private printBadCodeLength(length: number) {
		return `bad unicode code length detected (${VALID_UNICODE_CODE_LENGTH} expected): ${length}`
	}

	private badCodeLength() {
		return this.printBadCodeLength(this.errData.getInfo("badCodeLength"))
	}

	protected mandatoryFields(): string[] {
		return tabbed(this.badCodeLength())
	}
}

export function validateUnicodeCodeLength(
	stream: IStream<ICellNode<string>>,
	errDataGetter: IErrorDataGetter<ICellNode<string>> = findErrorDataUpstream
) {
	const codeLength = currUnicodeHex(stream).length
	if (codeLength !== VALID_UNICODE_CODE_LENGTH)
		throw InvalidCodeLengthError.prepare(errDataGetter(stream), codeLength)
}
