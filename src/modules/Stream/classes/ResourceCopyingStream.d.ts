import type {
	ICopiable,
	IOwnedStream,
	IResourcefulStream
} from "../../../interfaces.ts"

/**
 * This is a (sealed) mixin that requires the using party to
 * define the (optional) `.resource` property. It contains a `.copy` method,
 * which returns `new this.constructor(this.resource?.copy())`.
 *
 * Intended to be used as a way to provide the "defualt" `.copy()`-method
 * for the classes implementing `IResourcefulStream`.
 */
export declare abstract class ResourceCopyingStream<T = any>
	implements ICopiable, IResourcefulStream<T>
{
	abstract readonly isEnd: boolean
	abstract readonly curr: T
	abstract next: () => void
	abstract isCurrEnd: () => boolean

	abstract readonly resource?: IOwnedStream | undefined
	abstract setResource(newResource: IOwnedStream): void

	copy(): this
}
