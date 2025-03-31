import type { IBuffer } from "../../../interfaces.js"
import { TransformBuffer } from "./TransformBuffer.js"

export class ConditionBuffer<Type = any> extends TransformBuffer<Type> {
	protected static toValidIndex<Type = any>(x: ConditionBuffer<Type>, i: number) {
		return x.indexCondition(i) ? x.condTransform(i) : i
	}

	constructor(
		protected readonly indexCondition: (i: number) => boolean,
		protected readonly condTransform: (i: number) => number,
		value: IBuffer<Type>
	) {
		super((i: number) => ConditionBuffer.toValidIndex(this, i), value)
	}
}
