const jsonServer  = require('json-server');

const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

server.use(jsonServer.bodyParser);
server.use(middlewares);

server.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = router.db.get('users').find({ username, password }).value();

  if (user) {
    const token = generateRandomToken(); // Implement this function
    res.jsonp({ token });
  } else {
    res.status(401).jsonp({ error: 'Wrong username or password' });
  }
});

server.get('/files', (_, res) => {
  const files = router.db.get('files');

  console.log(files, 'files')

  if (files) {
    res.jsonp(files);
  } else {
    res.status(401).jsonp({ error: 'Something went wrong' });
  }
});

server.use(router);

const PORT = 5000;

server.listen(PORT, () => {
  console.log(`JSON Server is running on http://localhost:${PORT}`);
});

function generateRandomToken() {
  return Math.random().toString(36).substr(2);
}
