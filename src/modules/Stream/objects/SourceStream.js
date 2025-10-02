import { resourceInitializer } from "../../Initializer/objects/ResourceInitializer.js"
import { BasicStream } from "./BasicStream.js"

export class SourceStream extends BasicStream {
	updateCurr() {
		this.update(this.currGetter())
	}

	baseNextIter() {
		return this.currGetter()
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
}
