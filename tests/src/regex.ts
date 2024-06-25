// * tests of the 'regex' module
import {
	Boundry,
	and,
	anything,
	backrefIndex,
	backrefName,
	begin,
	boundry,
	capture,
	caret,
	caseInsensitive,
	charClass,
	cr,
	digit,
	dotAll,
	end,
	form,
	global,
	hex,
	lookbehind,
	maybe,
	multline,
	namedCapture,
	negCharClass,
	newline,
	nil,
	nlookahead,
	nlookbehind,
	nogreedy,
	nonCapture,
	nonDigit,
	nonSpace,
	nonWord,
	occurences,
	or,
	plookahead,
	plus,
	space,
	star,
	sticky,
	subInd,
	tab,
	uniAware,
	uniEsc,
	uniEscNon,
	unicode,
	unicodeSets,
	utf16,
	vtab,
	word
} from "../../dist/src/regex.js"

const r1 = /a|b/g
;[capture, nonCapture, namedCapture("CAPTURE")].forEach((x) => console.log(x(r1)))
console.log()

const rarr = [/S|T/, /[a-z]|(?:\w+)/, /9*92?/]
;[and, or].forEach((x) => console.log(x(...rarr)))

const r2 = /77?0*/
;[
	global,
	unicode,
	subInd,
	caseInsensitive,
	multline,
	unicodeSets,
	dotAll,
	sticky
].forEach((x) => console.log(x(r2)))
console.log(sticky(dotAll(r2)))
console.log()
;[[1], [20, 39], [0, ""]].forEach((x: [number, (number | string)?]) =>
	console.log(occurences(...x)(r2))
)
console.log()
;[begin, end].forEach((x) => console.log(x(r2)))
console.log()
;[plookahead, nlookahead, lookbehind, nlookbehind].forEach((x) => console.log(x(r2)))
console.log()
;[boundry, Boundry].forEach((x) => console.log(x()))
console.log()
const charClassTest = [["a", "x"], ["9"], ["7"], ["-"]] as [string, string?][]
;[charClass, negCharClass].forEach((x) => console.log(x(...charClassTest)))
console.log()
;[digit, nonDigit, word, nonWord, space, nonSpace].forEach((x) => console.log(x()))
console.log()
;[anything, tab, cr, newline, vtab, form, nil].forEach((x) => console.log(x()))
console.log()

const codes = ["8", "72", "3310"]
;[caret, hex, utf16].forEach((x, i) => console.log(x(codes[i])()))
console.log()
;[plus, star, maybe].forEach((x) => console.log(x(r2)))
console.log()

console.log(uniAware("77")())
console.log()

const props = ["Letter", ["Script", "Greek"]] as (string | [string, string])[]
;[uniEsc, uniEscNon].forEach((x) => {
	props.forEach((y) => console.log(unicodeSets(x(y)())))
	console.log()
})
console.log()

console.log(backrefName("A")())
console.log(backrefIndex(2)())
console.log()

console.log(nogreedy(plus(r1)))
