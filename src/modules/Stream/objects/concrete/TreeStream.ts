import { BadIndex } from "../../../../global/constants.js"
import type { INavigable, IWalkable } from "../../../../interfaces.js"
import { TreeWalker } from "../../../../internal/Tree/TreeWalker.js"
import { isGoodIndex } from "../../../../utils.js"
import { treeEndPath } from "../../../../utils/Node.js"
import { SourceStream } from "../templates.js"

enum NextResponse {
	GoFirstNext,
	PushFirstChild,
	GoSiblingAfter
}

enum PrevResponse {
	GoLastPrev,
	PopChild,
	Nil
}

interface IWalkerResponse {
	pick(): void
	respond(): void
}

/**
 * Represents the last level with siblings from a
 * given position inside a tree, during the course
 * of the `.walker` sub-object's work.
 *
 * Can be updated and extracted, intended to be
 * used as shared state.
 */
class LastLevelWithSiblings<
	TreeLike extends IWalkable<TreeLike> = IWalkable
> {
	private level = BadIndex

	get() {
		return this.level
	}

	update() {
		return (this.level = this.walker.lastLevelWithSiblings())
	}

	constructor(private readonly walker: TreeWalker<TreeLike>) {}
}

/**
 * Represents a "response" for a `.next()` operation, sent
 * to the `.walker` sub-object.
 */
class NextWalkerResponse<
	TreeLike extends IWalkable<TreeLike> = IWalkable
> implements IWalkerResponse {
	private response: NextResponse
	private readonly lastLevel: LastLevelWithSiblings<TreeLike>

	pick(): void {
		this.response = this.walker.hasChildren()
			? NextResponse.PushFirstChild
			: this.walker.hasSiblingAfter()
				? NextResponse.GoSiblingAfter
				: NextResponse.GoFirstNext
	}

	respond() {
		switch (this.response) {
			case NextResponse.GoFirstNext:
				this.walker.goFirstNext(this.lastLevel.get() + 1)
				break

			case NextResponse.PushFirstChild:
				this.walker.pushFirstChild()
				break

			case NextResponse.GoSiblingAfter:
				this.walker.goSiblingAfter()
		}
	}

	shallGoFirstNext() {
		return this.response === NextResponse.GoFirstNext
	}

	constructor(private readonly walker: TreeWalker<TreeLike>) {
		this.lastLevel = new LastLevelWithSiblings(this.walker)
	}
}

/**
 * Represents a "response" for a `.prev()` operation, sent
 * to the `.walker` sub-object.
 */
class PrevWalkerResponse<
	TreeLike extends IWalkable<TreeLike> = IWalkable
> implements IWalkerResponse {
	private response: PrevResponse = PrevResponse.Nil

	pick(): void {
		this.response = this.walker.hasSiblingBefore()
			? PrevResponse.GoLastPrev
			: this.walker.hasParent()
				? PrevResponse.PopChild
				: PrevResponse.Nil
	}

	respond(): void {
		switch (this.response) {
			case PrevResponse.GoLastPrev:
				this.walker.goLastPrev()
				break

			case PrevResponse.PopChild:
				this.walker.popChild()
		}
	}

	isNil() {
		return this.response === PrevResponse.Nil
	}

	constructor(private readonly walker: TreeWalker<TreeLike>) {}
}

/**
 * Represents the end-index of a given tree,
 * obtained via `treeEndPath`, and capable of
 * changing the `.curr` of the `.walker` subobject.
 */
class TreeEndIndex<TreeLike extends IWalkable<TreeLike> = IWalkable> {
	private endIndex: number[]

	for(tree: TreeLike) {
		this.endIndex = treeEndPath(tree)
	}

	go() {
		this.walker.goIndex(this.endIndex)
	}

	constructor(private readonly walker: TreeWalker<TreeLike>) {}
}

/**
 * This is a tree-iteration stream, extending `SourceStream`.
 * It accepts a `TreeLike extends IWalkable<TreeLike> = IWalkable` type,
 * which is then walked, with a parent being prioritized over a child,
 * and for all 'i >= 0', 'i'th child being prioritized over 'i + 1'st.
 *
 * Thus, it is an `IStream`-implementation of a DFS algorithm.
 *
 * Every time that the user calls `.next()`, the next node in order is
 * visited. By anticipating the types of nodes (with `.type` of `INode`,
 * for instance), one can predict the structure of the node, and, thus,
 * utilize the `DepthStream` correctly - processing just the right
 * number of items before "falling outside" of a given parent node.
 *
 * It also supports backing up one element (via `.prev()`), and getting the
 * multi-index of the current node in the tree via `.treeIndex: MultiIndex`,
 * as well as navigating to it directly via `.navigate(ind: MultiIndex)`.
 *
 * Similarly, there is a `.finish()` method present, as well as a `.rewind()`
 * method for returning back to the first element in the traversal sequence
 * from the current one.
 */
export class TreeStream<TreeLike extends IWalkable<TreeLike> = IWalkable>
	extends SourceStream<TreeLike, TreeLike>
	implements INavigable<TreeLike, number[]>
{
	private readonly walker: TreeWalker<TreeLike>
	private readonly lastLevel: LastLevelWithSiblings
	private readonly nextResponse: NextWalkerResponse
	private readonly prevResponse: PrevWalkerResponse
	private readonly endIndex: TreeEndIndex

	protected currGetter(): TreeLike {
		return this.walker.curr
	}

	protected override baseNextIter() {
		this.nextResponse.respond()
		return super.baseNextIter()
	}

	private basePrevIter(): TreeLike {
		this.prevResponse.respond()
		return this.currGetter()
	}

	override baseInit(): void {
		this.walker.init(this.source!)
		this.endIndex.for(this.source!)
	}

	get treeIndex() {
		return this.walker.pos.get()
	}

	isCurrEnd(): boolean {
		this.nextResponse.pick()
		return (
			this.nextResponse.shallGoFirstNext() &&
			!isGoodIndex(this.lastLevel.update())
		)
	}

	private isCurrStart(): boolean {
		this.prevResponse.pick()
		return this.prevResponse.isNil()
	}

	rewind() {
		this.walker.restart()
		this.updateCurr()
		this.startStream()
		return this.curr
	}

	navigate(index: readonly number[]) {
		this.walker.goIndex(index)
		this.updateCurr()
		return this.curr
	}

	finish() {
		this.endIndex.go()
		this.updateCurr()
		this.endStream()
		return this.curr
	}

	prev() {
		if (this.isCurrStart()) this.startStream()
		else this.update(this.basePrevIter())
	}

	constructor(source?: TreeLike) {
		super()
		this.walker = new TreeWalker<TreeLike>()
		this.lastLevel = new LastLevelWithSiblings(this.walker)
		this.nextResponse = new NextWalkerResponse(this.walker)
		this.prevResponse = new PrevWalkerResponse(this.walker)
		this.endIndex = new TreeEndIndex(this.walker)
		this.init(source)
	}
}
