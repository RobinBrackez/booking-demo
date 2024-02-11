<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20240211132239 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('ALTER TABLE booking DROP CONSTRAINT fk_e00ceddef4a5bd90');
        $this->addSql('DROP TABLE "user"');
        $this->addSql('DROP INDEX idx_e00ceddef4a5bd90');
        $this->addSql('ALTER TABLE booking DROP booked_by_id');
        $this->addSql('ALTER TABLE booking ALTER starts_at TYPE TIMESTAMP(0) WITHOUT TIME ZONE');
        $this->addSql('ALTER TABLE booking ALTER ends_at TYPE TIMESTAMP(0) WITHOUT TIME ZONE');
        $this->addSql('COMMENT ON COLUMN booking.starts_at IS \'(DC2Type:datetime_immutable)\'');
        $this->addSql('COMMENT ON COLUMN booking.ends_at IS \'(DC2Type:datetime_immutable)\'');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('DROP SEQUENCE meeting_room_id_seq CASCADE');
        $this->addSql('CREATE TABLE "user" (id INT NOT NULL, email VARCHAR(255) NOT NULL, PRIMARY KEY(id))');
        $this->addSql('ALTER TABLE booking ADD booked_by_id INT NOT NULL');
        $this->addSql('ALTER TABLE booking ALTER starts_at TYPE TIMESTAMP(0) WITHOUT TIME ZONE');
        $this->addSql('ALTER TABLE booking ALTER ends_at TYPE TIMESTAMP(0) WITHOUT TIME ZONE');
        $this->addSql('COMMENT ON COLUMN booking.starts_at IS NULL');
        $this->addSql('COMMENT ON COLUMN booking.ends_at IS NULL');
        $this->addSql('ALTER TABLE booking ADD CONSTRAINT fk_e00ceddef4a5bd90 FOREIGN KEY (booked_by_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('CREATE INDEX idx_e00ceddef4a5bd90 ON booking (booked_by_id)');
    }
}
