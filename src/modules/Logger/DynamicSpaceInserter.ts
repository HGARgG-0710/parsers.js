export class DynamicSpaceInserter {
	insertNewlineAfter(item: string, count: number = 1) {
		return `${item}${this.newlineGetter().repeat(count)}`
	}

	insertTabAfter(item: string, count: number = 1) {
		return `${item}${this.tabGetter().repeat(count)}`
	}

	constructor(
		private readonly newlineGetter: () => string = () => "\n",
		private readonly tabGetter: () => string = () => "\t"
	) {}
}
