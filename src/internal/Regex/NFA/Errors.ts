import type { IErrorData, ISimpleErrorData } from "../../../interfaces.js"
import type { Regex } from "../../../objects.js"
import { ParseError } from "../../../objects/Error.js"

export class FactuallyEmptyRegexError extends ParseError {
	protected static override populate(
		errData: ISimpleErrorData,
		rawRegex: Regex.Raw
	): void {
		errData.setInfo("rawRegex", rawRegex)
	}

	static override prepare<T extends ISimpleErrorData = ISimpleErrorData>(
		errData: T,
		rawRegex: Regex.Raw
	) {
		return super.prepare(errData, rawRegex)
	}

	protected override makeMessage(errorData: IErrorData): string {
		return `factually empty Regex is forbidden: ${(
			errorData.getInfo("rawRegex") as Regex.Raw
		).print()}`
	}
}
