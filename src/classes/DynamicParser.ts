import type { Summat } from "@hgargg-0710/summat.ts"
import type {
	IComposedStream,
	IInputStream,
	IOwnedStream
} from "../interfaces.js"
import type { IParse, IParseState } from "../interfaces/DynamicParser.js"
import { WrapperStream } from "./Stream.js"

class ParsedStream<
	FinalType = any,
	InitType = any
> extends WrapperStream<FinalType> {
	["constructor"]: new (parseInstance: Parse<FinalType, InitType>) => this

	next() {
		const items = super.next()
		this.parseInstance.maybeUpdate()
		return items
	}

	copy(): this {
		return new this.constructor(this.parseInstance.copy())
	}

	constructor(private readonly parseInstance: Parse<FinalType, InitType>) {
		super(parseInstance.workStream)
	}
}

class Parse<FinalType = any, InitType = any>
	implements IParse<FinalType, InitType>
{
	["constructor"]: new (
		workStream: IComposedStream<FinalType>,
		inputStream: IInputStream<string, InitType>
	) => this

	private didUpdate = false

	private _state: IParseState<FinalType, InitType>

	private set state(newState: IParseState<FinalType, InitType>) {
		this._state = newState
	}

	private getState(state: Summat = {}): IParseState<FinalType, InitType> {
		return { ...state, parse: this }
	}

	private onUpdate() {
		this.workStream.renewResource()
		this.didUpdate = false
	}

	private initState(state: Summat) {
		this.state = this.getState(state)
	}

	private resetInput(input: InitType) {
		this.initInputStream(input)
		this.initWorkStream()
		this.shareState()
	}

	private initInputStream(input: InitType) {
		this.inputStream.init(input)
	}

	private initWorkStream() {
		this.workStream.init(this.inputStream)
	}

	private shareState() {
		this.workStream.setState(this.state)
	}

	get state() {
		return this._state
	}

	get streams() {
		return this.workStream.streams
	}

	update() {
		this.didUpdate = true
	}

	init(input: InitType, state?: Summat) {
		if (state) this.initState(state)
		if (input) this.resetInput(input)
		return this
	}

	maybeUpdate() {
		if (this.didUpdate) this.onUpdate()
	}

	copy() {
		return new this.constructor(
			this.workStream.copy(),
			this.inputStream.copy()
		)
	}

	constructor(
		public readonly workStream: IComposedStream<FinalType>,
		private readonly inputStream: IInputStream<string, InitType>
	) {}
}

export function DynamicParser<FinalType = any, InitType = any>(
	workStream: IComposedStream<FinalType>,
	inputStream: IInputStream<string, InitType>
) {
	const parse = new Parse(workStream, inputStream)
	return function (input: InitType, state?: Summat): IOwnedStream<FinalType> {
		return new ParsedStream(parse.copy().init(input, state))
	}
}
