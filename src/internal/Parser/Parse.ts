import type { Summat } from "@hgargg-0710/summat.ts"
import type {
	ICompositeStream,
	IDepthMark,
	IErrorDataMaker,
	IInitializer,
	IInputStream,
	ILinkedStream,
	IParse,
	IParseState
} from "../../interfaces.js"
import { Initializable } from "../../objects/Initializable.js"

export class Parse<InType = any, FinalType = any, InitType = any>
	extends Initializable<[InitType, Summat]>
	implements IParse<FinalType, InitType>
{
	private static readonly initializer: IInitializer<[any, Summat]> = {
		init<InitType = any>(target: Parse, input?: InitType, state?: Summat) {
			if (input) target.setInput(input)
			if (state) target.setState(state)
			if (target.isSetupReady()) target.setupStreams()
		}
	}

	private readonly updatePending: ParseUpdatePendingState
	private updateState: IParseUpdateState

	private input?: InitType
	private _state?: IParseState<FinalType, InitType>

	private set state(newState: IParseState<FinalType, InitType>) {
		this._state = newState
	}

	get state() {
		return this._state!
	}

	private createState(
		preState: Summat = {}
	): IParseState<FinalType, InitType> {
		return {
			parse: this,
			errData: this.errDataMaker(this.inputStream, this.input!),
			errors: [],
			...preState
		}
	}

	protected get initializer() {
		return Parse.initializer
	}

	get streams() {
		return this.workStream.streams
	}

	setInput(input: InitType) {
		this.input = input
	}

	setState(preState: Summat): void {
		this.state = this.createState(preState)
		this.workStream.setState(this.state)
	}

	isSetupReady() {
		return !!this.input && !!this._state
	}

	setupStreams() {
		this.inputStream.init(this.input)
		this.workStream.init(this.inputStream)
	}

	renewStream(stream: ILinkedStream): boolean {
		return this.workStream.renewStream(stream)
	}

	update() {
		this.updateState = this.updatePending
	}

	applyUpdate() {
		this.updateState = this.updateState.applyUpdate()
	}

	getDepth(mark: IDepthMark): number {
		return this.workStream.getDepth(mark)
	}

	constructor(
		readonly workStream: ICompositeStream<FinalType>,
		private readonly inputStream: IInputStream<InType, InitType>,
		private readonly errDataMaker: IErrorDataMaker<InType, InitType>
	) {
		super()
		const updatesNone = new ParseUpdatesNone()
		this.updateState = updatesNone
		this.updatePending = new ParseUpdatePendingState(
			this.workStream,
			updatesNone
		)
	}
}

interface IParseUpdateState {
	applyUpdate(): IParseUpdateState
}

class ParseUpdatePendingState implements IParseUpdateState {
	applyUpdate() {
		this.workStream.renewResource()
		return this.asNoUpdates
	}

	constructor(
		private readonly workStream: ICompositeStream,
		private readonly asNoUpdates: ParseUpdatesNone
	) {}
}

class ParseUpdatesNone implements IParseUpdateState {
	applyUpdate(): IParseUpdateState {
		return this
	}
}
