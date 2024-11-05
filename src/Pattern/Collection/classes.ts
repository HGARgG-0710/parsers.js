import { BasicPattern } from "../classes.js"
import type { Pattern } from "../interfaces.js"
import type { Collection } from "./interfaces.js"
import {
	stringCollectionPush,
	collectionIterator,
	accumulatingPatternCollectionPush,
	accumulatingPatternCollectionIterator
} from "./methods.js"

import { SelfAssignmentClass } from "../../utils.js"

export class StringCollection extends BasicPattern<string> implements Collection<string> {
	push: (...x: string[]) => Collection<string>;
	[Symbol.iterator]: () => Generator<string>

	constructor(string: string) {
		super(string)
	}
}

Object.defineProperties(StringCollection.prototype, {
	push: { value: stringCollectionPush },
	[Symbol.iterator]: { value: collectionIterator }
})

export const ArrayCollection = SelfAssignmentClass<any[], Collection>("value", []) as <
	Type = any
>(
	x?: Type[]
) => Collection<Type>

export class AccumulatingPatternCollection
	extends BasicPattern<Pattern>
	implements Collection<Pattern>
{
	push: (...x: Pattern<any>[]) => Collection<Pattern>;
	[Symbol.iterator]: () => Generator<Pattern>

	constructor(pattern: Pattern) {
		super(pattern)
	}
}

Object.defineProperties(AccumulatingPatternCollection.prototype, {
	push: { value: accumulatingPatternCollectionPush },
	[Symbol.iterator]: { value: accumulatingPatternCollectionIterator }
})

export * as Buffer from "./Buffer/classes.js"
