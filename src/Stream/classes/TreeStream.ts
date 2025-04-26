import { BadIndex } from "../../constants.js"
import type { IWalkable } from "../../interfaces.js"
import { TreeWalker } from "../../internal/TreeWalker.js"
import { treeEndPath } from "../../Node/utils.js"
import { isGoodIndex } from "../../utils.js"
import { MultiIndex } from "../Position/classes.js"
import { GetterStream } from "./BasicStream.js"

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

export class TreeStream<
	TreeLike extends IWalkable<TreeLike> = IWalkable
> extends GetterStream<TreeLike> {
	["constructor"]: new (resource?: TreeLike) => this

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
	}

	protected basePrevIter(): void | TreeLike {
		const { walker, response } = this
		walker[response as PrevResponseWorkable]()
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

	init(tree: TreeLike) {
		super.init(tree)
		this.walker.init(tree)
		this.endInd = new MultiIndex(treeEndPath(tree))
		return this
	}

	copy() {
		return new this.constructor(this.resource)
	}

	rewind() {
		this.walker.restart()
		this.update()
		this.isStart = true
		return this.curr
	}

	navigate(index: MultiIndex) {
		this.walker.goIndex(index)
		this.update()
		return this.curr
	}

	finish() {
		this.navigate(this.endInd)
		this.isEnd = true
		return this.curr
	}

	constructor(public resource?: TreeLike) {
		super(resource)
	}
}
