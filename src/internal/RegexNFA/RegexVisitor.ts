import type { IRawRegexVisitor } from "../../interfaces.js"
import type { Regex } from "../../objects.js"
import {
	AnythingState,
	CharState,
	CodeRangeState,
	EitherState,
	EmptyState,
	Fragment
} from "./State.js"

// ! pre-doc: this is the thing that converts the "Regex.Raw" into a linked list of `State`s
export class NFARegexVisitor implements IRawRegexVisitor<Fragment | null> {
	handleCatenation(catenation: Regex.Raw.Catenation): Fragment | null {
		if (catenation.items.length === 0) return null
		const firstFrag = catenation.items[0].accept(this)
		if (!firstFrag) return null

		const fragStart = firstFrag.inState
		let lastFrag = firstFrag

		for (let i = 1; i < catenation.items.length; ++i) {
			const currItem = catenation.items[i]
			const currFrag = currItem.accept(this)
			if (currFrag) {
				lastFrag.patch(currFrag.inState)
				lastFrag = currFrag
			}
		}

		return new Fragment(fragStart, lastFrag.outArrows)
	}

	handleChar({ char }: Regex.Raw.Char): Fragment {
		const charState = new CharState(char)
		return new Fragment(charState, [charState.arrow])
	}

	handleEither(either: Regex.Raw.Either): Fragment | null {
		const frags: Fragment[] = []
		for (let i = 0; i < either.options.length; ++i) {
			const currOption = either.options[i]
			const currFrag = currOption.accept(this)
			if (currFrag) frags.push(currFrag)
		}
		const inState = new EitherState(frags.map((x) => x.inState))
		return new Fragment(inState, []).append(...frags)
	}

	handleAnything(anything: Regex.Raw.Anything): Fragment | null {
		const anythingState = new AnythingState()
		return new Fragment(anythingState, [anythingState.arrow])
	}

	// ! FINISH
	handleIgnoreCase(ignoreCase: Regex.Raw.IgnoreCase): Fragment | null {
		return null
	}

	handleCodeRange({ from, to }: Regex.Raw.CodeRange): Fragment | null {
		const rangeState = new CodeRangeState(from, to)
		return new Fragment(rangeState, [rangeState.arrow])
	}

	// ! FINISH
	handleNoCapture(noCapture: Regex.Raw.NoCapture): Fragment | null {
		return null
	}

	// ! FINISH [this one's going to be *very* hard...]
	handleNonGreedy(nonGreedy: Regex.Raw.NonGreedy): Fragment | null {
		return null
	}

	handleNoneOrMore({ item }: Regex.Raw.NoneOrMore): Fragment | null {
		const subExpr = item.accept(this)
		if (!subExpr) return null
		const altState = new EmptyState()
		const repState = new EitherState([subExpr.inState, altState])
		subExpr.patch(repState)
		return new Fragment(repState, [altState.arrow])
	}

	handleOptional({ item }: Regex.Raw.Optional): Fragment | null {
		const subExpr = item.accept(this)
		if (!subExpr) return null
		const altState = new EmptyState()
		const choiceState = new EitherState([subExpr.inState, altState])
		return new Fragment(
			choiceState,
			subExpr.outArrows.concat([altState.arrow])
		)
	}

	// ! FINISH
	handleNoneOf(noneOf: Regex.Raw.NoneOf): Fragment | null {
		return null
	}

	// ! FINISH
	handleTokenType(tokenType: Regex.Raw.TokenType): Fragment | null {
		return null
	}
}
