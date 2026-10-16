import type { Booking } from '../types/booking';

declare global {
  namespace Cypress {
    interface Chainable {
      apiAuthenticate(username: string, password: string): Chainable<Cypress.Response<{ token?: string; reason?: string }>>;
      apiCreateBooking(booking: Booking): Chainable<Cypress.Response<{ bookingid: number; booking: Booking }>>;
      apiGetBooking(bookingId: number | string, allowHttpErrors?: boolean): Chainable<Cypress.Response<Booking>>;
      apiUpdateBooking(bookingId: number, token: string, booking: Booking, allowHttpErrors?: boolean): Chainable<Cypress.Response<Booking>>;
      apiPatchBooking(bookingId: number, token: string, booking: Partial<Booking>, allowHttpErrors?: boolean): Chainable<Cypress.Response<Booking>>;
      apiDeleteBooking(bookingId: number, token: string, allowHttpErrors?: boolean): Chainable<Cypress.Response<unknown>>;
      loginSauceDemo(username: string, password: string): Chainable<JQuery<HTMLElement>>;
    }
  }
}

export {};
