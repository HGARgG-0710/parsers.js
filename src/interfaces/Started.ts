import type { Summat } from "@hgargg-0710/summat.ts"

import { object, typeof as type } from "@hgargg-0710/one"
const { structCheck } = object
const { isBoolean } = type

export interface Started extends Summat {
	isStart: boolean
}

export const isStarted = structCheck<Started>({ isStart: isBoolean })
