export function isWindows() {
	return process.platform === "win32"
}

export function isLinux() {
	return process.platform === "linux"
}

export function isDarwin() {
	return process.platform === "darwin"
}
