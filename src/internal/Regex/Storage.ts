import type { IRegexMatcher } from "../../interfaces.js"
import type { Regex } from "../../objects.js"
import { RegexCompiler } from "./Compiler/Compiler.js"

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

	private makeNew(regex: string, config: Regex.Config) {
		const compiled = RegexCompiler.instance.compile(regex, config)
		this.cached.set(regex, compiled)
		return compiled
	}

	private tryFetchCached(regex: string) {
		return this.cached.get(regex)
	}

	get(regex: string, config: Regex.Config) {
		return this.tryFetchCached(regex) || this.makeNew(regex, config)
	}

	private constructor() {}
}
