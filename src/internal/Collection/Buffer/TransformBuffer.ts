import type { IBuffer } from "../../../interfaces.js"
import { DelegateBuffer } from "../../delegates/Buffer.js"

export class TransformBuffer<Type = any> extends DelegateBuffer<Type> {
	read(i: number): Type {
		return super.read(this.indexTransform(i))
	}

	write(i: number, value: Type) {
		return super.write(this.indexTransform(i), value)
	}

	constructor(
		protected readonly indexTransform: (i: number) => number,
		value: IBuffer<Type>
	) {
		super(value)
	}
}
