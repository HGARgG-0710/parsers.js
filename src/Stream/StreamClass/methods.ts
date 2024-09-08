import type {
	BoundNameType,
	BaseIterPropNameType,
	IterCheckPropNameType,
	StreamClassInstance
} from "./interfaces.js"

export function iterationHandler(
	boundName: BoundNameType,
	otherEnd: BoundNameType,
	baseIterPropName: BaseIterPropNameType,
	iterCheckPropName: IterCheckPropNameType
) {
	return function <Type = any>(this: StreamClassInstance<Type>) {
		const last = this.curr
		this[otherEnd] = false
		const lastEnd = (this[iterCheckPropName] as () => boolean)()
		if (!lastEnd) this.curr = (this[baseIterPropName] as () => Type)()
		this[boundName] = lastEnd && (this[iterCheckPropName] as () => boolean)()
		return last
	}
}

export function currSetter<Type = any>(this: StreamClassInstance<Type>, value: Type) {
	return (this.realCurr = value)
}

export function baseCurr<Type = any>(this: StreamClassInstance<Type>) {
	if (this.isStart === PRE_CURR_INIT) {
		this.isStart = POST_CURR_INIT
		return (this.realCurr = this.initGetter.call(this))
	}
	return this.currGetter && !this.isStart
		? (this.realCurr = this.currGetter.call(this))
		: this.realCurr
}

export const PRE_CURR_INIT = 1
export const POST_CURR_INIT = true
export const POST_START = false

export const nextHandler = iterationHandler(
	"isEnd",
	"isStart",
	"baseNextIter",
	"isCurrEnd"
)

export const prevHandler = iterationHandler(
	"isStart",
	"isEnd",
	"basePrevIter",
	"isCurrStart"
)
