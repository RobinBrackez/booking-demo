# Booking demo

symfony new --api --version=6.4 --php=8.3 webapp2/


## Installation

git clone ...

set a custom database password inside the root `.env`

run:
`docker compose up`

This automatically runs migrations and installs demo data.

If you get into trouble with the docker boxes, you should execute these commands in the symfony docker container:
````
# only execute this if you run intro trouble with the installation scripts
composer install
./bin/console doctrine:migrations:migrate
./bin/console app:install --meeting-rooms --bookings
````

visit: https://localhost:8088


## Thoughts / Todo's:


* **Security**: website has no authentication system, so everyone can register a room in someone else's name. There's a User entity in the database, so it's extendable to add this feature.
* **Security**: api has no authentication system, anyone can fire requests

