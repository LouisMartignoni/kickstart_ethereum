// code qui vient du git de next-routes
// gère l'appel à routes pour créer les urls. le server est appelé pour gérer le lancement de next et non plus avoir le fonctionnement par defaut

const next = require('next')
const routes = require('./routes')
const app = next({dev: process.env.NODE_ENV !== 'production'})
const handler = routes.getRequestHandler(app)
const {createServer} = require('http')

app.prepare().then(() => {
  createServer(handler).listen(3000, err => {
    if (err) throw err;
    console.log('Ready on localhost:3000');
  });
});
