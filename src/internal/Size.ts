export class Size {
	inc() {
		++this.size
	}

	dec() {
		--this.size
	}
	
	get() {
		return this.size
	}

	constructor(private size: number = 0) {}
}
