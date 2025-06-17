Cypress.Commands.add('waitAndLogPayLoad', (payLoadName, response, timeout = 10000) => {
  cy.wait(payLoadName, { timeout: timeout }).then((payLoadResults) => {
    console.log(payLoadResults);
    expect(payLoadResults.response.statusCode).to.equal(response);
  });
});

Cypress.Commands.add('interceptPayLoadwithMethodAndPath', (methodType, pathInput, payLoadName) => {
  cy.intercept({ method: methodType, path: pathInput }).as(payLoadName);
});