import { Pools } from "../../../../main.js"
import { ObjectPool } from "../../../classes.js"
import type { ICopiable } from "../../../interfaces.js"
import { mixin } from "../../../mixin.js"
import type { ILinkedStream, IOwnedStream } from "../interfaces/OwnedStream.js"
import { AttachedStream, AttachedStreamAnnotation } from "./AttachedStream.js"
import { PoolableStream } from "./PoolableStream.js"
import { ResourceCopyingStream } from "./ResourceCopyingStream.js"

export class IdentityStreamAnnotation<T = any, Args extends any[] = []>
	extends AttachedStreamAnnotation<T, Args>
	implements ICopiable, ILinkedStream<T, Args>
{
	protected ["constructor"]: new (resource?: IOwnedStream<T>) => this
	static readonly pool: ObjectPool<IdentityStreamAnnotation, [IOwnedStream]>

	protected get pool(): ObjectPool {
		return null as any
	}

	free(): void {}

	copy(): this {
		return this
	}
}

let identityStream: typeof IdentityStreamAnnotation | null = null

function BuildIdentityStream<T = any, Args extends any[] = []>() {
	return new mixin<IdentityStreamAnnotation>(
		{
			name: "IdentityStream",
			static: {
				pool: (classObj) =>
					Pools.Stream.add(
						new ObjectPool<IdentityStreamAnnotation<T>>(
							classObj as new (
								...args: Partial<Args> | []
							) => IdentityStreamAnnotation<T>
						)
					)
			},
			properties: {
				get pool() {
					return this.class.pool
				}
			},
			constructor(resource?: IOwnedStream) {
				this.super.AttachedStream.constructor.call(this, resource)
			}
		},
		[ResourceCopyingStream],
		[AttachedStream, PoolableStream]
	).toClass() as typeof IdentityStreamAnnotation<T, Args>
}

function PreIdentityStream<
	T = any,
	Args extends any[] = any[]
>(): typeof IdentityStreamAnnotation<T, Args> {
	return identityStream
		? identityStream
		: (identityStream = BuildIdentityStream<
				T,
				Args
		  >() as typeof IdentityStreamAnnotation)
}

/**
 * This is a (concrete) mixin of:
 *
 * 1. `ResourceCopyingStream`
 * 2. `AttachedStream`
 *
 * It uses the constructor of `AttachedStream`.
 *
 * Extremely useful for usage as a default in
 * `TableHandler`s defining `IStreamChooser`s
 * (since that would just mean to reference the
 * elements from the underlying `IStream` instead
 * of transforming them);
 */
export function IdentityStream<T = any>(resource?: IOwnedStream<T>) {
	return PreIdentityStream<T>().pool.create(resource)
}

IdentityStream.generic = PreIdentityStream
