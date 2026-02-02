import type {
	ICellNode,
	IErrorDataGetter,
	ISimpleErrorData,
	IStream
} from "../../../../../interfaces.js"
import {
	findErrorDataUpstream,
	ParseError
} from "../../../../../objects/Error.js"
import { isHex } from "../../../../../samples/alphabet.js"
import { currUnicodeHex } from "./common.js"

export class InvalidHexError extends ParseError.GenericParseError {
	protected static override populate(
		errData: ISimpleErrorData,
		hex: string
	): void {
		errData.setInfo("badHex", hex)
	}

	static override prepare<T extends ISimpleErrorData = ISimpleErrorData>(
		errData: T,
		hex: string
	) {
		return super.prepare(errData, hex)
	}

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

export function validateHex(
	stream: IStream<ICellNode<string>>,
	errDataGetter: IErrorDataGetter<ICellNode<string>> = findErrorDataUpstream
) {
	const unicodeHex = currUnicodeHex(stream)
	if (!isHex(unicodeHex))
		throw InvalidHexError.prepare(errDataGetter(stream), unicodeHex)
}
