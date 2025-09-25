import type {
	ICommonStream,
	ICompositeStream,
	IParseState,
	IRawStreamArray
} from "../../../interfaces.ts"
import type { IOwnedStream } from "../interfaces/OwnedStream.ts"

/**
 * This is a factory for creation of `ICompositeStream<T>` implementations
 * using the given `IRawStreamArray` input to define their composition
 * [which is being attached element-by-element via `.init()`
 * from the *last* index towards 0].
 *
 * After initialization, it will call the topmost of its streams on each `.next()`
 * call, and (after every step) verify it being non-over. In the event that
 * it is, however, a "re-evaluation procedure" will be used. This procedure
 * walks (backwards) through the structure of the `CompositeStream`,
 * re-initializing the necessary `ILinkedStream`s, and re-running the
 * "obsolete" `IStreamChooser`-s. If an obsolete non-`IStreamChooser`
 * element is met before any `IStreamChooser`, the `CompositeStream`
 * is considered over, since, there is no more work to be accomplished
 * in lower streams. Thus, the stream successfully returns the
 * composition of the user-provided 'stream's.
 *
 * It can also store state (as can all `ICompositeStream`s),
 * which can be set at the beginning via `.setState`, and then
 * used inside of `IStreamChooser`s via `this.state` [with `this` being
 * the current owning `ICompositeStream`], and other "static" 'IControlStream's
 * also sharing the `.state` of their parent `ICompositeStream`.
 */
export declare function CompositeStream<T = any>(
	...streams: IRawStreamArray
): (
	resource?: IOwnedStream,
	state?: IParseState
) => ICompositeStream<T> & ICommonStream<T>
