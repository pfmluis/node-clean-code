export class ServerError extends Error {
  constructor() {
    super(`Internal server wrong`)
    this.name = 'ServerError'
  }
}