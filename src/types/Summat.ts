export interface Summat<Type = any> {
	[x: string | symbol | number]: Type
}
export type SummatFunction<In = any, Out = any> = (...args: In[]) => Out
