import type { IRawRegexVisitor } from "../../../interfaces.js"
import type { Regex } from "../../../objects.js"
import {
	type ArrowState,
	BoundaryState,
	CharState,
	CodeRangeState,
	EitherState,
	EmptyState,
	Fragment,
	NonBoundaryState,
	NoneOfState,
	State,
	TokenState,
	UnicodePropertyAliasState,
	UnicodePropertyState
} from "./State.js"

class FragConverter {
	toFragment(arrowState: ArrowState) {
		return new Fragment(arrowState, [arrowState.arrow])
	}

	toFragList(raw: Regex.Raw[], visitor: IRawRegexVisitor<Fragment | null>) {
		const result: Fragment[] = []
		for (const currItem of raw) {
			const currFrag = currItem.accept(visitor)
			if (currFrag) result.push(currFrag)
		}
		return result
	}

	toInStateList(frags: Fragment[]) {
		return frags.map((x) => x.inState)
	}

	toInStates(
		raw: Regex.Raw[],
		visitor: IRawRegexVisitor<Fragment | null>
	): State[] {
		return this.toInStateList(this.toFragList(raw, visitor))
	}
}

// ! pre-doc: this is the thing that converts the "Regex.Raw" into a linked list of `State`s
export class NFARegexVisitor implements IRawRegexVisitor<Fragment | null> {
	private readonly fragConverter = new FragConverter()

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
		return this.fragConverter.toFragment(new CharState(char, extensions))
	}

	handleEither({ items }: Regex.Raw.Either): Fragment | null {
		const frags = this.fragConverter.toFragList(items, this)
		const inState = new EitherState(this.fragConverter.toInStateList(frags))
		return new Fragment(inState, []).append(...frags)
	}

	handleAnything(anything: Regex.Raw.Anything): Fragment | null {
		return this.fragConverter.toFragment(new EmptyState())
	}

	handleCodeRange({
		from,
		to,
		extensions
	}: Regex.Raw.CodeRange): Fragment | null {
		return this.fragConverter.toFragment(
			new CodeRangeState(from, to, extensions)
		)
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

	handleNoneOf({ items, extensions }: Regex.Raw.NoneOf): Fragment | null {
		return this.fragConverter.toFragment(
			new NoneOfState(
				this.fragConverter.toInStates(items, this),
				extensions
			)
		)
	}

	handleTokenType({
		type,
		extensions
	}: Regex.Raw.TokenType): Fragment | null {
		return this.fragConverter.toFragment(new TokenState(type, extensions))
	}

	handleBoundary({ items }: Regex.Raw.Boundary): Fragment | null {
		return this.fragConverter.toFragment(
			new BoundaryState(this.fragConverter.toInStates(items, this))
		)
	}

	handleNonBoundary({ items }: Regex.Raw.NonBoundary): Fragment | null {
		return this.fragConverter.toFragment(
			new NonBoundaryState(this.fragConverter.toInStates(items, this))
		)
	}

	handleUnicodeProperty({
		propName,
		value,
		extensions
	}: Regex.Raw.UnicodeProperty): Fragment | null {
		return this.fragConverter.toFragment(
			new UnicodePropertyState(propName, value, extensions)
		)
	}

	handleUnicodePropertyAlias({
		propName,
		extensions
	}: Regex.Raw.UnicodeProperty.Alias): Fragment | null {
		return this.fragConverter.toFragment(
			new UnicodePropertyAliasState(propName, extensions)
		)
	}
}
