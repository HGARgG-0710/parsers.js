import type { IParseState, IParseStream } from "../../interfaces.js"
import { IdentityStream } from "../../objects/Stream.js"
import type { Parse } from "./Parse.js"

export class ParseStream<InType = any, FinalType = any, InitType = any>
	extends IdentityStream<FinalType, []>
	implements IParseStream<FinalType>
{
	setState(state: IParseState): void {
		this.parseInstance.setState(state)
	}

	get state() {
		return this.parseInstance.state
	}

	override next() {
		super.next()
		this.parseInstance.applyUpdate()
	}

	override free(): void {}

	constructor(
		private readonly parseInstance: Parse<InType, FinalType, InitType>
	) {
		super(parseInstance.workStream)
	}
}
