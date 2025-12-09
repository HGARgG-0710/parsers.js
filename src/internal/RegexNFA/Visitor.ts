import type { IRawRegexVisitor } from "../../interfaces.js"
import type { Regex } from "../../objects.js"
import {
	ArrowState,
	BoundaryState,
	CharState,
	CodeRangeState,
	EitherState,
	EmptyState,
	Fragment,
	NonBoundaryState,
	NoneOfState,
	State,
	TokenState
} from "./State.js"

// ! pre-doc: this is the thing that converts the "Regex.Raw" into a linked list of `State`s
export class NFARegexVisitor implements IRawRegexVisitor<Fragment | null> {
	private toFragment(arrowState: ArrowState) {
		return new Fragment(arrowState, [arrowState.arrow])
	}

	private toFragList(raw: Regex.Raw[]) {
		const result: Fragment[] = []
		for (const currItem of raw) {
			const currFrag = currItem.accept(this)
			if (currFrag) result.push(currFrag)
		}
		return result
	}

	private toInStateList(frags: Fragment[]) {
		return frags.map((x) => x.inState)
	}

	private toInStates(raw: Regex.Raw[]): State[] {
		return this.toInStateList(this.toFragList(raw))
	}

	handleCatenationLike(items: Regex.Raw[]): Fragment | null {
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

	handleChar({ char, extensions }: Regex.Raw.Char): Fragment {
		return this.toFragment(new CharState(char, extensions))
	}

	handleEither({ items }: Regex.Raw.Either): Fragment | null {
		const frags = this.toFragList(items)
		const inState = new EitherState(this.toInStateList(frags))
		return new Fragment(inState, []).append(...frags)
	}

	handleAnything(anything: Regex.Raw.Anything): Fragment | null {
		return this.toFragment(new EmptyState())
	}

	handleCodeRange({
		from,
		to,
		extensions
	}: Regex.Raw.CodeRange): Fragment | null {
		return this.toFragment(new CodeRangeState(from, to, extensions))
	}

	// ! FINISH
	handleNoCapture(noCapture: Regex.Raw.NoCapture): Fragment | null {}

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
		return this.toFragment(new NoneOfState(this.toInStates(items)))
	}

	handleTokenType({ type }: Regex.Raw.TokenType): Fragment | null {
		return this.toFragment(new TokenState(type))
	}

	handleBoundary({ items }: Regex.Raw.Boundary): Fragment | null {
		return this.toFragment(new BoundaryState(this.toInStates(items)))
	}

	handleNonBoundary({ items }: Regex.Raw.NonBoundary): Fragment | null {
		return this.toFragment(new NonBoundaryState(this.toInStates(items)))
	}
}
