import type { Summat } from "@hgargg-0710/summat.ts"

import { object } from "@hgargg-0710/one"
const { structCheck } = object

export interface Resulting<ResultType = any> extends Summat {
	result: ResultType
}

export const isResulting = structCheck<Resulting>(["result"])
