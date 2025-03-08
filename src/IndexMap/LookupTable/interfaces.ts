import type { HashMap } from "../HashMap/interfaces.js"
import type { Deletable } from "src/interfaces.js"
import type { Settable } from "src/interfaces.js"
import type { Rekeyable } from "src/interfaces.js"

export interface LookupTable<KeyType = any, ValueType = any, OwningType = any>
	extends Rekeyable<KeyType>,
		Settable<KeyType, ValueType>,
		Deletable<KeyType> {
	getIndex: (x: any) => OwningType
	own: (x: any, ownType: OwningType) => void
	byOwned: (x: any) => ValueType
	isOwned: (x: any) => boolean
}

export type TableConstructor<OwningType = any> = new <KeyType = any, ValueType = any>(
	hash: HashMap<KeyType, ValueType>
) => LookupTable<KeyType, ValueType, OwningType>
