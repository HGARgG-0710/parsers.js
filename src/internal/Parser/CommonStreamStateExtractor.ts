import { object } from "@hgargg-0710/one"
import type { Summat } from "@hgargg-0710/summat.ts"
import type { IBaseState } from "../../interfaces.js"
import {
	LoopPropertiesGetterState,
	NextPropertiesGetterState,
	PropertiesGetter
} from "./PropertiesGetter.js"
import { StateList } from "./StateList.js"
import type { IStreamProvider } from "./StreamProvider.js"

export class CommonStreamStateExtractor<T = any> {
	private readonly lastStreamCommonStateExtractor = new PropertiesGetter(
		new StateList(
			new NextPropertiesGetterState(() => this.getState()),
			new LoopPropertiesGetterState(() =>
				this.lastCommonStateExtractDefined()
			)
		)
	)

	private readonly filterCommonState = object.withoutProperties(
		"parse",
		"errData"
	)

	private lastCommonStateExtractDefined(): Summat {
		return this.filterCommonState(
			this.owner.lastStream().state
		) as IBaseState
	}

	fromCurr(): IBaseState {
		return this.filterCommonState(
			this.owner.currStream().state
		) as IBaseState
	}

	fromLast(): Summat {
		return this.lastStreamCommonStateExtractor.get()
	}

	constructor(
		private readonly getState: () => Summat,
		private readonly owner: IStreamProvider<T>
	) {}
}
