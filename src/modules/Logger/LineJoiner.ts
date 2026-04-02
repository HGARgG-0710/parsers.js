import type { ILinePrintable } from "../../interfaces.js"

export class LineJoiner {
	format(linePrintable: ILinePrintable, tabbed?: boolean) {
		return linePrintable.printLines(tabbed).join(this.separator)
	}

	constructor(private readonly separator: string = "") {}
}
