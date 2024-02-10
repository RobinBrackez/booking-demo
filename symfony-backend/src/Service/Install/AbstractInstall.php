<?php

namespace App\Service\Install;

use Doctrine\ORM\EntityManagerInterface;
use Psr\Log\LoggerInterface;

abstract class AbstractInstall
{
    protected const array REQUIRED_FIELDS = [];

    public function __construct(
        private string $jsonFilePath,
        protected EntityManagerInterface $entityManager,
        protected LoggerInterface $logger
    ) {}

    public function execute(): void
    {
        // deserialize the bookings from the json file
        $jsonData = json_decode(file_get_contents($this->jsonFilePath), true);

        foreach ($jsonData as $i => $entityData) {
            // check if every field exists
            foreach (self::REQUIRED_FIELDS as $field) {
                if (!array_key_exists($field, $entityData)) {
                    throw new \Exception(sprintf('Field %s is missing in %s, record %d', $field, $this->jsonFilePath, $i));
                }
            }

            $entity = $this->createEntity($entityData);
            if ($entity) { // null means it already exists
                try {
                    $this->entityManager->persist($entity);
                    $this->entityManager->flush();
                } catch (\Exception $e) {
                    $this->logger->error($e->getMessage());
                }
            }
        }
    }

    abstract protected function createEntity(array $entityData);
}
