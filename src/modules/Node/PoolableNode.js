import { mixin } from "../../mixin.js"
import { Poolable } from "../../objects/Poolable.js"
import { BaseNode } from "./BaseNode.js"

export const PoolableNode = new mixin(
	{
		name: "PoolableNode",
		properties: {
			postFree() {
				this.resetParent()
			}
		},
		constructor(...args) {
			this.super.Poolable.constructor.call(this, ...args)
		}
	},
	[BaseNode, Poolable]
).toClass()
