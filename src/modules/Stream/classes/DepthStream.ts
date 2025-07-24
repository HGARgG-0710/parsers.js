import { BadIndex } from "../../../constants.js"
import type { IWalkable } from "../../../interfaces.js"
import type { MultiIndex } from "../../../internal/MultiIndex.js"
import { TreeWalker } from "../../../internal/TreeWalker.js"
import { isGoodIndex } from "../../../utils.js"
import { treeEndPath } from "../../../utils/Node.js"
import { SourceStream, SourceStreamAnnotation } from "./SourceStream.js"

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
class LastLevelWithSiblings<TreeLike extends IWalkable<TreeLike> = IWalkable> {
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
class NextWalkerResponse<TreeLike extends IWalkable<TreeLike> = IWalkable>
	implements IWalkerResponse
{
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
class PrevWalkerResponse<TreeLike extends IWalkable<TreeLike> = IWalkable>
	implements IWalkerResponse
{
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

class DepthStreamAnnotation<
	TreeLike extends IWalkable<TreeLike> = IWalkable
> extends SourceStreamAnnotation<TreeLike, TreeLike> {
	protected currGetter(): TreeLike {
		return null as any
	}

	protected baseNextIter() {
		return null as any
	}

	protected basePrevIter(): TreeLike {
		return null as any
	}

	setResource(tree: TreeLike): void {
		return null as any
	}

	get index() {
		return null as any
	}

	isCurrEnd(): boolean {
		return null as any
	}

	isCurrStart(): boolean {
		return null as any
	}

	rewind() {
		return null as any
	}

	goTo(index: MultiIndex) {
		return null as any
	}

	finish() {
		return null as any
	}
}

function BuildDepthStream<TreeLike extends IWalkable<TreeLike> = IWalkable>() {
	return class extends SourceStream.generic!<TreeLike, TreeLike>() {
		private readonly walker = new TreeWalker<TreeLike>()
		private readonly lastLevel = new LastLevelWithSiblings(this.walker)
		private readonly nextResponse = new NextWalkerResponse(this.walker)
		private readonly prevResponse = new PrevWalkerResponse(this.walker)
		private readonly endIndex = new TreeEndIndex(this.walker)

		protected currGetter(): TreeLike {
			return this.walker.curr
		}

		protected baseNextIter() {
			this.nextResponse.respond()
			return this.currGetter()
		}

		protected basePrevIter(): TreeLike {
			this.prevResponse.respond()
			return this.currGetter()
		}

		setResource(tree: TreeLike): void {
			super.setResource(tree)
			this.walker.init(tree)
			this.endIndex.for(tree)
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

		isCurrStart(): boolean {
			this.prevResponse.pick()
			return this.prevResponse.isNil()
		}

		rewind() {
			this.walker.restart()
			this.updateCurr()
			this.startStream()
			return this.curr
		}

		goTo(index: number[]) {
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
	} as unknown as typeof DepthStreamAnnotation<TreeLike>
}

let depthStream: typeof DepthStreamAnnotation | null = null

function PreDepthStream<
	TreeLike extends IWalkable<TreeLike> = IWalkable
>(): typeof DepthStreamAnnotation<TreeLike> {
	return depthStream
		? depthStream
		: (depthStream =
				BuildDepthStream<TreeLike>() as typeof DepthStreamAnnotation)
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
 * It also supports backing up (via `.prev()`), and gettin the
 * multi-index of the current node in the tree via `.treeIndex: MultiIndex`,
 * as well as navigating to it directly via `.goTo(ind: MultiIndex)`.
 * Similarly, there are `.rewind()` and `.finish()` methods present.
 */
export const DepthStream: ReturnType<typeof PreDepthStream> & {
	generic?: typeof PreDepthStream
} = PreDepthStream()

DepthStream.generic = PreDepthStream
