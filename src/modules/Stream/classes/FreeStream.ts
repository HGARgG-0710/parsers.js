import type {
	IFreeable,
	IOwnedStream,
	IPoolGetter
} from "../../../interfaces.js"
import { ownerInitializer } from "../../Initializer/classes/OwnerInitializer.js"
import { WrapperStream, WrapperStreamAnnotation } from "./WrapperStream.js"

const freeStreamInitializer = {
	init(
		target: FreeStreamAnnotation,
		resource?: IOwnedStream,
		poolGetter?: IPoolGetter
	) {
		ownerInitializer.init(target, resource)
		if (poolGetter) target.setPoolGetter(poolGetter)
	}
}

class FreeStreamAnnotation<T = any> extends WrapperStreamAnnotation<T> {
	setPoolGetter(poolGetter: IPoolGetter): void {}
}

function BuildFreeStream<T extends IFreeable = any>() {
	return class extends WrapperStream.generic!<T, [IPoolGetter]>() {
		private poolGetter: IPoolGetter
		private freeable: T | null = null

		private enqueueCurrForFreeing() {
			this.freeable = this.curr
		}

		private freeEnqueued() {
			this.freeable!.free(this.poolGetter)
			this.freeable = null
		}

		protected get initializer() {
			return freeStreamInitializer
		}

		setResource(resource: IOwnedStream) {
			super.setResource(resource)
			this.enqueueCurrForFreeing()
		}

		setPoolGetter(poolGetter: IPoolGetter) {
			this.poolGetter = poolGetter
		}

		next() {
			this.freeEnqueued()
			super.next()
			this.enqueueCurrForFreeing()
		}
	} as typeof FreeStreamAnnotation<T>
}

let freeStream: typeof FreeStreamAnnotation | null = null

function PreFreeStream<
	T extends IFreeable = any
>(): typeof FreeStreamAnnotation<T> {
	return freeStream
		? freeStream
		: (freeStream = BuildFreeStream<T>() as typeof FreeStreamAnnotation)
}

export const FreeStream: ReturnType<typeof PreFreeStream> & {
	generic?: typeof PreFreeStream
} = PreFreeStream()

FreeStream.generic = PreFreeStream
