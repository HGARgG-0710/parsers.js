import type {
	ICopiable,
	IDefaulting,
	IDeletable,
	IRekeyable,
	ISettable,
	ISizeable
} from "../../../interfaces.js"

export interface IPreMap<K = any, V = any, Default = any>
	extends ISettable<K, V | Default>,
		IDeletable<K>,
		IRekeyable<K>,
		ISizeable,
		IDefaulting<Default>,
		ICopiable {
	get: (key: K) => V | Default
}
