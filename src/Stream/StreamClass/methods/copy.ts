import type { IBufferized, IPattern, IPosed } from "../../../interfaces.js"
import type { IStreamClassInstanceImpl } from "../refactor.js"
import type { IStateful } from "src/interfaces.js"

import { BitHash } from "../../../HashMap/classes.js"
import { ArrayInternal } from "../../../HashMap/InternalHash/classes.js"

function copyPos<Type = any>(
	from: IStreamClassInstanceImpl<Type> & IPosed<number>,
	copied: IStreamClassInstanceImpl<Type> & IPosed<number>
) {
	copied.pos = from.pos
	return copied
}

function copy<Type = any>(this: IStreamClassInstanceImpl<Type>, ...x: any[]) {
	const copied = new this.constructor()
	copied.init(...x)
	return copied
}

function generateCopyMethods<Type = any>(
	copy: (
		this: IStreamClassInstanceImpl<Type>
	) => IStreamClassInstanceImpl<Type>
) {
	function posCopy(
		this: IStreamClassInstanceImpl<Type> & IPosed<number>
	): typeof this {
		return copyPos(this, copy.call(this))
	}

	function bufferCopy(
		this: IStreamClassInstanceImpl<Type> & IBufferized<Type>
	): typeof this {
		return copy.call(this, this.buffer)
	}

	function posBufferCopy(
		this: IStreamClassInstanceImpl<Type> &
			IPosed<number> &
			IBufferized<Type>
	) {
		return copyPos(this, copy.call(this, this.buffer.copy())) as typeof this
	}

	function stateCopy(
		this: IStreamClassInstanceImpl<Type> & IStateful
	): typeof this {
		return copy.call(this, this.state)
	}

	function posStateCopy(
		this: IStreamClassInstanceImpl<Type> & IPosed<number> & IStateful
	) {
		return copyPos(this, stateCopy.call(this)) as typeof this
	}

	function bufferStateCopy(
		this: IStreamClassInstanceImpl<Type> & IBufferized<Type> & IStateful
	): typeof this {
		return copy.call(this, this.buffer, this.state)
	}

	function posBufferStateCopy(
		this: IStreamClassInstanceImpl<Type> &
			IPosed<number> &
			IBufferized<Type> &
			IStateful
	) {
		return copyPos(
			this,
			copy.call(this, this.buffer.copy(), this.state)
		) as typeof this
	}

	function patternCopy(this: IStreamClassInstanceImpl<Type>): typeof this {
		return copy.call(this, this.value.copy())
	}

	function posPatternCopy(
		this: IStreamClassInstanceImpl<Type> & IPosed<number>
	): typeof this {
		return copyPos(this, patternCopy.call(this))
	}

	function bufferPatternCopy(
		this: IStreamClassInstanceImpl<Type> & IBufferized<Type>
	): typeof this {
		return copy.call(this, this.value.copy(), this.buffer)
	}

	function posBufferPatternCopy(
		this: IStreamClassInstanceImpl<Type> &
			IPosed<number> &
			IBufferized<Type>
	) {
		return copyPos(
			this,
			copy.call(this, this.value.copy(), this.buffer.copy())
		) as typeof this
	}

	function statePatternCopy(
		this: IStreamClassInstanceImpl<Type> & IStateful
	): typeof this {
		return copy.call(this.value.copy(), this.state)
	}

	function posStatePatternCopy(
		this: IStreamClassInstanceImpl<Type> & IPosed<number> & IStateful
	) {
		return copyPos(this, statePatternCopy.call(this)) as typeof this
	}

	function bufferStatePatternCopy(
		this: IStreamClassInstanceImpl<Type> &
			IBufferized<Type> &
			IStateful &
			IPattern
	) {
		return copy.call(
			this,
			this.value.copy(),
			this.buffer,
			this.state
		) as typeof this
	}

	function posBufferStatePatternCopy(
		this: IStreamClassInstanceImpl<Type> &
			IPosed<number> &
			IBufferized<Type> &
			IStateful &
			IPattern
	) {
		return copyPos(
			this,
			copy.call(this, this.value.copy(), this.buffer.copy(), this.state)
		) as typeof this
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

const MethodHash = new BitHash(new ArrayInternal(generateCopyMethods(copy)))

export function chooseMethod(
	hasPosition = false,
	hasBuffer = false,
	hasState = false,
	isPattern = false
): () => IStreamClassInstanceImpl {
	return MethodHash.index([hasPosition, hasBuffer, hasState, isPattern])
}
