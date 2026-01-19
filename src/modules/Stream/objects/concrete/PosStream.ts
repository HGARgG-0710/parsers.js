import { Pools } from "../../../../global.js"
import type { IOwnedStream, IPosed } from "../../../../interfaces.js"
import { Counter, ObjectPool } from "../../../../objects.js"
import type { ICommonStream } from "../../interfaces/CommonStream.js"
import { IdentityStream } from "./IdentityStream.js"

/**
 * This is a mixin that combines:
 *
 * 1. `IdentityStream`
 * 2. `PosHavingStream`
 *
 * For its `.next()` operation, it updates the underlying
 * `.resource: IOwnedStream`'s `.curr`, while also
 * incrementing its `.pos` property.
 *
 * It calls both the constructors from `PosHavingStream` and `IdentityStream`
 * [in that order].
 */
export class PosStream<T = any>
	extends IdentityStream<T>
	implements ICommonStream<T>, IPosed
{
	static override readonly pool = Pools.Stream.add(new ObjectPool(PosStream))

	private readonly counter = new Counter(0)

	get pos(): number {
		return this.counter.get()
	}

	private resetCounter() {
		this.counter.reset()
	}

	override postFree(): void {
		super.postFree()
		this.resetCounter()
	}

	override next(): void {
		super.next()
		this.counter.inc()
	}

	override baseInit(): void {
		this.resetCounter()
	}

	constructor(resource?: IOwnedStream) {
		super()
		this.init(resource)
	}
}
