// * Pre-doc note: the infinite (or any) recursion is possible via '__call__() { return this.__call() }'
export abstract class Callable<
	InitType extends any[] = any[],
	OutType = any
> extends Function {
	protected abstract __call__(...x: InitType): OutType
	protected self: Function
	constructor() {
		super("...args", "return this.self.__call__(...args)")
		const self = this.bind(this)
		this.self = self
		return self
	}
}
