export interface IEndingProvider<T = any> {
	readonly forItem: T
	isEnd(): boolean
	with(item: T): IEndingProvider<T>
	isCurrEnd?(): boolean
}
