<?php

namespace App\Exception;

use App\Entity\Booking;
use JetBrains\PhpStorm\Pure;

class DoubleBookingException extends \Exception
{
    #[Pure]
    public function __construct(Booking $overlappingBooking, int $code = 0, ?\Throwable $previous = null)
    {
        $message = sprintf('Booking overlaps with another booking (id: %d), registered by %s', $overlappingBooking->getId(), $overlappingBooking->getEmail());
        parent::__construct($message, $code, $previous);
    }
}
