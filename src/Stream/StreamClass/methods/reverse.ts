import type { IReversibleStream } from "src/Stream/interfaces.js"
import { ReversedStream } from "../ReversedStream/classes.js"

// TODO: re-do the `ReversedStream`: 
// * 1. make no longer a `StreamClass`
// * 2. remove flags from it : 
// 		1. replace with dynamically bound methods/accessors: 
// 			1. verify property presence: 
// 				1. check for `.pos` presence upon given instance ('isPosed')
// 				2. check for `.buffer` presence upon given instance ('isBufferized')
// 			2. assign (if present): 
// 				1. '.pos': 
// 					1. getter definition - 'this._lastPos - this._pos' [note: this._lastPos is RE-DEFINED each time that `.prev()` is called on this, as `this.value.pos`]
// 					2. setter definition - 'this._pos = newPos + 2 * (this._pos - newPos)' [this.pos += k -> this._pos -= k; this.pos -= k -> this._pos += k]
// 				2. '.buffer': 
// 					1. TransformBuffer -> ConditionBuffer -> this.value.buffer
// * 					1. (transformation[1] - 'this._lastPos - i'); (condition - 'i < 0'; transformation[2] - 'this.prev(-i); return 0')
//  TODO[3]:			2. add the `.next/.prev(i)` for `Stream`, and `StreamClass`, and `ReversedStream`; 
//  TODO[1]: 		2. Define the [eager - triggers a '.rewind()' on the `IReversedStream`] `.buffer.get()` as `this.buffer.reverse().get()`: 
// 	TODO[2]:			1. new abstraction 'ReversedBuffer' - delegates all calls to `this.value, BUT, ends up reversing the buffer upon call to ".get()"`; 
//  * 					2. Likewise, 'ReversedBuffer' is THE 'TransformBuffer -> ConditionBuffer -> this.value.buffer' thing, so one adds the modified `.get()` on it as well
// * 3. method definitions: 
// ! think about:		1. isCurrEnd, isCurrStart, next, prev
// ?						1. just copy the `StreamClass.prototype.next/prev` definitions? 
// ? think about:		2. should this be an `IReversedStreamClassInstance`?
export function reverse<Type = any>(this: IReversibleStream<Type>) {
	return ReversedStream
}
