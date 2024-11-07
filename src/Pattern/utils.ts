import type { Pattern } from "./interfaces.js"
export const value = <Type = any>(x: Pattern<Type>) => x.value
export const setValue = <Type = any>(x: Pattern<Type>, value: Type) => (x.value = value)
