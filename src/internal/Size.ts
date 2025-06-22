export class Size {
	inc() {
		++this.size
	}

	dec() {
		if (this.size > 0) --this.size
	}

	get() {
		return this.size
	}

	constructor(private size: number = 0) {}
}
