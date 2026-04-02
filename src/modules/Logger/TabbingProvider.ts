import { Counter } from "../../objects.js"

export class TabbingProvider {
	readonly tabbing: Counter

	private getTabbing() {
		return this.paddingSymbol.repeat(this.tabbing.get())
	}

	provideNewlineTabbing(forString: string) {
		return `${this.newlineSymbol}${this.getTabbing()}${forString}`
	}

	toFormatted(list: string[]) {
		return list.map((x) => this.provideNewlineTabbing(x))
	}

	tabList(...items: string[]) {
		return this.toFormatted(items).join("")
	}

	constructor(
		startPadding: number = 0,
		private readonly paddingSymbol: string = "\t",
		private readonly newlineSymbol: string = "\n"
	) {
		this.tabbing = new Counter(startPadding)
	}
}
