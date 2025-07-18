import { curr } from "../aliases/Stream.js"
import type { IHashClass } from "../interfaces.js"

export const currMap = <K = any, V = any, InternalKey = any, Default = any>(
	hashClass: IHashClass<K, V, InternalKey, Default>
) => hashClass.extend(curr)
