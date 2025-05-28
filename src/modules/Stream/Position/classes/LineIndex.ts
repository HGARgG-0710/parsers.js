import { array, number } from "@hgargg-0710/one"
import type { ILineIndex } from "../interfaces/LineIndex.js"

const { sum } = number

export class LineIndex implements ILineIndex {
	["constructor"]: new () => this

	private _char = 0
	private _line = 0

	protected set char(newChar: number) {
		this._char = newChar
	}

	protected set line(newLine: number) {
		this._line = newLine
	}

	get line() {
		return this._line
	}

	get char() {
		return this._char
	}

	nextChar() {
		++this.char
	}

	nextLine() {
		++this.line
		this.char = 0
	}

	copy() {
		const lineIndex = new this.constructor()
		lineIndex.char = this.char
		lineIndex.line = this.line
		return lineIndex
	}
}

export class BackupIndex extends LineIndex {
	private lengths: number[] = []

	private isFirstLine() {
		return this.line === 0
	}

	private isLineStart() {
		return this.char === 0
	}

	nextLine(): void {
		const { char, lengths, line } = this
		if (lengths.length === line) lengths.push(char)
		super.nextLine()
	}

	prevLine() {
		const { char, lengths } = this
		if (!this.isLineStart() || !this.isFirstLine())
			this.char = this.isLineStart() ? lengths[--this.line] : char - 1
	}

	toNumber() {
		return sum(...this.lengths.slice(0, this.line + 1))
	}

	copy() {
		const backupIndex = super.copy()
		backupIndex.lengths = array.copy(this.lengths)
		return backupIndex
	}
}
