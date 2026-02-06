import type { INode, IRawStreamArray } from "../../../../interfaces.js"
import { IteratorStreamChooser } from "../../../../modules/Stream/objects/Chooser.js"
import { ensureChildUnrevivable, skip } from "../../../../objects/Error.js"
import { LimitStream, SingleNodeStream } from "../../../../objects/Stream.js"
import {
	EndBracketStream,
	StateAccessStream,
	StringConsumerStream
} from "../../../../samples/Stream.js"
import { next } from "../../../../utils/Stream.js"
import {
	validatePropertyName,
	validatePropertyValue,
	validateUnicodePropertyNonEmpty
} from "../Errors.js"
import { UnicodeProperty, UnicodePropertyAlias } from "../Nodes.js"
import {
	isCurrEquality,
	isNotNextClbrace,
	isNotNextEquality,
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
		.setIsEmpty((input) => validateUnicodePropertyNonEmpty(input))
		.setLongAs(isNotNextClbrace)
)

const UnicodePropertyNameLimitStream = EndBracketStream<string>(
	new LimitStream.Limits.Builder()
		.setIsEmpty((input) => {
			if (isCurrEquality(input)) {
				// TODO: here, throw a LESS GENERIC ERROR!
				// * Property-names must be non-empty.
				throw new Error("")
			}
			return false
		})
		.setLongAs(isNotNextEquality)
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

class UnicodePropertyStream extends SingleNodeStream<INode> {
	private getPropName(): [boolean, string] {
		validatePropertyName(this.resource!)
		const propName: string = next(this.resource!)
		const hasValue = this.reviveChild()
		return [hasValue, propName]
	}

	private getPropValue() {
		validatePropertyValue(this.resource!)
		const propValue: string = next(this.resource!)
		ensureChildUnrevivable(this)
		return propValue
	}

	private getAsUnicodeAlias(propName: string) {
		return new UnicodePropertyAlias(propName)
	}

	private getAsFullUnicodeProperty(propName: string, value: string) {
		return new UnicodeProperty(propName, value)
	}

	private processFullUnicodeProperty(propName: string) {
		const value = this.getPropValue()
		return this.getAsFullUnicodeProperty(propName, value)
	}

	private processUnicodeProperty() {
		const [hasValue, propName] = this.getPropName()
		return hasValue
			? this.processFullUnicodeProperty(propName)
			: this.getAsUnicodeAlias(propName)
	}

	override baseInit(): void {
		this.curr = this.processUnicodeProperty()
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
		UnicodePropertyLimitStream(),
		StateAccessStream<string>()
	]
}
