import type { IByteSource } from "../../interfaces.js"
import { BaseEndingProvider } from "./Base.js"

export class ByteSourceEndingProvider extends BaseEndingProvider<
	IByteSource,
	[]
> {
	isEnd(): boolean {
		return !this.forItem.hasBytes()
	}

	protected override getArgs(): [] {
		return []
	}
}
