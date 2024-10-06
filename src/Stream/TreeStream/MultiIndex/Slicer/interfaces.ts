import type { Indexed } from "src/Stream/interfaces.js"
export type Slicer<T extends Indexed & object> = T & {
	reSlice: (from?: number, to?: number) => void
}
