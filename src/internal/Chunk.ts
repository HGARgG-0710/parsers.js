/**
 * This is a namnespace containing information pertaining to
 * the lazy reading of file chunks.
 */
export namespace Chunk {
	// Getting the file contents in 4KB chunks for the sake of performance.
	export const size = 4096

	export function chunkStartOf(bytePos: BytePos) {
		return bytePos.getChunk() * Chunk.size
	}

	/**
	 * Represents a byte position inside a file,
	 * provides appropriate operations.
	 */

	export class BytePos {
		private pos: number

		static at(pos: number): BytePos {
			const bytePos = new BytePos()
			bytePos.pos = pos
			return bytePos
		}

		forward() {
			++this.pos
		}

		get() {
			return this.pos
		}

		getChunk() {
			return Math.floor(this.pos / Chunk.size)
		}

		getOffset() {
			return this.pos % Chunk.size
		}

		isSamePage(bytePos: BytePos) {
			return this.getChunk() === bytePos.getChunk()
		}

		go(bytePos: BytePos) {
			this.pos = bytePos.pos
		}

		isAfter(bytePos: BytePos) {
			return bytePos.pos <= this.pos
		}

		constructor(isPreStart: boolean = false) {
			this.pos = isPreStart ? -1 : 0
		}
	}
}
