import type { Summat } from "@hgargg-0710/summat.ts"
import type {
	ICompositeStream,
	IInputStream,
	ILinkedStream
} from "../interfaces.js"
import type { IParse, IParseState } from "../interfaces/DynamicParser.js"
import { Initializable } from "./Initializer.js"
import { SyncStream } from "./Stream.js"

class ParsedStream<FinalType = any, InitType = any> extends SyncStream<
	FinalType,
	[]
> {
	protected ["constructor"]: new (
		parseInstance: Parse<FinalType, InitType>
	) => this

	next() {
		super.next()
		this.parseInstance.maybeUpdate()
	}

	copy(): this {
		return new this.constructor(this.parseInstance.copy())
	}

	constructor(private readonly parseInstance: Parse<FinalType, InitType>) {
		super(parseInstance.workStream)
	}
}

const parseInitializer = {
	init<InitType = any>(target: Parse, input?: InitType, state?: Summat) {
		if (state) target.setState(state)
		if (input) target.setInput(input)
	}
}

class Parse<FinalType = any, InitType = any>
	extends Initializable<[InitType, Summat]>
	implements IParse<FinalType, InitType>
{
	private ["constructor"]: new (
		workStream: ICompositeStream<FinalType>,
		inputStream: IInputStream<string, InitType>
	) => this

	private didUpdate = false

	private _state: IParseState<FinalType, InitType>

	private set state(newState: IParseState<FinalType, InitType>) {
		this._state = newState
	}

	get state() {
		return this._state
	}

	private createState(
		preState: Summat = {}
	): IParseState<FinalType, InitType> {
		return { ...preState, parse: this }
	}

	private onUpdate() {
		this.workStream.renewResource()
		this.didUpdate = false
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

	protected get initializer() {
		return parseInitializer
	}

	get streams() {
		return this.workStream.streams
	}

	setState(preState: Summat) {
		this.state = this.createState(preState)
	}

	setInput(input: InitType) {
		this.initInputStream(input)
		this.initWorkStream()
		this.shareState()
	}

	update() {
		this.didUpdate = true
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
		public readonly workStream: ICompositeStream<FinalType>,
		private readonly inputStream: IInputStream<string, InitType>
	) {
		super()
	}
}

export function DynamicParser<FinalType = any, InitType = any>(
	workStream: ICompositeStream<FinalType>,
	inputStream: IInputStream<string, InitType>
) {
	const parse = new Parse(workStream, inputStream)
	return function (
		input: InitType,
		state?: Summat
	): ILinkedStream<FinalType> {
		return new ParsedStream(parse.copy().init(input, state))
	}
}
