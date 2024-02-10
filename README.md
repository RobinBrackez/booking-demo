# Booking demo

symfony new --api --version=6.4 --php=8.3 webapp2/


## Installation

git clone ...

1. set a custom database password inside the root `.env`
2. run `cd ./react-frontend` and `npm install`
3. go to the project root with  `cd ..` and run `docker compose up`

Docker automatically runs migrations and installs demo data.

If you run into trouble with the docker boxes, or use your custom boxes, you should execute these commands in the symfony docker container:
````
# only execute this inside the symfony container if the regular installation procedure doesn't work
composer install
./bin/console doctrine:migrations:migrate
./bin/console app:install --meeting-rooms --bookings
````

visit: https://localhost:8088

For new development, copy the commit hooks to automatically apply php-cs-fixer:
````
cp pre-commit .git/hooks/pre-commit
````

## Thoughts / Todo's:

* **Security**: website has no authentication system, so everyone can register a room in someone else's name. There's a User entity in the database, so it's extendable to add this feature.
* **Security**: api has no authentication system, anyone can fire requests

These features would go beyond the scope of this demo project.

