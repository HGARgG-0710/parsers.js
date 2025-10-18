import { resourceInitializer } from "../../Initializer/objects/ResourceInitializer.js"
import type { ILinkedStream, IOwnedStream } from "../interfaces/OwnedStream.js"
import { CustomLinkedStream } from "./CustomLinkedStream.js"

// ! LATER FOR DOCS - *THIS* is how one is supposed to use ErrorHandling-Streams:
// * function SomeChooser() {
// * 	return [
// * 		HighHarmlessStream(),
// * 		ErrorHandlingStream(ErrorThrowingStreamUninit()),
// * 		LowHarmlessStream()
// * 	]
// * }
export abstract class ErrorStream<T = any>
	extends CustomLinkedStream<T>
	implements ILinkedStream<T>
{
	protected abstract errHandler(err: any): void

	get initializer() {
		return resourceInitializer
	}

	isCurrEnd(): boolean {
		return this.resource.isCurrEnd()
	}

	get isEnd() {
		return this.resource.isEnd
	}

	get curr() {
		return this.resource.curr
	}

	next() {
		try {
			this.resource.next()
		} catch (err) {
			this.errHandler(err)
		}
	}

	setResource(resource: IOwnedStream): void {
		try {
			this.resource.init(resource)
		} catch (err) {
			this.errHandler(err)
		}
	}

	constructor(readonly resource: ILinkedStream<T>) {
		super()
		resource.setOwner(this)
	}
}
