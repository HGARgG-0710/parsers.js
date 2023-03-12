// TODO: whenever functions are concerned, pray do add capability to add as many arguments as he the self wants...
// TODO: Create some of the wanted elementary functions that self would consider useful in building a parser (that is, to maximize the optimization of the routine repetition of various naturally ocurring parsing procedures)...
// TODO: let the things that are `start`, `stop` and `separator` be more general: don't have to be `string`, anything else...

// TODO: Creepy arguments names... Do something about them...
// TODO: the "noStartSym" argument feels kind of obsolete... Should self not do something about it?.. Instead using a flag for this sort of thing? At the same time... This may be more useful for the UtilFunctions... Though, it can work both ways...
export function delimited<StringType = string>(
	start: StringType[],
	stop: StringType[],
	separator: StringType[],
	noStartSym: StringType,
	noStopSym: StringType,
	parser: Function,
	shouldSkipStop: boolean | Function = true,
	noticeFunc: Function,
	nextFunc: Function,
	skip: (toSkip: StringType, noticeFunction?: Function) => any,
	endFunc: (...a: any) => boolean,
	startCallback: Function = () => {
		return undefined
	},
	endCallback: Function = () => {
		return undefined
	},
	outputFunction: (beginVal: any, endVal: any, delimitedRes: any[]) => any
) {
	// ? generalize?
	function skipSeparators(separator: StringType) {
		skip(separator, noticeFunc)
		skipMultiple<StringType>(separator, nextFunc, noticeFunc)
	}

	const tocall_end = () => {
		let i = 1
		for (const s of stop) {
			if (noticeFunc(s)) return i
			i++
		}
		return false
	}

	const delimitedArr: any[] = []
	let first = true

	const stopOnSeparator = stop.includes(noStopSym)
	let startVal = undefined
	let endVal: any

	// allowing for multiple starts (here, the starts are skipped "-or"-way, not "-and"-way; i.e. if more than one are found, then only the first one is read...)
	// ? why, by the way? Should he the body not make it a flag?
	if (!start.includes(noStartSym))
		if (start instanceof Array) {
			let i = 0

			for (const _start of start) {
				if (noticeFunc(_start)) {
					startVal = startCallback()
					nextFunc()
					break
				}

				if (i === start.length - 1) {
					startVal = startCallback()
					skip(_start, noticeFunc)
				}
				i++
			}
		}

	// ? this "skip the separators before the actual beginning" should be turnable on/off by a flag too...
	// TODO: do along with the other questions...
	for (const a of separator) skipMultiple<StringType>(a, nextFunc, noticeFunc)

	while (!endFunc()) {
		if (!stopOnSeparator && tocall_end()) {
			endVal = endCallback()
			break
		}

		if (first) first = false
		else {
			if (!stopOnSeparator) {
				let j = 0

				for (const sep of separator) {
					if (noticeFunc(sep)) {
						skipSeparators(sep)
						break
					}

					if (j === separator.length - 1) skipSeparators(sep)
					j++
				}
			} else if (separator instanceof Array) {
				let leave = false

				for (const s of separator)
					if (noticeFunc(s)) {
						leave = true
						break
					}

				if (!leave) break
			} else if (!noticeFunc(separator)) break
		}

		if (!stopOnSeparator && tocall_end()) {
			endVal = endCallback()
			break
		}
		delimitedArr.push(parser())
	}

	// * the success index is always +1 from the true one. That is to avoid situations with Boolean(0) = false...
	const tocallendres = tocall_end()

	if (typeof shouldSkipStop === "function") shouldSkipStop = shouldSkipStop()
	if (!stopOnSeparator && tocallendres && shouldSkipStop)
		skip(stop[(tocallendres as number) - 1], noticeFunc)

	return outputFunction(startVal, endVal, delimitedArr)
}

function skipMultiple<StringType>(
	char: StringType,
	nextFunction: Function,
	spotFunction: Function
) {
	while (spotFunction(char)) nextFunction()
}

export function readWhilst<StringType = string>(
	predicate: Function,
	currentFunction: Function,
	nextFunction: Function,
	appendFunction: Function,
	endFunc: () => boolean,
	emptyValue: StringType,
	finale?: Function,
	skipFirst = false
) {
	let res: StringType = skipFirst ? emptyValue : currentFunction()
	while (!endFunc() && predicate(currentFunction()))
		res = appendFunction(res, nextFunction)
	if (finale) finale()
	return res
}

export const readWhile = readWhilst

// * useful with the pre-set tokentypes inside the UtilFunctions (simulating the proper templates)...
export function read(
	tokentypes: { [a: string]: Function },
	tokentype: string,
	...args: any[]
): any {
	return tokentypes[tokentype](...args)
}

// * May be very useful in parsing of nested things. Used it once for an algorithm to traverse an arbitrary binary sequence...
export function recursiveIndexation<InType = object, OutType = any>(
	object: InType,
	fields: (string | symbol | number)[]
): OutType {
	let res: any = object
	for (const f of fields) res = res[f]
	return res as OutType
}

// * syntax sugar for while () {}
export function whileDo(endfunction: () => boolean, repeat: Function) {
	while (endfunction()) repeat()
}

// TODO: keep generalizing the previous functions...

// * Conceptually, this should be a templated object, but there aren't any such in TS.
// TODO: after having created all the wanted general functions, make this a sort of all-in-one function: way of assembling the similar definitions together (that is applying the same arguments to different funcitons...)...
export class UtilFunctions<StringType = string> {
	functions: { [a: string]: Function }
	constructor() {
		// TODO: list and write all the definitions....
		this.functions["delimited"] = () => {}
		this.functions["recursiveIndexation"] = () => {}
		this.functions["read"] = () => {}
		this.functions["readWhilst"] = this.functions["readWhile"] = () => {}
	}
	call(funcname: string, ...args: any[]) {
		return read(this.functions, funcname, ...args)
	}
}
