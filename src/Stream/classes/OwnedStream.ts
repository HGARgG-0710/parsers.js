import { DelegateStream } from "../../internal/DelegateStream.js"
import type { IStream } from "../interfaces.js"

export class OwnedStream<Type = any> extends DelegateStream<Type> {
	owner?: IStream<Type>

	claimBy(owner: IStream<Type>) {
		this.owner = owner
	}
}
