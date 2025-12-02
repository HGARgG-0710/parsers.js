import type { IOwnedStream, IPosed } from "../../../../interfaces.ts"
import type { ObjectPool } from "../../../../objects.ts"
import type { ICommonStream } from "../../interfaces/CommonStream.ts"
import type { IdentityStream } from "./IdentityStream.js"

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
export declare class PosStream<T = any>
	extends IdentityStream<T>
	implements ICommonStream<T>, IPosed
{
	static readonly pool: ObjectPool<PosStream, [IOwnedStream]>
	protected forward(n?: number): void
	get pos(): number
}
