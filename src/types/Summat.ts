export interface Summat<Type = any> {
	[x: string | symbol | number]: Type
}
export type SummatFunction<This = any, In = any, Out = any> = (
	this: This,
	...args: In[]
) => Out
// ? separate the 'summat' into a separate TypeScript library?

export type SummatIterable<Type = any> = Iterable<Type> & Summat
