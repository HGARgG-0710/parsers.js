import type { IBufferized, IPattern, IPosed } from "../../../interfaces.js"
import type { IStateful, IStreamClassInstance } from "../interfaces.js"

function copyPos<Type = any>(
	from: IStreamClassInstance<Type> & IPosed<number>,
	copied: IStreamClassInstance<Type> & IPosed<number>
) {
	copied.navigate(from.pos)
	return copied
}

function copy<Type = any>(this: IStreamClassInstance<Type>, ...x: any[]) {
	const copied = new this.constructor()
	copied.init(...x)
	return copied
}

function generateCopyMethods<Type = any>(
	copy: (this: IStreamClassInstance<Type>) => IStreamClassInstance<Type>
) {
	function posCopy(
		this: IStreamClassInstance<Type> & IPosed<number>
	): typeof this {
		return copyPos(this, copy.call(this))
	}

	function bufferCopy(
		this: IStreamClassInstance<Type> & IBufferized<Type>
	): typeof this {
		return copy.call(this, this.buffer)
	}

	function posBufferCopy(
		this: IStreamClassInstance<Type> & IPosed<number> & IBufferized<Type>
	) {
		return copyPos(this, bufferCopy.call(this)) as typeof this
	}

	function stateCopy(
		this: IStreamClassInstance<Type> & IStateful
	): typeof this {
		return copy.call(this, this.state)
	}

	function posStateCopy(
		this: IStreamClassInstance<Type> & IPosed<number> & IStateful
	) {
		return copyPos(this, stateCopy.call(this)) as typeof this
	}

	function bufferStateCopy(
		this: IStreamClassInstance<Type> & IBufferized<Type> & IStateful
	): typeof this {
		return copy.call(this, this.buffer, this.state)
	}

	function posBufferStateCopy(
		this: IStreamClassInstance<Type> &
			IPosed<number> &
			IBufferized<Type> &
			IStateful
	) {
		return copyPos(this, bufferStateCopy.call(this)) as typeof this
	}

	function patternCopy(
		this: IStreamClassInstance<Type> & IPattern
	): typeof this {
		return copy.call(this, this.value)
	}

	function posPatternCopy(
		this: IStreamClassInstance<Type> & IPosed<number> & IPattern
	): typeof this {
		return copyPos(this, patternCopy.call(this))
	}

	function bufferPatternCopy(
		this: IStreamClassInstance<Type> & IBufferized<Type> & IPattern
	): typeof this {
		return copy.call(this, this.value, this.buffer)
	}

	function posBufferPatternCopy(
		this: IStreamClassInstance<Type> &
			IPosed<number> &
			IBufferized<Type> &
			IPattern
	) {
		return copyPos(this, bufferPatternCopy.call(this)) as typeof this
	}

	function statePatternCopy(
		this: IStreamClassInstance<Type> & IStateful & IPattern
	): typeof this {
		return copy.call(this.value, this.state)
	}

	function posStatePatternCopy(
		this: IStreamClassInstance<Type> & IPosed<number> & IStateful & IPattern
	) {
		return copyPos(this, statePatternCopy.call(this)) as typeof this
	}

	function bufferStatePatternCopy(
		this: IStreamClassInstance<Type> &
			IBufferized<Type> &
			IStateful &
			IPattern
	) {
		return copy.call(
			this,
			this.value,
			this.buffer,
			this.state
		) as typeof this
	}

	function posBufferStatePatternCopy(
		this: IStreamClassInstance<Type> &
			IPosed<number> &
			IBufferized<Type> &
			IStateful &
			IPattern
	) {
		return copyPos(this, bufferStatePatternCopy.call(this)) as typeof this
	}

	return [
		// * 0
		copy,

		// * 1 << 0, + 1, '.pos'
		posCopy,

		// * 1 << 1, + 2, '.buffer'
		bufferCopy,
		posBufferCopy,

		// * 1 << 2, + 4, '.state'
		stateCopy,
		posStateCopy,
		bufferStateCopy,
		posBufferStateCopy,

		// * 1 << 3, + 8, '.pattern'
		patternCopy,
		posPatternCopy,
		bufferPatternCopy,
		posBufferPatternCopy,
		statePatternCopy,
		posStatePatternCopy,
		bufferStatePatternCopy,
		posBufferStatePatternCopy
	]
}

const methodList = generateCopyMethods(copy)

export function chooseMethod(
	hasPosition: boolean = false,
	hasBuffer: boolean = false,
	hasState: boolean = false,
	isPattern: boolean = false
) {
	return methodList[
		+hasPosition | (+hasBuffer << 1) | (+hasState << 2) | (+isPattern << 3)
	]
}
