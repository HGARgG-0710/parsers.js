import type {
	ICaptureResolutionPredicate,
	IConcreteRegexFinalizer
} from "../../../interfaces.js"
import type { Regex } from "../../../objects.js"
import { NFARegexMatcher } from "./Matcher.js"
import { MatchState, type Fragment } from "./State.js"
import { NFARegexVisitor } from "./Visitor.js"

function patchMatchStateTo(frag: Fragment) {
	return frag.patch(new MatchState())
}

export class NFARegexFinalizer<T = any> implements IConcreteRegexFinalizer {
	static readonly default = new NFARegexFinalizer()

	private readonly visitor = new NFARegexVisitor()

	private toState(regex: Regex.Raw) {
		const frag = regex.accept(this.visitor)
		if (!frag) {
			// TODO: add a proper error message here... - "empty" Regex are NOT ALLOWED!
			throw false
		}
		return patchMatchStateTo(frag).inState
	}

	toConcrete(regex: Regex.Raw) {
		return new NFARegexMatcher(this.toState(regex), this.captureResolver)
	}

	constructor(
		private readonly captureResolver: ICaptureResolutionPredicate<T> = () =>
			0
	) {}
}
