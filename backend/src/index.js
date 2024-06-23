const express = require('express');
const cors = require('cors');
const app = express();
const passport = require('passport');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const db = require('./db/models');
const config = require('./config');
const swaggerUI = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');

const authRoutes = require('./routes/auth');
const fileRoutes = require('./routes/file');
const searchRoutes = require('./routes/search');

const openaiRoutes = require('./routes/openai');

const usersRoutes = require('./routes/users');

const agentsRoutes = require('./routes/agents');

const applicationsRoutes = require('./routes/applications');

const availabilityRoutes = require('./routes/availability');

const event_organizersRoutes = require('./routes/event_organizers');

const eventsRoutes = require('./routes/events');

const jobsRoutes = require('./routes/jobs');

const musiciansRoutes = require('./routes/musicians');

const rsvpsRoutes = require('./routes/rsvps');

const venuesRoutes = require('./routes/venues');

const rolesRoutes = require('./routes/roles');

const permissionsRoutes = require('./routes/permissions');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      version: '1.0.0',
      title: 'Musicians Network',
      description:
        'Musicians Network Online REST API for Testing and Prototyping application. You can perform all major operations with your entities - create, delete and etc.',
    },
    servers: [
      {
        url: config.swaggerUrl,
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      responses: {
        UnauthorizedError: {
          description: 'Access token is missing or invalid',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/routes/*.js'],
};

const specs = swaggerJsDoc(options);
app.use(
  '/api-docs',
  function (req, res, next) {
    swaggerUI.host = req.get('host');
    next();
  },
  swaggerUI.serve,
  swaggerUI.setup(specs),
);

app.use(cors({ origin: true }));
require('./auth/auth');

app.use(bodyParser.json());

app.use('/api/auth', authRoutes);
app.use('/api/file', fileRoutes);
app.enable('trust proxy');

app.use(
  '/api/users',
  passport.authenticate('jwt', { session: false }),
  usersRoutes,
);

app.use(
  '/api/agents',
  passport.authenticate('jwt', { session: false }),
  agentsRoutes,
);

app.use(
  '/api/applications',
  passport.authenticate('jwt', { session: false }),
  applicationsRoutes,
);

app.use(
  '/api/availability',
  passport.authenticate('jwt', { session: false }),
  availabilityRoutes,
);

app.use(
  '/api/event_organizers',
  passport.authenticate('jwt', { session: false }),
  event_organizersRoutes,
);

app.use(
  '/api/events',
  passport.authenticate('jwt', { session: false }),
  eventsRoutes,
);

app.use(
  '/api/jobs',
  passport.authenticate('jwt', { session: false }),
  jobsRoutes,
);

app.use(
  '/api/musicians',
  passport.authenticate('jwt', { session: false }),
  musiciansRoutes,
);

app.use(
  '/api/rsvps',
  passport.authenticate('jwt', { session: false }),
  rsvpsRoutes,
);

app.use(
  '/api/venues',
  passport.authenticate('jwt', { session: false }),
  venuesRoutes,
);

app.use(
  '/api/roles',
  passport.authenticate('jwt', { session: false }),
  rolesRoutes,
);

app.use(
  '/api/permissions',
  passport.authenticate('jwt', { session: false }),
  permissionsRoutes,
);

app.use(
  '/api/openai',
  passport.authenticate('jwt', { session: false }),
  openaiRoutes,
);

app.use(
  '/api/search',
  passport.authenticate('jwt', { session: false }),
  searchRoutes,
);

const publicDir = path.join(__dirname, '../public');

if (fs.existsSync(publicDir)) {
  app.use('/', express.static(publicDir));

  app.get('*', function (request, response) {
    response.sendFile(path.resolve(publicDir, 'index.html'));
  });
}

const PORT = process.env.PORT || 8080;

db.sequelize.sync().then(function () {
  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });
});

module.exports = app;
