import { mixin } from "../../../../mixin.js"
import { Stateful } from "../../../../objects.js"
import { ProxyStream } from "../templates/ProxyStream.js"

export const ErrorStream = new mixin(
	{
		name: "ErrorStream",
		properties: {
			wrapInHandler(callback) {
				try {
					return callback()
				} catch (err) {
					this.errHandler(err)
				}
			},

			next() {
				this.wrapInHandler(() => this.super.ProxyStream.next())
			},

			baseInit() {
				this.wrapInHandler(() => this.super.ProxyStream.baseInit())
			},

			setState(state) {
				this.super.ProxyStream.setState(state)
				this.super.Stateful.setState(state)
			}
		},
		constructor(delegate) {
			this.super.ProxyStream.constructor.call(this, delegate)
		}
	},
	[ProxyStream, Stateful]
).toClass()
