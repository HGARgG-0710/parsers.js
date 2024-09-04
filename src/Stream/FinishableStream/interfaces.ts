import type { Summat } from "@hgargg-0710/summat.ts";
import type { BasicStream } from "_src/types.js";
import { type Finishable } from "src/interfaces/Finishable.js"


export interface Finishable<Type = any> extends Summat {
	finish(): Type
}export interface FinishableStream<Type = any>
	extends BasicStream<Type>, Finishable<Type> {
}

