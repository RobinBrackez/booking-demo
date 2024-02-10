<?php

namespace App\Service\Install;

use App\Entity\MeetingRoom;
use App\Repository\MeetingRoomRepository;
use App\Service\Install\Contracts\InstallInterface;
use Doctrine\ORM\EntityManagerInterface;
use Psr\Log\LoggerInterface;

/**
 * Create MeetingRoom entities from a json file. This is mainly used to bootstrap the project.
 * Running it twice, won't create duplicate records.
 */
class InstallMeetingRooms extends AbstractInstall implements InstallInterface
{
    private const string ID_FIELD = 'id';
    private const string NAME_FIELD = 'name';
    private const string CAPACITY_FIELD = 'capacity';
    protected const array REQUIRED_FIELDS = [self::ID_FIELD, self::NAME_FIELD, self::CAPACITY_FIELD];

    public function __construct(
        string $jsonFilePath,
        EntityManagerInterface $entityManager,
        LoggerInterface $logger,
        private MeetingRoomRepository $meetingRoomRepository
    ) {
        parent::__construct($jsonFilePath, $entityManager, $logger);
    }

    #[\Override]
    protected function createEntity(array $entityData): ?MeetingRoom
    {
        $meetingRoom = $this->meetingRoomRepository->find($entityData[self::ID_FIELD]);
        if ($meetingRoom) {
            return null;
        }

        $meetingRoom = new MeetingRoom();
        $meetingRoom->setName($entityData[self::NAME_FIELD]);
        $meetingRoom->setCapacity($entityData[self::CAPACITY_FIELD]);
        $this->logger->info(sprintf('Create meeting room %s', $meetingRoom->getName()));

        return $meetingRoom;
    }
}
