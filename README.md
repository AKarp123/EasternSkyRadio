# Eastern Sky Radio

[Live Site](https://easternskyradio.xyz)

This repository contains the source code for the Eastern Sky radio website, my radio show hosted on 90.3 The Core!

> Can I copy this for my own show? 

Yes! Feel free to copy/clone whatever but I would appreciate if you linked back to this and gave credit :)


### Running:
See `docker-compose.example.yml` for an example production setup.
You can also add a local mongodb instance but update the env to make sure it finds the correct one

## Developing

run `docker compose up`

## Testing
test suite is in `server/src/tests`
run `docker compose -f docker-compose.test.yml up`

## Creating Migrations

`docker exec -it easternskyradio-server-1 bun migrate create <migration_name>`




