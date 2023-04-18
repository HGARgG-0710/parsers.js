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
export function read({ typetable, type, args = [] }) {
	return typetable[type](...args)
}
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
export function recursiveIndexation({ object, fields }) {
	let res = object
	for (const f of fields) res = res[f]
	return res
}
export function recursiveSetting({ object, fields, value }) {
	return (recursiveIndexation({
		object: object,
		fields: fields.slice(0, fields.length - 1)
	})[fields[fields.length - 1]] = value)
}
export function whileDo({ isEnd, repeat }) {
	while (!isEnd()) repeat()
}
export class UtilFunctions {
	constructor(defaultParams) {
		this.params = defaultParams
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
