import type {
	IFreeable,
	IOwnedStream,
	IPoolGetter
} from "../../../interfaces.js"
import { ownerInitializer } from "../../Initializer/classes/OwnerInitializer.js"
import { WrapperStream } from "./WrapperStream.js"

const freeStreamInitializer = {
	init(
		target: FreeStream,
		resource?: IOwnedStream,
		poolGetter?: IPoolGetter
	) {
		ownerInitializer.init(target, resource)
		if (poolGetter) target.setPoolGetter(poolGetter)
	}
}

export class FreeStream<Type extends IFreeable = any> extends WrapperStream<
	Type,
	[]
> {
	private poolGetter: IPoolGetter
	private freeable: Type | null = null

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
}
