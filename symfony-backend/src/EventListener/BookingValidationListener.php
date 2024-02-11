<?php

namespace App\EventListener;

use App\Entity\Booking;
use App\Exception\DoubleBookingException;
use App\Exception\OutOfRangeBookingException;
use Doctrine\Bundle\DoctrineBundle\Attribute\AsEntityListener;
use Doctrine\ORM\Event\PrePersistEventArgs;
use Doctrine\ORM\Events;

#[AsEntityListener(event: Events::prePersist, method: 'validateBooking', entity: Booking::class)]
class BookingValidationListener
{
    private \DateTime $allowedStartDate;
    private \DateTime $allowedEndDate;

    public function __construct(string $allowedStartDate, string $allowedEndDate)
    {
        $this->allowedStartDate = new \DateTime($allowedStartDate);
        $this->allowedEndDate = new \DateTime($allowedEndDate);
    }

    public function validateBooking(Booking $booking, PrePersistEventArgs $args): void
    {
        if ($booking->getStartsAt() < $this->allowedStartDate || $booking->getEndsAt() > $this->allowedEndDate) {
            throw new OutOfRangeBookingException(sprintf('Booking outside of allowed time range. Allowed between: %s and %s', $this->allowedStartDate->format('Y-m-d H:i:s'), $this->allowedEndDate->format('Y-m-d H:i:s')));
        }
        if ($booking->getStartsAt()->format('Y-m-d') !== $booking->getEndsAt()->format('Y-m-d')) {
            throw new OutOfRangeBookingException('Booking can\'t take place over more than one day');
        }
        if ($booking->getStartsAt() > $booking->getEndsAt()) {
            throw new OutOfRangeBookingException('Start date cannot be after end date');
        }
        if ($booking->getStartsAt() === $booking->getEndsAt()) {
            throw new OutOfRangeBookingException('Start time cannot be equal to the end time');
        }
        $bookingRepository = $args->getObjectManager()->getRepository(Booking::class);
        $overlappingBooking = $bookingRepository->getOverlappingBooking($booking);

        if ($overlappingBooking !== null) {
            throw new DoubleBookingException($overlappingBooking);
        }
    }
}
