// * Pre-doc note: the infinite (or any) recursion is possible via '__call__() { return this.__call() }'
export abstract class FlexibleFunction extends Function {
	protected self: Function
	protected abstract __call__(...x: any[]): any
	constructor() {
		super("...args", "return this.self.__call__(...args)")
		const self = this.bind(this)
		this.self = self
		return self
	}
}
