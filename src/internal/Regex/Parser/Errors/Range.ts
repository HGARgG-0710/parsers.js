import type { IErrorDataGetter, IStream } from "../../../../interfaces.js"
import {
	findErrorDataDownstream,
	ParseError,
	tabbed
} from "../../../../objects/Error.js"
import { isCurrClbrace } from "../Utils/limits.js"

class EmptyRangeError extends ParseError.GenericParseError {
	private validRangeKinds(): string[] {
		return ["(...){n}", "(...){n,}", "(...){n,m}"]
	}

	private emptyRangeMessage(): string {
		return `got an empty range (...){} instead of either of: ${this.validRangeKinds().join(", or")}`
	}

	protected override mandatoryFields(): string[] {
		return tabbed(this.emptyRangeMessage())
	}
}

export function validateRangeNonEmpty(
	input: IStream<string>,
	errDataGetter: IErrorDataGetter<string> = findErrorDataDownstream
) {
	if (isCurrClbrace(input))
		throw EmptyRangeError.prepare(errDataGetter(input))
	return false
}
