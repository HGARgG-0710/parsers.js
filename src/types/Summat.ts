export interface Summat<Type = any> {
	[x: string | symbol | number]: Type
}
export type SummatFunction<This = any, In = any, Out = any> = Summat &
	((this: This, ...args: In[]) => Out)

export type SummatIterable<Type = any> = Iterable<Type> & Summat
