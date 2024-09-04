import type {
	BoundNameType,
	BaseIterPropNameType,
	IterCheckPropNameType
} from "./interfaces.js"
import type { PreBasicStream } from "../PreBasicStream/interfaces.js"

export function iterationHandler(
	boundName: BoundNameType,
	baseIterPropName: BaseIterPropNameType,
	iterCheckPropName: IterCheckPropNameType
) {
	return function <Type = any>(this: PreBasicStream<Type>) {
		const last = this.curr
		const lastEnd = this[iterCheckPropName]()
		if (!lastEnd) this.curr = this[baseIterPropName]()
		this[boundName] = lastEnd && this[iterCheckPropName]()
		return last
	}
}

export function currSetter(value: any) {
	return (this.realCurr = value)
}
