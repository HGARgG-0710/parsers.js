import type { IRawStreamArray } from "../../../../interfaces.js"
import { IteratorStreamChooser } from "../../../../modules/Stream/objects/Chooser.js"
import {
	ensureChildUnrevivable,
	skip,
	tryReviveChild
} from "../../../../objects/Error.js"
import { LimitStream, SingleNodeStream } from "../../../../objects/Stream.js"
import {
	EndBracketStream,
	isCurr,
	isNotNext,
	StringConsumerStream
} from "../../../../samples/Stream.js"
import { next } from "../../../../utils/Stream.js"
import { validatePropertyName, validatePropertyValue } from "../Errors.js"
import { UnicodeProperty } from "../Nodes.js"
import {
	isCurrClbrace,
	isNotNextClbrace,
	skipOpbrace
} from "../Utils/limits.js"

const skipP = skip("p")

const UnicodePropertyLimitStream = EndBracketStream<string>(
	new LimitStream.Limits.Builder()
		.setFrom((input) => {
			skipP(input) // p
			skipOpbrace(input) // {
			return 0
		})
		.setIsEmpty((input) => {
			if (isCurrClbrace(input)) {
				// TODO: here, throw a LESS GENERIC ERROR!
				// * It's NOT ALLOWED for a given 'p{...}' to have its block empty: 'p{}'
				throw new Error("")
			}
			return false
		})
		.setLongAs(isNotNextClbrace)
)

const UnicodePropertyNameLimitStream = EndBracketStream<string>(
	new LimitStream.Limits.Builder()
		.setIsEmpty(() => {
			if (isCurr("=")) {
				// TODO: here, throw a LESS GENERIC ERROR!
				// * Property-names must be non-empty.
				throw new Error("")
			}
			return false
		})
		.setLongAs(isNotNext("="))
)

class UnicodePropertyStreamChooser extends IteratorStreamChooser<string> {
	static readonly instance = new UnicodePropertyStreamChooser()

	private static readonly Streams = [
		HandleUnicodePropertyName,
		HandleUnicodePropertyValue
	]

	protected override getStreams(): IRawStreamArray<string> {
		return UnicodePropertyStreamChooser.Streams
	}
}

class UnicodePropertyStream extends SingleNodeStream<UnicodeProperty> {
	private getPropName() {
		validatePropertyName(this.resource!)
		const propName: string = next(this.resource!)
		tryReviveChild(this)
		return propName
	}

	private getPropValue() {
		validatePropertyValue(this.resource!)
		const propValue: string = next(this.resource!)
		ensureChildUnrevivable(this)
		return propValue
	}

	override baseInit(): void {
		const propName = this.getPropName()
		const value = this.getPropValue()
		this.curr = new UnicodeProperty(propName, value)
	}
}

const UnicodePropertyValueConsumerStream = StringConsumerStream()
const UnicodePropertyNameConsumerStream = StringConsumerStream()

function HandleUnicodePropertyName() {
	return [
		UnicodePropertyNameConsumerStream(),
		UnicodePropertyNameLimitStream()
	]
}

function HandleUnicodePropertyValue(): IRawStreamArray<string> {
	return [UnicodePropertyValueConsumerStream()]
}

export function HandleUnicodeProperty(): IRawStreamArray {
	return [
		new UnicodePropertyStream(),
		UnicodePropertyStreamChooser.instance.reset(),
		UnicodePropertyLimitStream()
	]
}
