# Eastern Sky Radio

[Live Site](https://easternskyradio.xyz)

This repository contains the source code for the Eastern Sky radio website, my radio show hosted on 90.3 The Core!

> Can I copy this for my own show? 

Yes! Feel free to copy/clone whatever but I would appreciate if you linked back to this and gave credit :)


### Running with docker compose, use the docker-compose.yml file:
```docker-compose

services:
  backend:
    image: kawambiit/esr-backend:dev-latest
    ports:
      - "8000:3000"
    env_file:
      - stack.env
  frontend:
    image: kawambiit/esr-frontend:dev-latest
    ports:
      - "8080:80"
    depends_on:
      - backend
```
You can also add a local mongodb instance but update the env to make sure it finds the correct one

##Developing

run `docker compose -f docker-compose.dev.yml up`

##Creating Migrations

`docker exec -it easternskyradio-server-1 bun migrate create <migration_name>`


