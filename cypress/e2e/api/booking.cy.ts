import type { Booking } from '../../types/booking';

describe('Restful Booker bookings', () => {
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

  it('creates, reads, updates, and deletes its own booking', () => {
    cy.fixture<Booking>('booking').then((bookingTemplate) => {
      const booking = {
        ...bookingTemplate,
        firstname: `Cypress-${Date.now()}`,
      };

      cy.apiCreateBooking(booking).then(({ status, body }) => {
        expect(status).to.equal(200);
        expect(body.booking).to.deep.equal(booking);
        bookingId = body.bookingid;

        cy.apiGetBooking(bookingId).then(({ status: getStatus, body: savedBooking }) => {
          expect(getStatus).to.equal(200);
          expect(savedBooking).to.deep.equal(booking);

          const updatedBooking: Booking = {
            ...booking,
            firstname: `${booking.firstname}-Updated`,
            totalprice: 225,
          };

          cy.apiUpdateBooking(bookingId!, token, updatedBooking).then(
            ({ status: updateStatus, body: updateBody }) => {
              expect(updateStatus).to.equal(200);
              expect(updateBody).to.deep.equal(updatedBooking);

              cy.apiGetBooking(bookingId!).then(({ body: verifiedBooking }) => {
                expect(verifiedBooking).to.deep.equal(updatedBooking);

                cy.apiDeleteBooking(bookingId!, token).then(
                  ({ status: deleteStatus }) => {
                    expect(deleteStatus).to.equal(201);
                    bookingId = undefined;
                  },
                );
              });
            },
          );
        });
      });
    });
  });

  it('updates only the requested fields with PATCH', () => {
    cy.fixture<Booking>('booking').then((bookingTemplate) => {
      const booking = {
        ...bookingTemplate,
        firstname: `Cypress-${Date.now()}`,
      };

      cy.apiCreateBooking(booking).then(({ body }) => {
        bookingId = body.bookingid;
        const partialUpdate = {
          firstname: `${booking.firstname}-Updated`,
          totalprice: 200,
        };

        cy.apiPatchBooking(bookingId, token, partialUpdate).then(
          ({ status, body: updatedBooking }) => {
            expect(status).to.equal(200);
            expect(updatedBooking).to.deep.equal({
              ...booking,
              ...partialUpdate,
            });

            cy.apiGetBooking(bookingId!).then(({ body: savedBooking }) => {
              expect(savedBooking).to.deep.equal({
                ...booking,
                ...partialUpdate,
              });
            });
          },
        );
      });
    });
  });
});
