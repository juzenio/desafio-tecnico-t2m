import type { Booking } from '../../types/booking';

describe('Restful Booker negative booking scenarios', () => {
  let token: string;
  let bookingId: number | undefined;

  beforeEach(() => {
    cy.apiAuthenticate(
      Cypress.env('restfulBookerUsername'),
      Cypress.env('restfulBookerPassword'),
    ).then(({ body }) => {
      if (!body.token) {
        throw new Error('Authentication did not return a token');
      }
      token = body.token;
    });
  });

  afterEach(() => {
    if (bookingId === undefined) {
      return;
    }

    cy.apiDeleteBooking(bookingId, token, true).then(({ status }) => {
      expect([201, 404]).to.include(status);
      bookingId = undefined;
    });
  });

  it('rejects updates and deletions with an invalid token', () => {
    cy.fixture<Booking>('booking').then((bookingTemplate) => {
      const booking = {
        ...bookingTemplate,
        firstname: `Cypress-${Date.now()}`,
      };

      cy.apiCreateBooking(booking).then(({ body }) => {
        bookingId = body.bookingid;

        cy.apiUpdateBooking(
          bookingId,
          'invalid-token',
          { ...booking, firstname: 'Unauthorized update' },
          true,
        ).then(({ status }) => {
          expect(status).to.equal(403);

          cy.apiDeleteBooking(bookingId!, 'invalid-token', true).then(
            ({ status: deleteStatus }) => {
              expect(deleteStatus).to.equal(403);
              cy.apiGetBooking(bookingId!).then(({ body: savedBooking }) => {
                expect(savedBooking).to.deep.equal(booking);
              });
            },
          );
        });
      });
    });
  });

  it('returns not found for a non-numeric booking identifier', () => {
    cy.apiGetBooking('not-a-booking-id', true).then(({ status }) => {
      expect(status).to.equal(404);
    });
  });
});
