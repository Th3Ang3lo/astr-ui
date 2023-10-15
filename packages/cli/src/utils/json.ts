export function stringify<T>(data: T) {
  return JSON.stringify(data, null, 1)
}

export function parse(data: string) {
  return JSON.parse(data)
}
