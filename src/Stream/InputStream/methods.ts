import type { IInputStream } from "./interfaces.js"

export namespace methods {
	export function isCurrEnd<Type = any>(this: IInputStream<Type>) {
		return this.pos >= this.buffer.size - 1
	}

	export const baseNextIter = currGetter
	export const basePrevIter = currGetter

	export function currGetter<Type = any>(this: IInputStream<Type>) {
		return this.buffer.read(this.pos)
	}

	export function isCurrStart<Type = any>(this: IInputStream<Type>) {
		return !this.pos
	}

	export function defaultIsEnd<Type = any>(this: IInputStream<Type>) {
		return !this.buffer.size
	}
}
