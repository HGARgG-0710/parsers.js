import type { Summat } from "@hgargg-0710/summat.ts"

import { object, typeof as type } from "@hgargg-0710/one"
const { structCheck } = object
const { isFunction } = type

export interface Flushable extends Summat {
	flush(): void
}

export const isFlushable = structCheck<Flushable>({ flush: isFunction })
