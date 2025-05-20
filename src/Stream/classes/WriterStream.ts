import type { IDestination } from "../../interfaces.js"
import { WrapperStream } from "./WrapperStream.js"

// * IMPORTANT NOTE [pre-doc]: the `.writeTo` MUST BE made BEFORE any other calls to the object [immidiately after the constructor]
export class WriterStream extends WrapperStream<string> {
	private destination: IDestination

	private write(input: string) {
		this.destination.write(input)
	}

	writeTo(destination: IDestination) {
		this.destination = destination
	}

	next() {
		const curr = super.next()
		this.write(curr)
		return curr
	}
}
