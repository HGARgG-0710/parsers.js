import { type } from "@hgargg-0710/one"
import type { ILinkedStream, IOwnedStream } from "../interfaces.js"
import type { IStreamChooser } from "../Stream/interfaces/ComposedStream.js"
import { RecursiveInitList } from "./RecursiveList.js"

const { isFunction, isArray } = type

export class StreamList extends RecursiveInitList<
	ILinkedStream,
	IStreamChooser,
	IOwnedStream
> {
	protected isRecursive(x: any): x is IStreamChooser {
		return isFunction(x)
	}

	protected isOld(terminal: ILinkedStream): boolean {
		return terminal.isEnd
	}

	protected evaluator(
		currRec: IStreamChooser,
		last: IOwnedStream | ILinkedStream
	) {
		const maybeStream = currRec(last)
		return isArray(maybeStream) ? new StreamList(maybeStream) : maybeStream
	}
}
