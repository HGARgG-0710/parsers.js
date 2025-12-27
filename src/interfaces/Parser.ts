import type { Summat } from "@hgargg-0710/summat.ts"
import type { IParseStream } from "./Stream.js"

export type IParseStreamMaker<Init = any, Out = any> = (
	getState?: () => Summat
) => (input: Init) => IParseStream<Out>
