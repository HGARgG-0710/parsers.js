import type { IStream } from "../../interfaces.js"
import { BaseEndingProvider } from "./Base.js"

export class StreamEndingProvider extends BaseEndingProvider<IStream> {
	isEnd(): boolean {
		return this.forItem.isEnd
	}

	isCurrEnd(): boolean {
		return this.forItem.isCurrEnd()
	}

	protected override getArgs(): [] {
		return []
	}
}
