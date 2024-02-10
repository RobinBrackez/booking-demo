<?php

namespace App\Service\Install\Contracts;

/**
 * Install datasets, a bit similar to fixtures.
 *
 * All install-sets should be able to be executed multiple times without creating duplicate records
 */
interface InstallInterface
{
    public function execute(): void;
}
