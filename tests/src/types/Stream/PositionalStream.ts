import { InputStream, PositionalStream } from "../../../../dist/main.js"

const ps = PositionalStream(InputStream("Siegbrau..."))
while (!ps.isEnd()) {
	console.log()
	console.log(ps.curr())
	console.log(ps.next())
	console.log(ps.pos)
	console.log(ps.input.pos)
}

console.log(ps.input.isEnd())
