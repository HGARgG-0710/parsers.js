import type { IRegexBuilder, IRegexMatcher } from "../interfaces.js"
import { RegexCompiler } from "./RegexCompiler.js"

/**
 * This serves as a preliminary abstraction to `RegexCompiler`.
 * It caches all the regular expressions given.
 * Useful to avoid forced caching of `new Regex(...)` calls for
 * efficiency purposes due to repeated parsing.
 *
 * It is a singleton, obtained via `instance: RegexStorage`.
 */
export class RegexStorage {
	static readonly instance = new RegexStorage()

	private readonly cached = new Map<string, IRegexMatcher>()

	private makeNew(regex: string, builder: IRegexBuilder) {
		const compiled = RegexCompiler.instance.compile(regex, builder)
		this.cached.set(regex, compiled)
		return compiled
	}

	private getCachedIfPresent(regex: string) {
		return this.cached.get(regex)
	}

	get(regex: string, builder: IRegexBuilder) {
		return this.getCachedIfPresent(regex) || this.makeNew(regex, builder)
	}

	private constructor() {}
}
