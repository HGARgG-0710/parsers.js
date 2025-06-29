import { array, number } from "@hgargg-0710/one"
import assert from "node:assert"
import type { ICopiable, IInitializable } from "../../../interfaces.js"
import type { ILineIndex } from "../interfaces/LineIndex.js"

const { sum } = number

/**
 * This is a class implementing the `ILineIndex` interface.
 * It represents a pair of indexes, by which characters inside
 * a string can be located - character number and line number.
 *
 * It does not allow for backward iteration.
 */
export class LineIndex implements ILineIndex {
	protected ["constructor"]: new (line?: number, char?: number) => this

	private _char: number
	private _line: number

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
		return new this.constructor(this.line, this.char)
	}

	constructor(line: number = 0, char: number = 0) {
		this.line = line
		this.char = char
	}
}

/**
 * This is a class for keeping track of `lengths: number[]`,
 * employed by the `BackupIndex` objects to share common
 * knowledge about a certain source's lines' lengths.
 * Essential for implementing the backing-up algorithm
 * inside the `.prevChar()` correctly.
 *
 * Permits modification. Injected by the user.
 *
 * Note: the class, in fact, does not actually contain
 * line lengths, but the last acceptable `.char` values.
 * This is done for the purpose of keeping and additional
 */
export class LineLengths implements ICopiable {
	private ["constructor"]: new (lengths?: number[]) => this

	private nextLength: number = 0

	private get size() {
		return this.lengths.length
	}

	private resetNext() {
		this.setNext(0)
	}

	private setNext(newLength: number) {
		this.nextLength = newLength
	}

	updateNext(newLength: number) {
		if (newLength > this.nextLength) this.setNext(newLength)
	}

	confirmNext() {
		this.lengths.push(this.nextLength)
		this.resetNext()
	}

	get(ofLine: number) {
		return this.lengths[ofLine]
	}

	slice(upTo: number) {
		return this.lengths.slice(0, upTo)
	}

	isExcess(index: number) {
		return this.size < index
	}

	isNew(index: number) {
		return this.size === index
	}

	isKnown(index: number) {
		return !this.isExcess(index) && !this.isNew(index)
	}

	isAcceptable(atLine: number, char: number) {
		return char <= this.get(atLine)
	}

	copy() {
		const copied = new this.constructor(array.copy(this.lengths))
		copied.updateNext(this.nextLength)
		return copied
	}

	constructor(private readonly lengths: number[] = []) {}
}

function assertSizeSufficient(lineIndex: ILineIndex, lengths: LineLengths) {
	assert(!lengths.isExcess(lineIndex.line))
}

function isNewLine(lineIndex: ILineIndex, lengths: LineLengths) {
	return lengths.isNew(lineIndex.line)
}

function isAcceptableChar(lineIndex: ILineIndex, lengths: LineLengths) {
	return lengths.isAcceptable(lineIndex.line, lineIndex.char)
}

/**
 * This is a class implementing the `ILineIndex` interface.
 * It represents a pair of indexes, by which characters inside
 * a string can be located - character number and line number.
 *
 * It allows for backward iteration. It also allows one to
 * convert the index in question to `number` via the
 * `toNumber()` method, as well as directly modifying
 * the `.line` and `.char` to that of another `ILineIndex`
 * object via the `.from` method (provided that it is
 * not too far out of the range of the underlying `LineLengths`).
 *
 * It is also an `IInitializable<[LineLenghts]>`.
 * Requires a `LineLengths` object injected via
 * `.init(lineLengths: LineLengths)` to operate
 * successfully.
 */
export class BackupIndex
	extends LineIndex
	implements IInitializable<[LineLengths]>
{
	private lengths: LineLengths

	private isFirstLine() {
		return this.line === 0
	}

	private isLineStart() {
		return this.char === 0
	}

	private prevLineEndChar() {
		--this.line
		return this.lengths.get(this.line)
	}

	private sameLinePrevChar() {
		return this.char - 1
	}

	private isNewLine() {
		return isNewLine(this, this.lengths)
	}

	private addNewLine() {
		this.lengths.confirmNext()
	}

	private isSameLineAcceptable() {
		return this.lengths.isAcceptable(this.line, this.char + 1)
	}

	private isCharOnEdge() {
		return !this.isNewLine() && !this.isSameLineAcceptable()
	}

	private assertLengthsSufficient(lineLengths: LineLengths) {
		assertSizeSufficient(this, lineLengths)
	}

	private assertIndexAcceptable(lineIndex: ILineIndex) {
		assertSizeSufficient(lineIndex, this.lengths)
		if (!isNewLine(lineIndex, this.lengths))
			assert(isAcceptableChar(lineIndex, this.lengths))
	}

	private updateChar() {
		if (this.isNewLine()) this.lengths.updateNext(this.char)
	}

	private nextCharDefault() {
		super.nextChar()
		this.updateChar()
	}

	nextChar(): void {
		if (this.isCharOnEdge()) super.nextLine()
		else this.nextCharDefault()
	}

	nextLine(): void {
		if (this.isNewLine()) this.addNewLine()
		super.nextLine()
	}

	prevChar() {
		if (!this.isLineStart() || !this.isFirstLine())
			this.char = this.isLineStart()
				? this.prevLineEndChar()
				: this.sameLinePrevChar()
	}

	toNumber() {
		return this.line + 1 + sum(...this.lengths.slice(this.line)) + this.char
	}

	init(lineLengths: LineLengths) {
		this.assertLengthsSufficient(lineLengths)
		this.lengths = lineLengths
		return this
	}

	from(lineIndex: ILineIndex) {
		this.assertIndexAcceptable(lineIndex)
		this.line = lineIndex.line
		this.char = lineIndex.char
		this.updateChar()
		return this
	}

	copy() {
		return super.copy().init(this.lengths)
	}
}
