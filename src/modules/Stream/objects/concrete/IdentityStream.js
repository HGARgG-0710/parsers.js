import { Pools } from "../../../../global.js"
import { Poolable } from "../../../../objects.js"
import { mixin } from "../../../mixin.js"
import { ObjectPool } from "../../../objects/ObjectPool.js"
import { PipeStream, SyncStream } from "../templates.js"

export const IdentityStream = new mixin(
	{
		name: "IdentityStream",
		static: {
			pool: (classObj) => Pools.Stream.add(new ObjectPool(classObj))
		},
		properties: {
			get pool() {
				return this.constructor.pool
			}
		},
		constructor(resource) {
			this.super.PipeStream.constructor.call(this, resource)
		}
	},
	[PipeStream, SyncStream, Poolable]
).toClass()
