import { BadIndex } from "../../../constants.js"
import type { IWalkable } from "../../../interfaces.js"
import { TreeWalker } from "../../../internal/TreeWalker.js"
import { isGoodIndex } from "../../../utils.js"
import { treeEndPath } from "../../../utils/Node.js"
import { SourceStream } from "./BasicStream.js"
import { MultiIndex } from "./Position.js"

type PrevResponseWorkable = typeof GO_PREV_LAST | typeof POP_CHILD
type PrevResponse = PrevResponseWorkable | null

type NextResponse =
	| typeof GO_NEXT_FIRST
	| typeof PUSH_FIRST_CHILD
	| typeof GO_SIBLING_AFTER

type ResponseMethodName = PrevResponse | NextResponse

const GO_PREV_LAST = "goPrevLast"
const POP_CHILD = "popChild"

const GO_NEXT_FIRST = "goNextFirst"
const PUSH_FIRST_CHILD = "pushFirstChild"
const GO_SIBLING_AFTER = "goSiblingAfter"

export class DepthStream<
	TreeLike extends IWalkable<TreeLike> = IWalkable
> extends SourceStream<TreeLike, TreeLike> {
	protected ["constructor"]: new (source?: TreeLike) => this

	private endInd: MultiIndex
	private response: ResponseMethodName
	private lastLevelWithSiblings = BadIndex
	private walker = new TreeWalker<TreeLike>()

	private pickResponseNext() {
		const { walker } = this
		this.response = walker.hasChildren()
			? PUSH_FIRST_CHILD
			: walker.hasSiblingAfter()
			? GO_SIBLING_AFTER
			: GO_NEXT_FIRST
	}

	private pickResponsePrev() {
		const { walker } = this
		this.response = walker.hasSiblingBefore()
			? GO_PREV_LAST
			: walker.hasParent()
			? POP_CHILD
			: null
	}

	private getLastLevelWithSiblings() {
		return (this.lastLevelWithSiblings =
			this.walker.lastLevelWithSiblings())
	}

	protected currGetter(): TreeLike {
		return this.walker.curr
	}

	protected baseNextIter() {
		const { walker, response } = this
		walker[response as NextResponse](this.lastLevelWithSiblings + 1)
		return this.currGetter()
	}

	protected basePrevIter(): TreeLike {
		const { walker, response } = this
		walker[response as PrevResponseWorkable]()
		return this.currGetter()
	}

	setResource(tree: TreeLike): void {
		super.setResource(tree)
		this.walker.init(tree)
		this.endInd = new MultiIndex(treeEndPath(tree))
	}

	get index() {
		return this.walker.pos
	}

	isCurrEnd(): boolean {
		this.pickResponseNext()
		return (
			this.response === GO_NEXT_FIRST &&
			!isGoodIndex(this.getLastLevelWithSiblings())
		)
	}

	isCurrStart(): boolean {
		this.pickResponsePrev()
		return this.response === null
	}

	rewind() {
		this.walker.restart()
		this.updateCurr()
		this.startStream()
		return this.curr
	}

	navigate(index: MultiIndex) {
		this.walker.goIndex(index)
		this.updateCurr()
		return this.curr
	}

	finish() {
		this.navigate(this.endInd)
		this.endStream()
		return this.curr
	}
}
