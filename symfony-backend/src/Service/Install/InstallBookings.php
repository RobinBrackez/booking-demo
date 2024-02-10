<?php

namespace App\Service\Install;

use App\Entity\Booking;
use App\Entity\User;
use App\Repository\MeetingRoomRepository;
use App\Repository\UserRepository;
use App\Service\Install\Contracts\InstallInterface;
use Doctrine\ORM\EntityManagerInterface;
use Psr\Log\LoggerInterface;

class InstallBookings extends AbstractInstall implements InstallInterface
{
    private const string ID_FIELD = 'id';
    private const string STARTS_AT_FIELD = 'start_date';
    private const string ENDS_AT_FIELD = 'end_date';
    private const string ROOM_ID_FIELD = 'room_id';
    private const string BOOKED_BY_EMAIL_FIELD = 'booked_for';

    protected const array REQUIRED_FIELDS = [self::ID_FIELD, self::STARTS_AT_FIELD, self::ENDS_AT_FIELD, self::ROOM_ID_FIELD, self::BOOKED_BY_EMAIL_FIELD];

    public function __construct(
        string $jsonFilePath,
        EntityManagerInterface $entityManager,
        LoggerInterface $logger,
        private MeetingRoomRepository $meetingRoomRepository,
        private UserRepository $userRepository,
    ) {
        parent::__construct($jsonFilePath, $entityManager, $logger);
    }

    public function createEntity(array $entityData): ?Booking
    {
        $bookingRoom = $this->meetingRoomRepository->find($entityData[self::ID_FIELD]);
        if ($bookingRoom) {
            return null;
        }

        $booking = new Booking();
        $booking->setStartsAt(new \DateTimeImmutable($entityData[self::STARTS_AT_FIELD]));
        $booking->setEndsAt(new \DateTimeImmutable($entityData[self::ENDS_AT_FIELD]));

        $meetingRoom = $this->meetingRoomRepository->find($entityData[self::ROOM_ID_FIELD]);
        if (!$meetingRoom) {
            throw new \Exception(sprintf('Meeting room with id %d not found. Did you run the meetingroom install script?', $entityData[self::ROOM_ID_FIELD]));
        }

        $booking->setMeetingRoom($meetingRoom);
        $bookedByUser = $this->userRepository->findOneByEmail($entityData[self::BOOKED_BY_EMAIL_FIELD]);

        if (!$bookedByUser) {
            // auto create user, there's no separate install script for users
            $bookedByUser = new User();
            $bookedByUser->setEmail($entityData[self::BOOKED_BY_EMAIL_FIELD]);
            $this->logger->info(sprintf('User with email %s not found, auto creating', $entityData[self::BOOKED_BY_EMAIL_FIELD]));
            $this->entityManager->persist($bookedByUser);
        }

        $booking->setBookedBy($bookedByUser);
        $this->logger->info(sprintf('Booking created for user %s', $bookedByUser->getEmail()));

        return $booking;
    }
}
