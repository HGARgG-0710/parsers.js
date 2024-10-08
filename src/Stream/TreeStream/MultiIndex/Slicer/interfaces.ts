import type { Indexed } from "../../../interfaces.js"
export type Slicer<T extends Indexed & object> = T & {
	reSlice: (from?: number, to?: number) => void
}
