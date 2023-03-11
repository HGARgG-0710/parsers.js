// TODO: whenever functions are concerned, pray do add capability to add as many arguments as he the self wants...
// TODO: Create some of the wanted elementary functions that self would consider useful in building a parser (that is, to maximize the optimization of the routine repetition of various naturally ocurring parsing procedures)...
// TODO: let the things that are `start`, `stop` and `separator` be more general: don't have to be `string`, anything else...
function delimited(
	start: string[],
	stop: string[],
	separator: string[],
	parser: Function,
	shouldSkipStop: boolean | Function = true,
	noticeFunc: Function,
	nextFunc: Function,
	startCallback = () => {
		return undefined
	},
	endCallback = () => {
		return undefined
	}
) {
	// ? generalize?
	function skipSeparators(separator) {
		skip(separator)
		skipMultiple(separator)
	}

	const tocall = skipSeparators
	const tocall_end =
		stop instanceof Array
			? () => {
					for (const s of stop) if (noticeFunc(s)) return true
					return false
			  }
			: () => noticeFunc(stop)

	const delimitedArr: any[] = []
	let first = true

	const stopOnSeparator = stop.includes("")
	let startVal = undefined
	let endVal: any

	// allowing for multiple starts (here, the starts are skipped "-or"-way, not "-and"-way; i.e. if more than one are found, then only the first one is read...)
	// ? why, by the way? Should he the body not make it a flag?
	if (!start.includes(""))
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

	if (separator instanceof Array) {
		for (const a of separator) if (noticeFunc(a)) nextFunc()
	} else skipMultiple(separator)

	while (!input.isEnd()) {
		if (!stopOnSeparator && tocall_end()) {
			endVal = endCallback()
			break
		}

		if (first) first = false
		else {
			if (!stopOnSeparator)
				if (separator instanceof Array) {
					let j = 0

					for (const sep of separator) {
						if (noticeFunc(sta)) {
							tocall(sep)
							break
						}

						if (j === separator.length - 1) tocall(sep)
						j++
					}
				} else tocall(separator)
			else if (start instanceof Array) {
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

	if (typeof shouldSkipStop === "function") shouldSkipStop = shouldSkipStop()
	if (!stopOnSeparator && tocall_end() && shouldSkipStop)
		skip(stop, noticeFunc)

    // TODO: make the output more general... Provide some sort of argument for a wrapping function...
	return startVal !== undefined
		? endVal !== undefined
			? { delimval: delimitedArr, startVal: startVal, endVal: endVal }
			: { delimval: delimitedArr, startVal: startVal }
		: endVal !== undefined
		? { delimval: delimitedArr, endVal: endVal }
		: delimitedArr
}

function skipMultiple(
	char: any,
	nextFunction: () => any,
	spotFunction: (spotted?: any) => any
) {
	while (spotFunction(char)) nextFunction()
}

// TODO: keep generalizing the previous functions...

// * Conceptually, this should be a templated object, but there aren't any such in TS.
// TODO: after having created all the wanted general functions, make this a sort of all-in-one function: way of assembling the similar definitions together (that is applying the same arguments to different funcitons...)...
class UtilFunctions {
	functions: Function[]
	constructor() {}
}
