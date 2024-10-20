import type { SubHaving } from "./interfaces.js"

export abstract class BasicSubHaving<Type = any> implements SubHaving<Type> {
	sub: Type
	constructor(sub: Type) {
		this.sub = sub
	}
}
