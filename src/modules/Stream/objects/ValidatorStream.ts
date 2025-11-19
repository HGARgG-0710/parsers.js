import { Pools } from "../../../global.js"
import type { ICommonStream, IPoolKeeping } from "../../../interfaces.js"
import { ObjectPool } from "../../../objects.js"
import type { IOwnedStream } from "../interfaces/OwnedStream.js"
import type { IValidator } from "../interfaces/ValidatorStream.js"
import { IdentityStream } from "./IdentityStream.js"

function BuildValidatorStream<T = any>(validator: IValidator<T>) {
	return class ValidatorStream extends IdentityStream<T> {
		static readonly pool = Pools.Stream.add(new ObjectPool(ValidatorStream))

		private readonly validator: IValidator<T>

		protected get pool() {
			return ValidatorStream.pool
		}

		next(): void {
			this.validator(this.resource!)
			super.next()
		}

		constructor(resource?: IOwnedStream<T>) {
			super(resource)
			this.validator = validator
		}
	} as IPoolKeeping<ICommonStream<T>>
}

/**
 * This is a factory-function for `ICommonStream<T>` isntances
 * that perform the `validator.call(this, this.resource)` with
 * `this` being the new `ICommonStream<T>` instance.
 */
export function ValidatorStream<T = any>(validator: IValidator<T>) {
	const validatorStream = BuildValidatorStream(validator)

	function V(resource?: IOwnedStream<T>) {
		return validatorStream.pool.create(resource)
	}

	V.pool = validatorStream.pool

	return V
}
