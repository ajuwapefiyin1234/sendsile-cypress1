const fs = require('fs');
try {
  require('./cypress/e2e/sendsile-simple.cy.js');
  console.log('File syntax is valid');
} catch(e) {
  console.error('Syntax error:', e.message);
}
