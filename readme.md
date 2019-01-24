# Budget planner: Nginx, VueJS, MongoDB and Express + GraphQL

## Development Mode
Start in development mode with `docker-compose -f docker-compose.dev.yaml up --build` create three containers. First we will
start nginx to proxy requests. A container running `webpack-dev-server` will handle default requests. Finally, a container 
running NodeJS and Express will handle requests to `/api`.


## Production Mode
Start in "production" mode with `docker-compose up --build` create three containers. First we will
start nginx to proxy requests. A container will bundle the static site by calling `yarn build`. Finally, a container 
running NodeJS and Express will handle requests to `/api`.
