import type { IStringConvertible } from "../../interfaces.js"

export abstract class NodeData {
	["constructor"]: typeof NodeData

	protected static readonly ReservedKeys: readonly string[] = []

	static isReserved(key: string): boolean {
		return this.ReservedKeys.includes(key)
	}

	private readonly asMap = new Map<string, any>()

	protected setUnsafe(key: string, value: any) {
		this.asMap.set(key, value)
	}

	get(key: string): any {
		return this.asMap.get(key)
	}

	set(key: string, value: any) {
		if (this.constructor.isReserved(key))
			throw TypeError("attempting to override a reserved key manually")
		this.setUnsafe(key, value)
	}
}

export namespace NodeData {
	export class WithPrintable<T extends IStringConvertible> extends NodeData {
		protected static override readonly ReservedKeys: readonly string[] = [
			"printable"
		]

		private get printableKey() {
			return NodeData.WithPrintable.ReservedKeys[0]
		}

		get printable(): T {
			return super.get(this.printableKey)
		}

		setPrintable(newPrintable: T) {
			this.setUnsafe(this.printableKey, newPrintable)
		}

		constructor(printable?: T) {
			super()
			if (printable) this.setPrintable(printable)
		}
	}

	export class WithSource<
		T extends IStringConvertible,
		SourceType = string
	> extends WithPrintable<T> {
		protected static override readonly ReservedKeys: readonly string[] =
			WithPrintable.ReservedKeys.concat(["source"])

		private baseReservedKeyCount() {
			return WithPrintable.ReservedKeys.length
		}

		private get sourceKey() {
			return WithSource.ReservedKeys[this.baseReservedKeyCount()]
		}

		get source(): SourceType {
			return this.get(this.sourceKey)
		}

		setSource(newSource: SourceType) {
			this.setUnsafe(this.sourceKey, newSource)
		}
	}
}
