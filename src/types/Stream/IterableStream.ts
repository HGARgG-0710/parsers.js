import type { SummatIterable } from "main.js"
import type { BasicStream } from "./BasicStream.js"
export type IterableStream<Type = any> = BasicStream<Type> & SummatIterable<Type>
