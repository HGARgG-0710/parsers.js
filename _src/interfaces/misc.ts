import type { Summat } from "@hgargg-0710/summat.ts"

export interface IndexingFunction<KeyType = any> extends Summat {
	(curr: KeyType, x: any): boolean
}

export interface HasType extends Summat {
	has(x: any): boolean
}

export interface TestType extends Summat {
	test(x: any): boolean
}
