import type { Booking } from '../types/booking';

Cypress.Commands.add('apiAuthenticate', (username: string, password: string) =>
  cy.api({
    method: 'POST',
    url: `${Cypress.env('apiUrl')}/auth`,
    body: { username, password },
  }),
);

Cypress.Commands.add('apiCreateBooking', (booking: Booking) =>
  cy.api({
    method: 'POST',
    url: `${Cypress.env('apiUrl')}/booking`,
    body: booking,
  }),
);

Cypress.Commands.add('apiGetBooking', (bookingId: number | string, allowHttpErrors = false) =>
  cy.api({
    method: 'GET',
    url: `${Cypress.env('apiUrl')}/booking/${bookingId}`,
    failOnStatusCode: !allowHttpErrors,
  }),
);

Cypress.Commands.add('apiUpdateBooking', (bookingId: number, token: string, booking: Booking, allowHttpErrors = false) =>
  cy.api({
    method: 'PUT',
    url: `${Cypress.env('apiUrl')}/booking/${bookingId}`,
    headers: { Cookie: `token=${token}` },
    body: booking,
    failOnStatusCode: !allowHttpErrors,
  }),
);

Cypress.Commands.add('apiPatchBooking', (bookingId: number, token: string, booking: Partial<Booking>, allowHttpErrors = false) =>
  cy.api({
    method: 'PATCH',
    url: `${Cypress.env('apiUrl')}/booking/${bookingId}`,
    headers: { Cookie: `token=${token}` },
    body: booking,
    failOnStatusCode: !allowHttpErrors,
  }),
);

Cypress.Commands.add('apiDeleteBooking', (bookingId: number, token: string, allowHttpErrors = false) =>
  cy.api({
    method: 'DELETE',
    url: `${Cypress.env('apiUrl')}/booking/${bookingId}`,
    headers: { Cookie: `token=${token}` },
    failOnStatusCode: !allowHttpErrors,
  }),
);
