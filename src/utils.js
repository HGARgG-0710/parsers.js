// TODO: adopt the "math-expressions.js" typesystem into the project: let it be as unlimited! Let it keep the support for JavaScript in-built types;
// * A 'utils' file (object/submodule) of the library has various generalized functions and types that self have considered useful enoough for one's own projects.
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

// TODO: add one single 'export' instruction for the file...

// ? Rename arguments? Reorder them too (for clarity only...)
// TODO: give them the same names, order this stuff properly... 15 fields in the least...
export function delimited({
	begin,
	end,
	separator,
	parser,
	skipEnd = true,
	noStartSymbol,
	noStopSymbol,
	notice,
	next: next,
	skip,
	isEnd,
	output,
	beginCallback: beginCallback = () => {
		return undefined
	},
	endCallback = () => {
		return undefined
	},
	skipmultiseps = true
}) {
	// ? generalize?
	function skipSeparators(separator) {
		skip(separator, notice)
		if (skipmultiseps)
			skipMultiple({
				char: separator,
				next: next,
				notice: notice
			})
	}
	const tocall_end = () => {
		let i = 1
		for (const s of end) {
			if (notice(s)) return i
			i++
		}
		return false
	}
	const delimitedArr = []
	let first = true
	const stopOnSeparator = end.includes(noStopSymbol)
	let startVal = undefined
	let endVal
	// allowing for multiple starts (here, the starts are skipped "-or"-way, not "-and"-way; i.e. if more than one are found, then only the first one is read...)
	// ? why, by the way? Should he the body not make it a flag?
	if (!begin.includes(noStartSymbol))
		if (begin instanceof Array) {
			let i = 0
			for (const _start of begin) {
				if (notice(_start)) {
					startVal = beginCallback()
					next()
					break
				}
				if (i === begin.length - 1) {
					startVal = beginCallback()
					skip(_start, notice)
				}
				i++
			}
		}
	// ? this "skip the separators before the actual beginning" should be turnable on/off by a flag too...
	// TODO: do along with the other questions...
	for (const a of separator)
		skipMultiple({
			char: a,
			next: next,
			notice: notice
		})
	while (!isEnd()) {
		if (!stopOnSeparator && tocall_end()) {
			endVal = endCallback()
			break
		}
		if (first) first = false
		else {
			if (!stopOnSeparator) {
				let j = 0
				for (const s of separator) {
					if (notice(s)) {
						skipSeparators(s)
						break
					}
					if (j === separator.length - 1) skipSeparators(s)
					j++
				}
			} else if (separator instanceof Array) {
				let leave = false
				for (const s of separator)
					if (notice(s)) {
						leave = true
						break
					}
				if (!leave) break
			} else if (!notice(separator)) break
		}
		if (!stopOnSeparator && tocall_end()) {
			endVal = endCallback()
			break
		}
		delimitedArr.push(parser())
	}
	// * the success index is always +1 from the true one. That is to avoid situations with Boolean(0) = false...
	const tocallendres = tocall_end()
	if (typeof skipEnd === "function") skipEnd = skipEnd()
	if (!stopOnSeparator && tocallendres && skipEnd)
		skip(end[tocallendres - 1], notice)
	return output(startVal, endVal, delimitedArr)
}

function skipMultiple({ char, next, notice }) {
	while (notice(char)) next()
}

export function readWhilst({
	predicate,
	curr,
	next,
	append,
	beforeEvery = () => undefined,
	afterEvery = () => undefined,
	isEnd,
	emptyValue,
	beginCallback = () => undefined,
	endCallback = () => undefined,
	skipFirst = false
}) {
	let res = skipFirst ? emptyValue : curr()
	beginCallback()
	while (!isEnd() && predicate(curr())) {
		beforeEvery()
		res = append(res, next())
		afterEvery()
	}
	endCallback()
	return res
}

export const readWhile = readWhilst
// * useful with the pre-set tokentypes inside the UtilFunctions (simulating the proper templates)...
export function read({ typetable, type, args = [] }) {
	return typetable[type](...args)
}

// * generalization of read for multiple types;
export function readSequence({
	typetables,
	types,
	args = Object.keys(typetables).map(() => [])
}) {
	let currRes = undefined
	for (let i = 0; i < types.length; i++) {
		currRes = typetables[i][types[i]](currRes, args[i])
		if (!currRes) break
	}
	return currRes
}

// * syntax sugar for while (!a) b
export function whileDo({ isEnd, repeat }) {
	while (!isEnd()) repeat()
}

// TODO: keep generalizing the previous functions...
// * Conceptually, this should be a templated object, but there aren't any such in TS.
// TODO: after having created all the wanted general functions, make this a sort of all-in-one function: way of assembling the similar definitions together (that is applying the same arguments to different funcitons...)...
export class UtilFunctions {
	constructor(defaultParams) {
		this.params = defaultParams
		// TODO: give more accurate object types...
		const functionTable = {
			delimited: (args) => delimited(args),
			recursiveIndexation: (args) => recursiveIndexation(args),
			recursiveSetting: (args) => recursiveSetting(args),
			read: read,
			readSequence: readSequence,
			readWhilst: (args) => readWhilst(args),
			readWhile: (args) => readWhile(args),
			whileDo: whileDo,
			skipMultiple: (args) => skipMultiple(args)
		}
		// TODO: there is a thing: the UtilParams type should be written in such a manner as to allow for missing params (that is, instead of using default values, self would instead use the "?" mark);
		for (const functionName of Object.keys(functionTable))
			this.functions[functionName] = (pars) =>
				functionTable[functionName]({ ...this.params, ...pars })
	}
	call(funcname, ...args) {
		return read({
			typetable: this.functions,
			type: funcname,
			args: [...args]
		})
	}
}
// TODO: make this thing nested with the use of "template()" from "math-expressions.js@>=1.0"; the 'errorfunc' and 'input' should be separate layers (id est, one wants them to be)...
/**
 * Takes a string and returns a convinient structure for iteration over it.
 * @param {string} input String to be used as input.
 */
export function InputStream(input, errorfunc) {
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
		err: (message) => {
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
		}
	}
}
