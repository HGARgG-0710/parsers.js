import { Pools } from "../../../../main.js"
import { ObjectPool } from "../../../classes.js"
import { mixin } from "../../../mixin.js"
import { ownerInitializer } from "../../Initializer/objects/OwnerInitializer.js"
import { OwningStream } from "./OwningStream.js"
import { PreCommonStream } from "./PreCommonStream.js"
import { TrivialStream } from "./TrivialStream.js"

const _SingletonStream = new mixin(
	{
		name: "SingletonStream",
		static: {
			pool: (classObj) => Pools.Stream.add(new ObjectPool(classObj))
		},
		properties: {
			get initializer() {
				return ownerInitializer
			},

			setResource(resource) {
				this.super.OwningStream.setResource.call(this, resource)
				this.curr = this.handler(resource)
			},

			setHandler(handler) {
				this.handler = handler
				return this
			}
		},
		constructor(resource) {
			this.super.DyssyncOwningStream.constructor.call(this, resource)
		}
	},
	[],
	[PreCommonStream, OwningStream, TrivialStream]
).toClass()

export function SingletonStream(handler) {
	return function (resource) {
		return _SingletonStream.pool.create().setHandler(handler).init(resource)
	}
}

SingletonStream.pool = _SingletonStream.pool
