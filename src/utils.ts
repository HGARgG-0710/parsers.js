// TODO: whenever functions are concerned, pray do add capability to add as many arguments as he the self wants...

// TODO: Create some of the wanted elementary functions that self would consider useful in building a parser (that is, to maximize the optimization of the routine repetition of various naturally ocurring parsing procedures)...
// * Currently, the `utils` can:
// * 1. delimit arbitrary sequences...
// * 2. read arbitrary functions provided the functions tables themselves...
// * 3. read arbitrary sequences of tables provided sequences of functions tables...
// * 4. recursively read a tree-object of arbitrary depth or shape;
// * 5. recursively write a tree-object of arbitrary depth or shape;
// * 6. configurably skip past multiple instances of a certain object;
// * 7. configurably read a sequence of objects and then configurably "append" them together (depends on user's definition...)
// IN WORK: 8. configure a united system of all these functions...
// * 9. Have a defined type of a function table

// TODO: continue on with the generalizing of the things...

// ? Rename arguments?
export function delimited<StringType = string>({
	starts,
	stops,
	separators,
	parser,
	shouldSkipStop = true,
	noStartSym,
	noStopSym,
	noticeFunc,
	nextFunc,
	skip,
	endFunc,
	outputFunction,
	startCallback = () => {
		return undefined
	},
	endCallback = () => {
		return undefined
	},
	skipMultipleSeps = true,
}: {
	starts: StringType[]
	stops: StringType[]
	separators: StringType[]
	parser: Function
	shouldSkipStop: boolean | Function
	noStartSym: StringType
	noStopSym: StringType
	noticeFunc: Function
	nextFunc: Function
	skip: (toSkip: StringType, noticeFunction?: Function) => any
	endFunc: (...a: any) => boolean
	outputFunction: (beginVal: any, endVal: any, delimitedRes: any[]) => any
	startCallback?: Function
	endCallback?: Function
	skipMultipleSeps?: boolean
}) {
	// ? generalize?
	function skipSeparators(separator: StringType) {
		skip(separator, noticeFunc)
		if (skipMultipleSeps)
			skipMultiple<StringType>({
				char: separator,
				nextFunction: nextFunc,
				spotFunction: noticeFunc,
			})
	}

	const tocall_end = () => {
		let i = 1
		for (const s of stops) {
			if (noticeFunc(s)) return i
			i++
		}
		return false
	}

	const delimitedArr: any[] = []
	let first = true

	const stopOnSeparator = stops.includes(noStopSym)
	let startVal = undefined
	let endVal: any

	// allowing for multiple starts (here, the starts are skipped "-or"-way, not "-and"-way; i.e. if more than one are found, then only the first one is read...)
	// ? why, by the way? Should he the body not make it a flag?
	if (!starts.includes(noStartSym))
		if (starts instanceof Array) {
			let i = 0

			for (const _start of starts) {
				if (noticeFunc(_start)) {
					startVal = startCallback()
					nextFunc()
					break
				}

				if (i === starts.length - 1) {
					startVal = startCallback()
					skip(_start, noticeFunc)
				}
				i++
			}
		}

	// ? this "skip the separators before the actual beginning" should be turnable on/off by a flag too...
	// TODO: do along with the other questions...
	for (const a of separators)
		skipMultiple<StringType>({
			char: a,
			nextFunction: nextFunc,
			spotFunction: noticeFunc,
		})

	while (!endFunc()) {
		if (!stopOnSeparator && tocall_end()) {
			endVal = endCallback()
			break
		}

		if (first) first = false
		else {
			if (!stopOnSeparator) {
				let j = 0

				for (const sep of separators) {
					if (noticeFunc(sep)) {
						skipSeparators(sep)
						break
					}

					if (j === separators.length - 1) skipSeparators(sep)
					j++
				}
			} else if (separators instanceof Array) {
				let leave = false

				for (const s of separators)
					if (noticeFunc(s)) {
						leave = true
						break
					}

				if (!leave) break
			} else if (!noticeFunc(separators)) break
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
		skip(stops[(tocallendres as number) - 1], noticeFunc)

	return outputFunction(startVal, endVal, delimitedArr)
}

function skipMultiple<StringType = string>({
	char,
	nextFunction,
	spotFunction,
}: {
	char: StringType
	nextFunction: Function
	spotFunction: Function
}) {
	while (spotFunction(char)) nextFunction()
}

export function readWhilst<StringType = string>({
	predicate,
	currentFunction,
	nextFunction,
	appendFunction,
	beforeEvery = () => undefined,
	afterEvery = () => undefined,
	endFunc,
	emptyValue,
	beginning = () => undefined,
	finale = () => undefined,
	skipFirst = false,
}: {
	predicate: Function
	currentFunction: Function
	nextFunction: Function
	appendFunction: Function
	beforeEvery: Function
	afterEvery: Function
	endFunc: () => boolean
	emptyValue: StringType
	beginning: Function
	finale: Function | undefined
	skipFirst?: boolean
}): StringType {
	let res: StringType = skipFirst ? emptyValue : currentFunction()
	beginning()
	while (!endFunc() && predicate(currentFunction())) {
		beforeEvery()
		res = appendFunction(res, nextFunction())
		afterEvery()
	}
	finale()
	return res
}

export const readWhile = readWhilst

// * useful with the pre-set tokentypes inside the UtilFunctions (simulating the proper templates)...
export function read({
	typestable,
	type,
	args = [],
}: {
	typestable: FunctionTable
	type: Key
	args?: any[]
}): any {
	return typestable[type](...args)
}

// * generalization of read for multiple types;
export function readSequence({
	typestable,
	types,
	args = Object.keys(typestable).map(() => []),
}: {
	typestable: FunctionTable[]
	types: Key[]
	args?: any[][]
}): any {
	let currRes: any = undefined

	for (let i = 0; i < types.length; i++) {
		currRes = typestable[types[i]](currRes, args[i])
		if (!currRes) break
	}

	return currRes
}

// * May be very useful in parsing of nested things. Used it once for an algorithm to traverse an arbitrary binary sequence...
export function recursiveIndexation<InType = object, OutType = any>({
	object,
	fields,
}: {
	object: InType
	fields: Key[]
}): OutType {
	let res: any = object
	for (const f of fields) res = res[f]
	return res as OutType
}

export function recursiveSetting<InType = object, OutType = any>({
	object,
	fields,
	value,
}: {
	object: InType
	fields: Key[]
	value: any
}): OutType {
	let result: any = object

	result = recursiveIndexation({
		object: result,
		fields: fields.slice(0, fields.length - 1),
	})

	result[fields[fields.length - 1]] = value
	return result as OutType
}

// * syntax sugar for while () {}
export function whileDo({
	endfunction,
	repeat,
}: {
	endfunction: () => boolean
	repeat: Function
}): void {
	while (endfunction()) repeat()
}

// TODO: keep generalizing the previous functions...

// * Conceptually, this should be a templated object, but there aren't any such in TS.
// TODO: after having created all the wanted general functions, make this a sort of all-in-one function: way of assembling the similar definitions together (that is applying the same arguments to different funcitons...)...
export class UtilFunctions<
	StringType = string,
	InType = object,
	OutType = object
> {
	functions: { [a: string]: Function }
	params: UtilParams
	constructor(defaultParams: UtilParams) {
		this.params = defaultParams

		// TODO: give more accurate object types...
		const functionTable: object = {
			delimited: (args) => delimited<StringType>(args),
			recursiveIndexation: (args) =>
				recursiveIndexation<InType, OutType>(args),
			recursiveSetting: (args) => recursiveSetting<InType, OutType>(args),
			read: read,
			readSequence: readSequence,
			readWhilst: (args) => readWhilst<StringType>(args),
			readWhile: (args) => readWhile<StringType>(args),
			whileDo: whileDo,
			skipMultiple: (args) => skipMultiple<StringType>(args),
		}

		// TODO: there is a thing: the UtilParams type should be written in such a manner as to allow for missing params (that is, instead of using default values, self would instead use the "?" mark);
		for (const functionName of Object.keys(functionTable))
			this.functions[functionName] = (pars?: UtilParams): any =>
				functionTable[functionName]({ ...this.params, ...pars })
	}
	call(funcname: string, ...args: any[]): any {
		return read({
			typestable: this.functions,
			type: funcname,
			args: [...args],
		})
	}
}

type FunctionTable = { [a: Key]: Function }
type Key = string | number | symbol

// TODO: finish...
type UtilParams = {}

/**
 * Takes a string and returns a convinient structure for iteration of it.
 * @param {string} input String to be used as input.
 */
export function InputStream(
	input: string,
	errorfunc: (message: string, line: number, colon: number) => never
) {
	return {
		sourcestring: input.split(""),
		pos: 0,
		curr: function () {
			return this.sourcestring[this.pos]
		},
		next: function () {
			return this.sourcestring[++this.pos]
		},
		prev: function () {
			return this.sourcestring[--this.pos]
		},
		isEnd: function () {
			return this.pos >= input.length
		},
		err: (message: string) => {
			let alterpos = 0
			let colon = 0
			let line = 0

			for (; alterpos < this.pos; alterpos++) {
				if (input[alterpos] === "\n") {
					line++
					colon = 0
					continue
				}
				colon++
			}

			errorfunc(message, line, colon)
		},
	}
}
