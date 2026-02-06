import type {
	IErrorDataGetter,
	ISimpleErrorData,
	IStream
} from "../../../../interfaces.js"
import {
	findErrorDataDownstream,
	ParseError,
	tabbed
} from "../../../../objects/Error.js"
import { isCurrClbrace } from "../Utils/limits.js"

class EmptyTypeMatchError extends ParseError.GenericParseError {
	protected static override populate(
		errData: ISimpleErrorData,
		modifier: string
	): void {
		errData.setInfo("modifier", modifier)
	}

	static override prepare<T extends ISimpleErrorData = ISimpleErrorData>(
		errData: T,
		modifier: string
	): T {
		return super.prepare(errData, modifier)
	}

	private emptyTypeId(): string {
		return `got an illegal empty type-match clause: ${this.errData.getInfo("modifier")}{}`
	}

	protected override mandatoryFields(): string[] {
		return tabbed(this.emptyTypeId())
	}
}

export function validateNonEmptyTypeMatch(modifier: string) {
	return function (
		input: IStream<string>,
		errDataGetter: IErrorDataGetter<string> = findErrorDataDownstream
	) {
		if (isCurrClbrace(input))
			throw EmptyTypeMatchError.prepare(errDataGetter(input), modifier)
		return false
	}
}
