export class UnauthorizedError extends Error {
  statusCode: number;
  constructor(message?: string) {
    super(message); // Pass remaining arguments to parent constructor
    this.name = "UnauthorizedError"; // Custom name
    this.statusCode = 401;
    Object.setPrototypeOf(this, UnauthorizedError.prototype); // Set the prototype explicitly.
  }
}
