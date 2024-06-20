export function delimited(limits, isdelim) {
	if (!(limits instanceof Array)) limits = [limits]
	const pred = predicateChoice(limits[1]) || predicateChoice(limits[0])
	const prePred = +(1 in limits) && limits[0]
	return function (input, handler) {
		const _skip = skip(input)
		_skip(prePred)
		const result = []
		const endpred = (input, i, j) => !input.isEnd() && pred(input, i, j)
		for (let i = 0, j = 0; endpred(input, i, j); ++i) {
			j += _skip((input, _j) => isdelim(input, i, j + _j))
			if (!endpred(input, i, j)) break
			result.push(...handler(input, i, j))
			input.next()
		}
		return result
	}
}
export function eliminate(symbols) {
	return (pattern, nil = pattern.class.empty) =>
		symbols.reduce((acc, curr) => acc.split(curr).join(nil), pattern)
}
export function skip(input) {
	return function (steps = 1) {
		let i = 0
		const pred = predicateChoice(steps)
		while (!input.isEnd() && pred(input, i)) {
			input.next()
			++i
		}
		return i
	}
}

export function read(pred, init) {
	pred = predicateChoice(pred)
	return function (input) {
		let res = init
		for (let i = 0; !input.isEnd() && pred(input, i); ++i) {
			res = res.concat(input.curr())
			input.next()
		}
		return res
	}
}

export function limit(init, pred) {
	init = predicateChoice(init)
	if (!pred) {
		pred = init
		init = 0
	}
	return function (input) {
		const _skip = skip(input)
		_skip(init)
		const result = []
		for (let i = 0; !input.isEnd() && pred(input, i); ++i) result.push(input.next())
		return result
	}
}

export const preserve = (input) => [input.curr()]
export const miss = () => []

export function transform(handler = preserve) {
	return function (input) {
		const result = []
		for (let i = 0; !input.isEnd(); ++i) {
			result.push(...handler(input, i))
			input.next()
		}
		return result
	}
}