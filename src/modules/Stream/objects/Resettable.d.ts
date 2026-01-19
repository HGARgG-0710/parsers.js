import type { IFreeResettable, IOwnedStream } from "../../../interfaces.ts"
import type { OwnerResettable } from "../../../objects/Resettable.ts"

export declare abstract class LinkedResettable
	extends OwnerResettable
	implements IFreeResettable
{
	postFree(): void
	protected abstract set resource(newResource: IOwnedStream | null)
	protected resetResource(): void
}
