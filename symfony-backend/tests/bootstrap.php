<?php

use Symfony\Component\Dotenv\Dotenv;

require dirname(__DIR__).'/vendor/autoload.php';

if (method_exists(Dotenv::class, 'bootEnv')) {
    (new Dotenv())->bootEnv(dirname(__DIR__).'/.env');
}

if ($_SERVER['APP_DEBUG']) {
    umask(0000);
}

echo 'bootstrap loaded';

if ('test' == $_ENV['APP_ENV']) {
    /*    echo "Clear Test Log ('nonexistant directory'-error can be ignored)\n";
        passthru(sprintf(
            '> ./var/log/test.log'
        ));
        echo "Require symfony runtime\n";
        passthru(sprintf(
            'composer require symfony/runtime:^6.4'
        ));*/
    echo "Delete TestDB if exists\n";
    passthru(sprintf(
        './bin/console doctrine:database:drop --force --env=test -vvv'
    ));
    echo "Creating TestDB\n";
    passthru(sprintf(
        './bin/console doctrine:database:create --env=test -vvv'
    ));
    echo "Test DB Created, running migrations\n";
    passthru(sprintf(
        './bin/console doctrine:migrations:migrate --env=test --no-interaction -vvv'
    ));
    echo "Migrations successfully executed, running install scripts\n";
    passthru(sprintf(
        './bin/console app:install --bookings --meeting-rooms -vvv'
    ));

    echo "Ready for testing\n";
}
