import { type } from "@hgargg-0710/one"
import type { IOwnedStream } from "../interfaces.js"
import type { IStreamChooser } from "../Stream/interfaces/ComposedStream.js"
import { RecursiveInitList } from "./RecursiveList.js"

const { isFunction, isArray } = type

export class StreamList<Type = any> extends RecursiveInitList<
	IOwnedStream<Type>,
	IStreamChooser<Type>
> {
	protected isRecursive(x: any): x is IStreamChooser<Type> {
		return isFunction(x)
	}

	protected isOld(terminal: IOwnedStream<Type>): boolean {
		return terminal.isEnd
	}

	protected evaluator(
		currRec: IStreamChooser<Type>,
		last: IOwnedStream<Type>
	) {
		const maybeStream = currRec(last)
		return isArray(maybeStream) ? new StreamList(maybeStream) : maybeStream
	}
}
