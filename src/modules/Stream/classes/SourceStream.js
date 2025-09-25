import { tryCopy } from "../../../utils.js"
import { resourceInitializer } from "../../Initializer/classes/ResourceInitializer.js"
import { BasicStream } from "./BasicStream.js"

export class SourceStream extends BasicStream {
	updateCurr() {
		this.update(this.currGetter())
	}

	get initializer() {
		return resourceInitializer
	}

	initGetter() {
		return this.currGetter()
	}

	setResource(source) {
		this.source = source
	}

	copy() {
		return new this.constructor(tryCopy(this.source))
	}
}
