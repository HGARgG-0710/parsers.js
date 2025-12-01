class XMLConfig {
	lf = true
	attrQuoteDouble = true
}

class LibConfig {
	readonly xml = new XMLConfig()
}

export const Config = new LibConfig()
