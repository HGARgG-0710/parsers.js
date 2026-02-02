import type { ISimpleErrorData } from "../../../interfaces.js"
import type { Regex } from "../../../objects.js"
import { ParseError } from "../../../objects/Error.js"
import { LineFormatter } from "../../../objects/Logger.js"

export class FactuallyEmptyRegexError extends ParseError {
	private static readonly formatter = new LineFormatter(",\n")

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

	private formatErrRegex(errorData: ISimpleErrorData) {
		return FactuallyEmptyRegexError.formatter.format(
			errorData.getInfo("rawRegex") as Regex.Raw,
			true
		)
	}

	protected override makeMessage(errorData: ISimpleErrorData): string {
		return `factually empty Regex is forbidden:\n${this.formatErrRegex(errorData)}`
	}
}
