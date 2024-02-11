<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20240211132619 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Add email';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('ALTER TABLE booking ADD email VARCHAR(255) NOT NULL');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('ALTER TABLE booking DROP email');
    }
}
