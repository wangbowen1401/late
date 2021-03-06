const app = require('./server');
const config = require('config');

const logger = require('./server/logger');

// Grab server configuration from proper config file depending on environment
const port = config.get('server.port');
const host = config.get('server.host');
app.listen(port, host);

logger.info(
  `Server running on host ${host} on port ${port}\nGo to http://localhost:${port} to view.`
);
