import { type } from "@hgargg-0710/one"
import type { ILinkedStream, IOwnedStream } from "../interfaces.js"
import type {
	IComposedStream,
	IStreamArray,
	IStreamChoice,
	IStreamChooser
} from "../Stream/interfaces/ComposedStream.js"
import { RecursiveInitList } from "./RecursiveList.js"

const { isFunction, isArray } = type

export class StreamList extends RecursiveInitList<
	ILinkedStream,
	IStreamChooser,
	IOwnedStream
> {
	private fromStreams(streams: IStreamArray) {
		return new StreamList(streams, this.topStream)
	}

	private fromChoice(choice: IStreamChoice) {
		return isArray(choice) ? this.fromStreams(choice) : choice
	}

	protected isRecursive(x: any): x is IStreamChooser {
		return isFunction(x)
	}

	protected isOld(terminal: ILinkedStream): boolean {
		return terminal.isEnd
	}

	protected evaluator(currRec: IStreamChooser, last: IOwnedStream) {
		return this.fromChoice(
			currRec.call(this.topStream, last) as IStreamChoice
		)
	}

	constructor(
		origItems: IStreamArray,
		private readonly topStream: IComposedStream
	) {
		super(origItems)
	}
}
