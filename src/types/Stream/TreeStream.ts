import { sequentialIndex, type Summat, type Tree } from "main.js"
import type { CopiableStream } from "./CopiableStream.js"
import type { ReversibleStream } from "./ReversibleStream.js"
import type { RewindableStream } from "./RewindableStream.js"

import { array, object } from "@hgargg-0710/one"
import { Slicer } from "../Slicer.js"
import type { PositionObject } from "./Position.js"
import type { NavigableStream } from "./NavigableStream.js"
import type { PositionalStream } from "./PositionalStream.js"
const { last, clear } = array
const { structCheck } = object

export interface TreeWalker<Type = any> extends Summat {
	multind: number[]
	slicer: Slicer<number[]>
	root: Tree<Type>
	current: Type | Tree<Type>
	level: Tree<Type>
	pushFirstChild(): void
	popChild(): number
	isSiblingAfter(): boolean
	isSiblingBefore(): boolean
	goSiblingAfter(): number
	goSiblingBefore(): number
	indexCut(length: number): void
	isChild(): boolean
	isParent(): boolean
	lastLevelWithSiblings(): number
	currentLastIndex(): number[]
	goPrevLast(): void
	renewLevel(init?: Tree<Type>): void
	restart(): void
	goIndex(multindex: number[]): void
}

export function treeWalkerRenewLevel<Type = any>(
	this: TreeWalker<Type>,
	init: Tree<Type> = this.root
) {
	this.slicer.reSlice(0, this.multind.length - 1)
	this.level = init.index(this.slicer) as Tree<Type>
}

export function treeWalkerPushFirstChild<Type = any>(this: TreeWalker<Type>) {
	this.multind.push(0)
	this.level = this.current as Tree<Type>
	this.current = (this.current as Tree<Type>).index([0])
}
export function treeWalkerPopChild<Type = any>(this: TreeWalker<Type>) {
	const lastIndexed = this.multind.pop()
	this.current = this.level
	this.renewLevel()
	return lastIndexed
}
export function treeWalkerIsSiblingAfter<Type = any>(this: TreeWalker<Type>) {
	return (this.current as Tree<Type>).lastChild > last(this.multind)
}
export function treeWalkerIsSiblingBefore<Type = any>(this: TreeWalker<Type>) {
	return !!last(this.multind)
}
export function treeWalkerGoSiblingAfter<Type = any>(this: TreeWalker<Type>) {
	return ++this.multind[this.multind.length - 1]
}
export function treeWalkerGoSiblingBefore<Type = any>(this: TreeWalker<Type>) {
	return --this.multind[this.multind.length - 1]
}
export function treeWalkerIndexCut<Type = any>(this: TreeWalker<Type>, length: number) {
	this.multind.length = length
	this.renewLevel()
	this.current = this.level.index([last(this.multind)])
}

const childStruct = structCheck("lastChild")
export function treeWalkerCurrentLastIndex<Type = any>(this: TreeWalker<Type>) {
	const lastIndex: number[] = []
	let current = this.current as Tree<Type>
	while (childStruct(current.lastChild) && current.lastChild >= 0) {
		const { lastChild } = current
		lastIndex.push(lastChild)
		current = current.index([lastChild]) as Tree<Type>
	}
	return lastIndex
}
export function treeWalkerIsChild<Type = any>(this: TreeWalker<Type>) {
	return childStruct(this.current) && (this.current as Tree).lastChild >= 0
}

export function treeWalkerIsParent<Type = any>(this: TreeWalker<Type>) {
	return this.current !== this.root
}

export function treeWalkerLastLevelWithSiblings<Type = any>(this: TreeWalker<Type>) {
	this.slicer.reSlice(0, this.multind.length - 1)
	const parents = sequentialIndex(this.root, this.slicer) as Tree[]

	let result = parents.length - 1
	while (result >= 0 && parents[result].lastChild <= this.slicer[result]) --result
	return result
}

export function treeWalkerGoPrevLast<Type = any>(this: TreeWalker<Type>) {
	this.current = this.level.index([this.goSiblingBefore()])
	this.multind.push(...this.currentLastIndex())
	this.renewLevel(this.current as Tree<Type>)
}

export function treeWalkerRestart<Type = any>(this: TreeWalker<Type>) {
	this.current = this.level = this.root
	clear(this.multind)
}

export function treeWalkerGoIndex<Type = any>(
	this: TreeWalker<Type>,
	multindex: number[]
) {
	this.multind = multindex
	this.current = this.root.index(multindex)
	this.renewLevel()
}

// ! LATER, when implementing the 'TreeModifier', one'll NEED A WAY TO NOTIFY THE TreeWalker of CHANGES IN THE 'Tree'!
// ^ idea: use another property 'lastDidUpdate', which will influence the cached-'.lastIndex' re-calculation upon-reading;
export function TreeWalker<Type = any>(
	tree: Tree<Type>,
	multind: number[]
): TreeWalker<Type> {
	return {
		multind,
		slicer: Slicer(multind),
		root: tree,
		level: tree,
		current: tree,
		pushFirstChild: treeWalkerPushFirstChild<Type>,
		popChild: treeWalkerPopChild<Type>,
		isSiblingAfter: treeWalkerIsSiblingAfter<Type>,
		isSiblingBefore: treeWalkerIsSiblingBefore<Type>,
		goSiblingAfter: treeWalkerGoSiblingAfter<Type>,
		goSiblingBefore: treeWalkerGoSiblingBefore<Type>,
		indexCut: treeWalkerIndexCut<Type>,
		isChild: treeWalkerIsChild<Type>,
		isParent: treeWalkerIsParent<Type>,
		lastLevelWithSiblings: treeWalkerLastLevelWithSiblings<Type>,
		currentLastIndex: treeWalkerCurrentLastIndex<Type>,
		goPrevLast: treeWalkerGoPrevLast<Type>,
		renewLevel: treeWalkerRenewLevel<Type>,
		restart: treeWalkerRestart<Type>,
		goIndex: treeWalkerGoIndex<Type>
	}
}

export interface MultiIndex extends PositionObject<number[]> {}

export function multiIndexCompare(this: MultiIndex, position: MultiIndex) {
	const minlen = Math.min(this.value.length, position.value.length)
	for (let i = 0; i < minlen; ++i)
		if (this.value[i] !== position.value[i]) return this.value[i] < position.value[i]
	return this.value.length < position.value.length
}

export function multiIndexEqual(this: MultiIndex, position: MultiIndex) {
	if (this.value.length !== position.value.length) return false
	return this.value.every((x: number, i: number) => x === position.value[i])
}

export function multiIndexCopy(this: MultiIndex) {
	return MultiIndex([...this.value])
}

// ! PROBLEM: the algorithm would involve a lot of COPYING!
// ^ In order to implement it MOST efficiently, one will want to MOVE the '.slicer' from the 'TreeStream' to the 'MultiIndex' (AND ALSO, add an additional property ".slice" to it...); Will be implemented as '.slice(x,y) := this.slicer.reSlice(x, y)';
export function multiIndexConvert(this: MultiIndex, stream: TreeStream) {
	let final = 0
	let current = stream.walker.root
	// ! Need to:
	// * 1. Go to the first (continuously) non-1 index;
	// * 2. From there - get a 'newRoot'; Start continuous indexing from there using it...;
	// * 	2.1. Index RECURSIVELY using a 'counterIterator' on a 'number[]' + 'last' (implement that separately...);
	// * 		2.1.1. The thing is a 'FlexibleCounter', it would depend upon the provided 'lastValue' function which would take in: 
	// 				1. The current index
	// 			and return: 
	// 				1. Whether there is a level update (positive, new level added); 
	// 				2. Whether there is a level update (negatie, popping a? level/-s); 
	// 				^ CONCLUSION [1]: one WILL NEED the access to some of the 'TreeWalker' routines that INVOLVE USING THE 'multindex'; 
	// 				% 1. So, the 'Counter' needs access to SOME [namely, the multind-modification-part] of the functionality the 'stream.walker'; 
	// 				% 2. BUT, for performance+clarity reasons, it's a better idea to SPLIT the 'TreeWalker' into 'MultiIndexModifier', and the 'TreeWalker' itself; 
	// 				% 3. The 'MultiIndexModifier' would, therefore, depend upon the 'MultiIndex'; 
	// 				^ CONLUSION [2]: Create a new MultiIndexModifier interface, that would BE A PART (the '.modifier' property) of the 'MultiIndex'es;
	// 				^ 		Then, the 'TreeWalker' is REWRITTEN to use 'TreeStream' as 'this' instead of a 'tree' as a root (instead the previous 'root' is the 'treeStream.input'),
	// 				^ 			the 'treeStream.pos' is used by the 'TreeWalker' to ALTER THINGS! This (also) eliminates ANY need for manual 'changing' of the '.pos' in the '.navigate' (or, anywhere else...);
	// * 	2.2. For a MOST efficient implementation, '.slicer' should be moved ALL THE WAY THERE! Thus, one has structure: 
	// * 		2.2.1. TreeStream
	// 					|-> TreeWalker <-|
	// 					|-> MultiIndex <-| [The '.slice' method + '.slicer' reference]
	// 						|-> FlexibleCounter  |
	// 							|-> Slicer
	// * 3. Upon indexing a thing 't', add its 't.lastChild' to the 'final'; 
	// ! PROBLEM: there ARE different kinds of 'MultiIndex' Counters! The one in question is for PRE-ORDER TreeStream; 
	// ^ CONCLUSION [3] : one needs to define a 'Counter' SEPARATELY! They are to be '.call()'ed on 'this' of 'MultiIndex', when passed and this will return a thing to be used as a PROPERTY of a 'MultiIndex'; 
}

export function MultiIndex(multindex: number[]): MultiIndex {
	return {
		value: multindex,
		convert: multiIndexConvert,
		compare: multiIndexCompare,
		equal: multiIndexEqual,
		copy: multiIndexCopy
	}
}

export interface TreeStream<Type = any>
	extends RewindableStream<Type | Tree<Type>>,
		ReversibleStream<Type | Tree<Type>>,
		CopiableStream<Type | Tree<Type>>,
		NavigableStream<Type | Tree<Type>>,
		PositionalStream<Type | Tree<Type>, number[]> {
	input: Tree<Type>
	walker: TreeWalker<Type>
}

export function treeStreamNext<Type = any>(this: TreeStream<Type>) {
	const { walker } = this
	const prev = walker.current

	if (!this.isEnd)
		if (walker.isChild()) walker.pushFirstChild()
		else if (walker.isSiblingAfter()) walker.goSiblingAfter()
		else {
			const searchResult = walker.lastLevelWithSiblings()
			if (searchResult < 0) this.isEnd = true
			else {
				walker.indexCut(searchResult + 1)
				walker.goSiblingAfter()
			}
		}

	return prev
}

export function treeStreamPrev<Type = any>(this: TreeStream<Type>) {
	const { walker } = this
	const next = walker.current

	if (this.isEnd) this.isEnd = false
	else if (walker.isSiblingBefore()) walker.goPrevLast()
	else if (walker.isParent()) walker.popChild()

	return next
}

export function treeStreamCurr<Type = any>(this: TreeStream<Type>) {
	return this.walker.current
}
export function treeStreamRewind<Type = any>(this: TreeStream<Type>) {
	this.walker.restart()
	return this.curr()
}
export function treeStreamCopy<Type = any>(this: TreeStream<Type>) {
	const copied = TreeStream(this.input)
	copied.navigate(this.pos)
	return copied
}
export function treeStreamNavigate<Type = any>(
	this: TreeStream<Type>,
	index: MultiIndex
) {
	this.walker.goIndex(index.value)
	this.pos = index
	return this.walker.current
}
export function treeStreamIsStartGetter<Type = any>(this: TreeStream<Type>) {
	return !this.walker.isParent()
}

export function TreeStream<Type = any>(tree: Tree<Type>): TreeStream<Type> {
	const multind: number[] = []
	return Object.defineProperty<
		RewindableStream<Type | Tree<Type>> &
			CopiableStream<Type | Tree<Type>> &
			NavigableStream<Type | Tree<Type>> &
			PositionalStream<Type | Tree<Type>, number[]>
	>(
		{
			input: tree,
			pos: MultiIndex(multind),
			walker: TreeWalker(tree, multind),
			next: treeStreamNext<Type>,
			prev: treeStreamPrev<Type>,
			curr: treeStreamCurr<Type>,
			isEnd: false,
			rewind: treeStreamRewind<Type>,
			copy: treeStreamCopy<Type>,
			navigate: treeStreamNavigate<Type>
		},
		"isStart",
		{ get: treeStreamIsStartGetter<Type> }
	) as TreeStream<Type>
}
