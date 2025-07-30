# Eastern Sky Radio

[Live Site](https://easternskyradio.xyz)

This repository contains the source code for the Eastern Sky radio website, my radio show hosted on 90.3 The Core!

> Can I copy this for my own show? 

Yes! Feel free to copy/clone whatever but I would appreciate if you linked back to this and gave credit :)


### Running with docker compose, use the docker-compose.yml file:
```docker-compose

services:
  easternskyradio:
    image: kawambiit/easternskyradio:latest
    ports:
      - "8000:3000"
    env_file:
      - stack.env
  caddy:
    image: kawambiit/esr-caddy:latest
    ports:
      - "8080:80"
    depends_on:
      - easternskyradio
```
You can also add a local mongodb instance but update the env to make sure it finds the correct one

##Developing

run `docker compose -f docker-compose.dev.yml up`


