import { Pools } from "../../../../main.js"
import { ObjectPool } from "../../../classes.js"
import { mixin } from "../../../mixin.js"
import { IdentityStream } from "./IdentityStream.js"
import { PoolableStream } from "./PoolableStream.js"
import { PosHavingStream } from "./PosHavingStream.js"

export const PosStream = new mixin(
	{
		name: "PosStream",
		static: {
			pool: (classObj) => Pools.Stream.add(new ObjectPool(classObj))
		},
		properties: {
			get pool() {
				return this.class.pool
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
