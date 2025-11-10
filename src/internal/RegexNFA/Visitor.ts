import type { IRawRegexVisitor } from "../../interfaces.js"
import type { Regex } from "../../objects.js"
import {
	ArrowState,
	CharState,
	CodeRangeState,
	EitherState,
	EmptyState,
	Fragment,
	NoneOfState,
	TokenState,
	type IVerifiableState
} from "./State.js"

// ! pre-doc: this is the thing that converts the "Regex.Raw" into a linked list of `State`s
export class NFARegexVisitor implements IRawRegexVisitor<Fragment | null> {
	private toFragment(arrowState: ArrowState) {
		return new Fragment(arrowState, [arrowState.arrow])
	}

	handleCatenation({ items }: Regex.Raw.Catenation): Fragment | null {
		if (items.length === 0) return null
		const firstFrag = items[0].accept(this)
		if (!firstFrag) return null

		const fragStart = firstFrag.inState
		let lastFrag = firstFrag

		for (let i = 1; i < items.length; ++i) {
			const currItem = items[i]
			const currFrag = currItem.accept(this)
			if (currFrag) {
				lastFrag.patch(currFrag.inState)
				lastFrag = currFrag
			}
		}

		return new Fragment(fragStart, lastFrag.outArrows)
	}

	handleChar({ char }: Regex.Raw.Char): Fragment {
		return this.toFragment(new CharState(char))
	}

	handleEither({ options }: Regex.Raw.Either): Fragment | null {
		const frags: Fragment[] = []
		for (let i = 0; i < options.length; ++i) {
			const currOption = options[i]
			const currFrag = currOption.accept(this)
			if (currFrag) frags.push(currFrag)
		}
		const inState = new EitherState(frags.map((x) => x.inState))
		return new Fragment(inState, []).append(...frags)
	}

	handleAnything(anything: Regex.Raw.Anything): Fragment | null {
		return this.toFragment(new EmptyState())
	}

	// ! FINISH
	handleIgnoreCase(ignoreCase: Regex.Raw.IgnoreCase): Fragment | null {
		return null
	}

	handleCodeRange({ from, to }: Regex.Raw.CodeRange): Fragment | null {
		return this.toFragment(new CodeRangeState(from, to))
	}

	// ! FINISH
	handleNoCapture(noCapture: Regex.Raw.NoCapture): Fragment | null {
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

	handleNoneOf({ items }: Regex.Raw.NoneOf): Fragment | null {
		const negated: IVerifiableState[] = []
		for (const currItem of items) {
			const currFrag = currItem.accept(this)
			// * we know it's `IVerifiableState` since it's always a ^[...]
			// (i.e. by Type connascence)
			if (currFrag) negated.push(currFrag.inState as IVerifiableState)
		}
		return this.toFragment(new NoneOfState(negated))
	}

	handleTokenType({ type }: Regex.Raw.TokenType): Fragment | null {
		return this.toFragment(new TokenState(type))
	}
}
