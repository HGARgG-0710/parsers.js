import { Pools } from "../../../../../main.js"
import { mixin } from "../../../../mixin.js"
import { ObjectPool } from "../../../../objects.js"
import { PoolableStream, PosHavingStream } from "../templates.js"
import { IdentityStream } from "./IdentityStream.js"

export const PosStream = new mixin(
	{
		name: "PosStream",
		static: {
			pool: (classObj) => Pools.Stream.add(new ObjectPool(classObj))
		},
		properties: {
			get pool() {
				return this.constructor.pool
			},

			next() {
				this.super.IdentityStream.next.call(this)
				this.super.PosHavingStream.next.call(this)
			}
		},
		constructor(resource) {
			this.super.PosHavingStream.constructor.call(this)
			this.super.IdentityStream.constructor.call(this, resource)
		}
	},
	[],
	[IdentityStream, PosHavingStream, PoolableStream]
).toClass()
