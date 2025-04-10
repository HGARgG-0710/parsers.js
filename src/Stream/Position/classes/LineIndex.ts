import type { ILineIndex } from "../interfaces/LineIndex.js"

import { number } from "@hgargg-0710/one"
const { sum } = number

export class LineIndex implements ILineIndex {
	char = 0
	line = 0

	nextChar() {
		++this.char
	}

	nextLine() {
		++this.line
		this.char = 0
	}
}

export class BackupIndex extends LineIndex {
	protected lengths: number[] = []

	nextLine(): void {
		const { char, lengths, line } = this
		if (lengths.length === line) lengths.push(char)
		super.nextLine()
	}

	prevLine() {
		const { char, lengths, line } = this
		if (char || line) this.char = char ? char - 1 : lengths[--this.line]
	}

	toNumber() {
		return sum(...this.lengths.slice(0, this.line + 1))
	}
}
