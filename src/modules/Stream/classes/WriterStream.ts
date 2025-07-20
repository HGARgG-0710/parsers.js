import type { IDestination } from "../../../interfaces.js"
import { IdentityStream } from "./IdentityStream.js"

/**
 * This is a class extending `IdentityStream<T>`.
 * In particular, it is a class that expects to write whatever comes
 * out of its `.resource: IOwnedStream<string>` into its
 * `.private desination: IDestination`, settable via the public
 * `.writeTo(destination: IDestination): this` method, which
 * __must__ be called before any future attempts to call `.next()`.
 */
export class WriterStream extends IdentityStream.generic!<string>() {
	private destination: IDestination

	private write(input: string) {
		this.destination.write(input)
	}

	writeTo(destination: IDestination) {
		this.destination = destination
		return this
	}

	next() {
		this.write(this.curr)
		super.next()
	}
}
