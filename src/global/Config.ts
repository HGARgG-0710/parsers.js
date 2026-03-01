import { ErrorPrinter } from "../objects.js"

class XMLConfig {
	lf = true
	attrQuoteDouble = true
	tab = "\t"
}

class RegexConfig {
	errorPrinter: ErrorPrinter = ErrorPrinter.Plain.instance
}

class UnicodeConfig {
	// ! pre-doc: this is a valid BCP-47 languages tag!
	// ! BCP 47 tag lookup: https://r12a.github.io/app-subtags/#note2
	locales: string[] = ["en-US"]
}

class ErrorConfig {
	tab = "\t"
	lf = true
	loggedNewlinesBetween = 2
}

class JSONConfig {
	spaces = 0
	replacer: null | (number | string)[] = null
}

// ! pre-doc: that's where the FEATURE FLAGS go
class FeatureConfig {
	usePools = false
}

class ObjectPoolConfig {
	defaultMaxSize = Infinity
}

class LibConfig {
	readonly xml = new XMLConfig()
	readonly regex = new RegexConfig()
	readonly unicode = new UnicodeConfig()
	readonly errors = new ErrorConfig()
	readonly json = new JSONConfig()
	readonly features = new FeatureConfig()
	readonly objectPools = new ObjectPoolConfig()
}

export const Config = new LibConfig()
