import type { ILinePrintable } from "../../interfaces/LineFormatter.js"

export class LineFormatter {
	format(linePrintable: ILinePrintable, tabbed?: boolean) {
		return linePrintable.printLines(tabbed).join(this.separator)
	}

	constructor(private readonly separator: string) {}
}
