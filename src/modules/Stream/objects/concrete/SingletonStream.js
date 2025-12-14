import { Pools } from "../../../../global.js"
import { mixin } from "../../../../mixin.js"
import { ObjectPool } from "../../../../objects.js"
import { ownerInitializer } from "../../Initializer/objects/OwnerInitializer.js"
import { TrivialStream } from "../templates.js"
import { CustomLinkedStream } from "../templates/CustomLinkedStream.js"

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

			baseInit(resource) {
				this.curr = this.handler(resource)
			},

			setHandler(handler) {
				this.handler = handler
				return this
			}
		},
		constructor(resource) {
			this.super.OwningStream.constructor.call(this, resource)
		}
	},
	[CustomLinkedStream, TrivialStream]
).toClass()

export function SingletonStream(handler) {
	return function (resource) {
		return _SingletonStream.pool.create().setHandler(handler).init(resource)
	}
}

SingletonStream.pool = _SingletonStream.pool
