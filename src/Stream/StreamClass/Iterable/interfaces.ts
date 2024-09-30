import type { SummatIterable } from "@hgargg-0710/summat.ts"
import type { BasicStream } from "../../BasicStream/interfaces.js"
export type IterableStream<Type = any> = BasicStream<Type> & SummatIterable<Type>
