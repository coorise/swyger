import { Router as ExpressRouter } from 'express';

/**
 * Router base class
 */
export abstract class Router {

  /**
   * @description Wrapped Express.Router
   */
    // @ts-ignore
  router: ExpressRouter = null;

  constructor() {
    this.router = ExpressRouter();
    this.define();
  }

  define(): void {}
}
