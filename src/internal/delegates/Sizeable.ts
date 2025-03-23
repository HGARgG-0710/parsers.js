import type { ISizeable } from "../../interfaces.js"

import { ProtectedPattern } from "../Pattern.js"

export abstract class DelegateSizeable<
	DelegateType extends ISizeable = any
> extends ProtectedPattern<DelegateType> {
	get size() {
		return this.value.size
	}
}
