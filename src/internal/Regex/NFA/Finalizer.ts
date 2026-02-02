import { Config } from "../../../global.js"
import type {
	ICaptureResolutionPredicate,
	IConcreteRegexFinalizer
} from "../../../interfaces.js"
import type { Regex } from "../../../objects.js"
import { SimpleErrorData } from "../../../objects/ErrorData.js"
import { FactuallyEmptyRegexError } from "./Errors.js"
import { NFARegexDudMatcher, NFARegexMatcher } from "./Matcher.js"
import { MatchState, type Fragment } from "./State.js"
import { NFARegexVisitor } from "./Visitor.js"

function patchMatchStateTo(frag: Fragment) {
	return frag.patch(new MatchState())
}

export class NFARegexFinalizer<T = any> implements IConcreteRegexFinalizer {
	static readonly default = new NFARegexFinalizer()

	private readonly visitor = new NFARegexVisitor()

	private get errPrinter() {
		return Config.regex.errorPrinter
	}

	private toState(regex: Regex.Raw) {
		const frag = regex.accept(this.visitor)
		if (!frag)
			throw FactuallyEmptyRegexError.prepare(new SimpleErrorData(), regex)
		return patchMatchStateTo(frag).inState
	}

	toConcrete(regex: Regex.Raw) {
		const asState = this.errPrinter.execute(() => this.toState(regex))
		return asState
			? new NFARegexMatcher(asState, this.captureResolver)
			: new NFARegexDudMatcher()
	}

	constructor(
		private readonly captureResolver: ICaptureResolutionPredicate<T> = () =>
			0
	) {}
}
