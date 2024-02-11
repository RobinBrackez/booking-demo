<?php

namespace App\Service\Install;

use App\Entity\Booking;
use App\Repository\BookingRepository;
use App\Repository\MeetingRoomRepository;
use App\Service\Install\Contracts\InstallInterface;
use Doctrine\ORM\EntityManagerInterface;
use Psr\Log\LoggerInterface;

/**
 * Create Booking entities from a json file. This is mainly used to bootstrap the project.
 * Running it twice, won't create duplicate records.
 */
class InstallBookings extends AbstractInstall implements InstallInterface
{
    private const string STARTS_AT_FIELD = 'start_date';
    private const string ENDS_AT_FIELD = 'end_date';
    private const string ROOM_ID_FIELD = 'room_id';
    private const string BOOKED_BY_EMAIL_FIELD = 'booked_for';

    protected const array REQUIRED_FIELDS = [self::STARTS_AT_FIELD, self::ENDS_AT_FIELD, self::ROOM_ID_FIELD, self::BOOKED_BY_EMAIL_FIELD];

    public function __construct(
        string $jsonFilePath,
        EntityManagerInterface $entityManager,
        LoggerInterface $logger,
        private MeetingRoomRepository $meetingRoomRepository,
        private BookingRepository $bookingRepository,
    ) {
        parent::__construct($jsonFilePath, $entityManager, $logger);
    }

    public function createEntity(array $entityData): ?Booking
    {
        $meetingRoom = $this->meetingRoomRepository->find($entityData[self::ROOM_ID_FIELD]);
        if (!$meetingRoom) {
            throw new \Exception(sprintf('Meeting room with id %d not found. Did you run the meetingroom install script?', $entityData[self::ROOM_ID_FIELD]));
        }

        $startsAt = new \DateTimeImmutable($entityData[self::STARTS_AT_FIELD]);
        $endsAt = new \DateTimeImmutable($entityData[self::ENDS_AT_FIELD]);

        $bookingRoom = $this->bookingRepository->findBooking($meetingRoom, $startsAt, $endsAt);
        if ($bookingRoom) {
            return null; // already booked
        }

        $booking = new Booking();
        $booking
            ->setStartsAt($startsAt)
            ->setEndsAt($endsAt)
            ->setMeetingRoom($meetingRoom)
            ->setEmail($entityData[self::BOOKED_BY_EMAIL_FIELD])
        ;

        $this->logger->info(sprintf('Create booking for user %s', $booking->getEmail()));

        return $booking;
    }
}
