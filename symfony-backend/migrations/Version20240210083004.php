<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20240210083004 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Add capacity to meeting room.';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('ALTER TABLE meeting_room ADD capacity INT NOT NULL');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('ALTER TABLE meeting_room DROP capacity');
    }
}
