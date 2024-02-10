<?php

namespace App\EventListener;

use App\Entity\Booking;
use App\Exception\DoubleBookingException;
use Doctrine\Bundle\DoctrineBundle\Attribute\AsEntityListener;
use Doctrine\ORM\Event\PrePersistEventArgs;
use Doctrine\ORM\Events;

#[AsEntityListener(event: Events::prePersist, method: 'validateBooking', entity: Booking::class)]
class BookingValidationListener
{
    public function validateBooking(Booking $booking, PrePersistEventArgs $args): void
    {
        $bookingRepository = $args->getObjectManager()->getRepository(Booking::class);
        $overlappingBooking = $bookingRepository->getOverlappingBooking($booking);

        if ($overlappingBooking !== null) {
            throw new DoubleBookingException($overlappingBooking);
        }
    }
}
