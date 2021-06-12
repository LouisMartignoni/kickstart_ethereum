// fichier qui crée dynamiquement les urls avec les ids des campaigns

const routes = require('next-routes')(); //particularité du package

routes.add('/campaigns/new', '/campaigns/new') //protege le path campaigns/new du add suivant
      .add('/campaigns/:address', '/campaigns/show')// (pattern, route) ici address mais on aurait pu mettre un autre nom (ex ça casse campaigns/new)
      .add('/campaigns/:address/requests', '/campaigns/requests/index')
      .add('/campaigns/:address/requests/new', '/campaigns/requests/new');

module.exports = routes;
