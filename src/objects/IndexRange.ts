import type { IIndexLike, IIndexLikeObject } from "../interfaces.js"

// ! PRE-DOC [important]: this thing is NOT intended to be used as part of parsing
// 		errors! (reason being, it's unreasonably more difficult, and thus simply not
// 		worth it) Instead, it's supposed to be employed as part of the POST-PARSING
// 		processes, such as compilation/validation/type-checking/etc. Then, for
// 		instance the validator/whatever can USE the FROM-TO pairs as debug information
// 		during the event of logical/semantic error (for instance: 1. trying to access a
// 		non-existent type - give the TO-FROM ranges of the NAME of the non-existent
// 		type; 2. trying to pass an wrong argument signature to a method/function over
// 		multiple lines? give the TO-FROM range, where the call begins and ends; ETC).
//
// 		During parsing it may not even make sense sometimes, since the syntax tree is
// 		not even guaranteed to be correct to begin with [the user had not yet called
// 		.scanFor(EitherType(Err1Node, Err2Node, ...)), and therfore doesn't know if the
// 		tree is complete with the respective range indexes].
//
// 		However, if the user is accessing said the NodeData-s on INode-s created, then
// 		one can reasonably expect that the tree is correct after all, and now a more
// 		complex verification is in progress already.
//
// 		It is, therefore, recommended to put this information onto nodes created
// 		during parsing via the '.setData(...)' calls, but NOT to use it as a diagnostic
// 		tool (for better reliability, use plain `LineIndex`, `PanicStream` children,
// 		etc INSTEAD).
//
// 		Vital - this notice is to be added to the documentation.
export class IndexRange<T extends IIndexLike> implements IIndexLikeObject {
	valueOf(): number {
		return this.to.valueOf() - this.from.valueOf()
	}

	toString() {
		return `${String(this.from)}-${String(this.to)}`
	}

	constructor(
		readonly from: T,
		readonly to: T,
	) {}
}
