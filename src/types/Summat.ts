export interface Summat<Type = any> {
	[x: string | symbol | number]: Type
}
export type SummatFunction<In = any, Out = any> = (...args: In[]) => Out
// ? separate the 'summat' into a separate TypeScript library?

export type SummatIterable<Type = any> = Iterable<Type> & Summat
