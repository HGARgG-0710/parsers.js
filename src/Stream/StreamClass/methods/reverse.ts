import type { IReversibleStream } from "src/Stream/interfaces.js"
import { ReversedStream } from "../ReversibleStream/classes.js"

// ! PROBLEM: need to decide whether the final `ReversedStream` should have a `.pos` and `.buffer`;
// ^ SOLUTION:
// 		1. REMOVE `hasBuffer` - if the underlying `.value` ALREADY has a buffer, then it's been fully cached (id est, the `ReversedStream` NOW can simply READ BACKWARDS);
// 			1. IF there is no `.pos` with `.buffer`, then the whole thing has ALREADY been cached, and the buffer (really), is just a REVERSED copy of the current thing:
// 				TODO: add a `.reverse()` method on `IBuffer`;
// 		2. Same thing with `.pos` - if the underlying `.value` ALREADY has a '.pos', just:
// 			1. RECORD the `.pos` at THE END of the stream,
// 			2. define the `.pos` *getter* as the
// 			3. define the `.pos` *setter* as the `this._pos = newPos + 2 * (this._pos - newPos)`
// 				* Reason: for '.pos = .pos + k', it should become '._pos = ._pos - k', and for '.pos = .pos - k' it should become '._pos = ._pos + k'
// 		3. MAKE THE STREAM *USEFUL*: 
// 			1. DO NOT do the `finish(this.value)` thing [like the way it is done now]
// 			2. DO NOT assume that the buffer `.isFrozen`
// 	! 		3. NEED TWO NEW 'IBuffer's - 'TransformBuffer' and 'ConditionBuffer' [internal implementation detail - later: part of `callable`], 
// 			4. [TransformBuffer] This is a kind of `IBuffer` that would: 
// 				1. keep a REFERENCE to a `value` - another `IBuffer`
// 				2. receive items of its 'value' THROUGH AN INDEX-TRANSFORMATION: 
// 					1. .read(i) = this.value.read(this.f(i))
// 					2. .write(i, value) = this.value.write(this.f(i), value)
// 					...etc
// * 			3. the `TransformBuffer` inside `ReversedStream` would have a `LazyBuffer` as its `value`
// 			5. [ConditionBuffer] This is a kind of `IBuffer` that would: 
// 				1. keep a REFERENCE of its `value` - another `IBuffer`
// 				2. receive items of ites `value` PROVIDED THAT A BOUND CONDITION [.cond - bound] HOLDS, *ELSE* return a result of a *CALLBACK* [.prepare - ]: 
// 					1. this.read(i) = { if (this.cond(i)) i = this.prepare(i); return this.value.read(i) }
// 					2. this.write(i, value) = { if (this.cond(i)) i = this.prepare(i); return this.value.write(i, value)}
// 					...etc
// * 		6. THE *condition-callback* pair for the ConditionBuffer is: 'i < 0' [`.value` buffer not long enough], and 'this.value.next(-i)'
// 				TODO: implement the `next/prev(i)` PROPERLY first for this to be workable...; 
// 					! NEED to have it in BOTH `IPrevable` and `IBasicStream`
// 	^ CONCLUSION: first - create the `Stream` interface...
// TODO: need to RE-IMPLEMENT the `ReversedStream`.
// 	* More specifically, it has to be no longer reliant upon the `StreamClass`, INSTEAD implementing the `IReversedStreamClassInstance`
// ! Add the proper `Stream` interface for `StreamClass` to use first, however...
// TODO: add the `reversed` method upon `StreamClassInstance`.
export function reversed<Type = any>(this: IReversibleStream<Type>) {
	return ReversedStream
}
