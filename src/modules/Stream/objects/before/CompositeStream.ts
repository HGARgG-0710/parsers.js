import type { Summat } from "@hgargg-0710/summat.ts"
import type { IDepthMark } from "../../../../interfaces.js"
import type { IParseState } from "../../../../interfaces/Parser.js"
import type {
	ICompositeStream,
	ILinkedStream,
	IOwnedStream,
	IRawStreamArray
} from "../../../../interfaces/Stream.js"
import { StreamPipe } from "../../../../internal/Stream/StreamPipe.js"
import { resourceInitializer } from "../../../../objects/Initializable.js"
import { IdentityStream } from "../concrete.js"

const compositeStreamInitializer = {
	init(
		target: BeforeCompositeStream,
		lowStream?: IOwnedStream,
		rawStreams?: IRawStreamArray,
		state?: IParseState
	) {
		resourceInitializer.init(target, lowStream)
		if (rawStreams) target.setRawStreams(rawStreams)
		if (state) target.setState(state)
		if (target.isEvaluationReady()) target.evaluateStreams()
	}
}

export abstract class BeforeCompositeStream<T = any>
	extends IdentityStream<T, [IRawStreamArray, IParseState]>
	implements ICompositeStream<T>
{
	protected override ["constructor"]: new (
		lowStream?: IOwnedStream,
		rawStreams?: IRawStreamArray,
		state?: IParseState
	) => this

	protected rawStreams?: IRawStreamArray
	private streamList?: StreamPipe.StreamRootPipe
	private lowStream?: IOwnedStream

	abstract state: IParseState
	abstract setState(state: Summat): void

	private tryRenew() {
		return this.streamList!.renewAll(this.lowStream!)
	}

	private fixupRenewe() {
		this.updateResource()
		return true
	}

	private nonRenewable() {
		return false
	}

	private updateResource() {
		this.resource = this.streamList!.firstItemDeep()
		this.resource.connectOwner(this)
	}

	protected override get initializer() {
		return compositeStreamInitializer
	}

	get streams() {
		return this.streamList!.items
	}

	getDepth(mark: IDepthMark): number {
		return this.streamList!.getDepth(mark)
	}

	override connectResource(lowStream: IOwnedStream) {
		this.lowStream = lowStream
	}

	setRawStreams(rawStreams: IRawStreamArray) {
		this.rawStreams = rawStreams
		this.streamList = new StreamPipe.StreamRootPipe(rawStreams, this)
		return this
	}

	isEvaluationReady() {
		return !!this.streamList && !!this.lowStream
	}

	evaluateStreams() {
		this.streamList!.evaluate(this.lowStream!)
		this.updateResource()
	}

	renewResource() {
		return this.tryRenew() ? this.fixupRenewe() : this.nonRenewable()
	}

	override get isEnd() {
		return super.isEnd && !this.renewResource()
	}

	override free(): void {}

	renewStream(stream: ILinkedStream) {
		return this.streamList!.renewItem(stream)
	}

	constructor(
		lowStream?: IOwnedStream,
		rawStreams?: IRawStreamArray,
		state?: IParseState
	) {
		super()
		this.init(lowStream, rawStreams, state)
	}
}
