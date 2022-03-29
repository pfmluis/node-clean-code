export class ServerError extends Error {
  constructor(stack: string) {
    super(`Internal server wrong`)
    this.name = 'ServerError'
    this.stack = stack
  }
}