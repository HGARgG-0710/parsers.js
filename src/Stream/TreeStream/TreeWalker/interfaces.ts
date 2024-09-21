import type { Summat } from "@hgargg-0710/summat.ts"
import type { Tree } from "src/Tree/interfaces.js"
import type { EffectiveTreeStream } from "../interfaces.js"

export interface TreeWalker<Type = any> extends Summat {
	stream: EffectiveTreeStream<Type>
	level: Tree<Type>
	pushFirstChild(): void
	popChild(): number[]
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
	goIndex(): void
}
