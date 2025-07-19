import { type } from "@hgargg-0710/one"
import type { IOwnedStream } from "../../interfaces.js"

const { isNumber } = type

export enum ErrorCode {
	InvalidEscapedChar = -1,
	MissingCharacter = -2
}

export function isError(item: any): item is ErrorCode {
	return isNumber(item) && item < 0
}

export function bail(code: ErrorCode, atPos: number, info: any): never {
	throw pickError(code, atPos, info)
}

// TODO: add a proper choice of error + error-message here (break each one of the choices by individual functions...)
// TODO: ADD WORKING WITH THE `.pos: number` of the underlying `PosStream`! Fundamental to the usability of the library's Regex-grammar...;
function pickError(byCode: ErrorCode, pos: number, info: any): Error {
	return new Error(pickMessage(byCode, pos, info))
}

function pickMessage(code: ErrorCode, pos: number, info: any): string {
	switch (code) {
		case ErrorCode.InvalidEscapedChar:
			return invalidEscapedChar(pos, info)
		case ErrorCode.MissingCharacter:
			return missingCharacter(pos, info)
	}
}

function invalidEscapedChar(pos: number, info: any): string {}

function missingCharacter(pos: number, char: string): string {}

export function expect(char: string) {
	return function (input: IOwnedStream<string>) {
		if (input.curr !== char) bail(ErrorCode.MissingCharacter)
	}
}

export function checkMaybeError(maybeError: any) {
	if (isError(maybeError)) bail(maybeError)
}
