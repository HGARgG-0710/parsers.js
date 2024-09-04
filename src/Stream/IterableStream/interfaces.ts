import type { SummatIterable } from "@hgargg-0710/summat.ts"
import type { BasicStream } from "_src/types.js"

export type IterableStream<Type = any> = BasicStream<Type> & SummatIterable<Type>
