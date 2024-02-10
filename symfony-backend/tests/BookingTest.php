<?php

namespace App\Tests;

use App\Entity\Booking;
use App\Entity\MeetingRoom;
use App\Entity\User;
use App\Exception\DoubleBookingException;
use App\Exception\OutOfRangeBookingException;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;

class BookingTest extends KernelTestCase
{
    public function testDoubleBooking(): void
    {
        $kernel = self::bootKernel();

        $this->assertSame('test', $kernel->getEnvironment());

        $scenarios = [
            [
                'room_id' => 2,
                'start_date' => '2025-01-01T14:00:00+02:00',
                'end_date' => '2025-01-01T15:30:00+02:00',
                'expects_valid' => false,
            ],
            [
                'room_id' => 2,
                'start_date' => '2025-01-01T14:15:00+02:00',
                'end_date' => '2025-01-01T15:15:00+02:00',
                'expects_valid' => false,
            ],
            [
                'room_id' => 2,
                'start_date' => '2025-01-01T14:15:00+02:00',
                'end_date' => '2025-01-01T15:45:00+02:00',
                'expects_valid' => false,
            ],
            [
                'room_id' => 2,
                'start_date' => '2025-01-01T13:45:00+02:00',
                'end_date' => '2025-01-01T14:15:00+02:00',
                'expects_valid' => false,
            ],
            [
                'room_id' => 2,
                'start_date' => '2025-01-01T13:45:00+02:00',
                'end_date' => '2025-01-01T16:15:00+02:00',
                'expects_valid' => false,
            ],
            [
                'room_id' => 2,
                'start_date' => '2025-01-01T13:00:00+02:00',
                'end_date' => '2025-01-01T13:30:00+02:00',
                'expects_valid' => true,
            ],
            [
                'room_id' => 4,
                'start_date' => '2025-01-01T13:45:00+02:00',
                'end_date' => '2025-01-01T16:15:00+02:00',
                'expects_valid' => true,
            ],
        ];

        $entityManager = $kernel->getContainer()->get('doctrine')->getManager();
        $user = $entityManager->getRepository(User::class)->find(1);

        foreach ($scenarios as $i => $scenario) {
            $booking = new Booking();
            $meetingRoom = $entityManager->getRepository(MeetingRoom::class)->find($scenario['room_id']);
            $booking
                ->setBookedBy($user)
                ->setMeetingRoom($meetingRoom)
                ->setStartsAt(new \DateTimeImmutable($scenario['start_date']))
                ->setEndsAt(new \DateTimeImmutable($scenario['end_date']));

            $expectsValid = $scenario['expects_valid'];

            $thrownException = false;
            try {
                $entityManager->persist($booking);
                $entityManager->flush();
            } catch (DoubleBookingException $e) {
                $thrownException = true;
            }

            if ($expectsValid) {
                $this->assertFalse($thrownException, 'No exception should be thrown for scenario '.$i);
                $this->assertNotEmpty($booking->getId(), 'Booking should be persisted for scenario '.$i);
            } else {
                $this->assertTrue($thrownException, 'An exception should be thrown for scenario '.$i);
            }
        }
        $this->assertEquals(count($scenarios) - 1, $i, 'All scenarios should be executed');
    }

    public function testBookingOutOfRange()
    {
        $kernel = self::bootKernel();
        $allowedStartDate = new \DateTimeImmutable($kernel->getContainer()->getParameter('booking.allowed_start_date'));
        $allowedEndDate = new \DateTimeImmutable($kernel->getContainer()->getParameter('booking.allowed_end_date'));

        $scenarios = [
            [
                'start_date' => $this->subOneHour($allowedStartDate),
                'end_date' => $this->addOneHour($allowedStartDate),
                'expects_valid' => false,
            ],
            [
                'start_date' => $this->addOneHour($allowedStartDate),
                'end_date' => $this->addOneHour($allowedEndDate),
                'expects_valid' => false,
            ],
            [
                'start_date' => $this->subOneHour($allowedStartDate),
                'end_date' => $this->subOneHour($allowedEndDate),
                'expects_valid' => false,
            ],
            [
                'start_date' => $this->subOneHour($allowedStartDate),
                'end_date' => $this->addOneHour($allowedEndDate),
                'expects_valid' => false,
            ],
            [
                'start_date' => $this->addOneHour($allowedStartDate),
                'end_date' => $this->subOneHour($allowedEndDate),
                'expects_valid' => true,
            ],
        ];

        $entityManager = $kernel->getContainer()->get('doctrine')->getManager();
        $user = $entityManager->getRepository(User::class)->find(1);

        foreach ($scenarios as $i => $scenario) {
            $meetingRoom = new MeetingRoom(); // create new meeting room to avoid double booking
            $meetingRoom->setName('Test room '.$i);
            $meetingRoom->setCapacity(10);
            $booking = new Booking();
            $booking
                ->setBookedBy($user)
                ->setMeetingRoom($meetingRoom)
                ->setStartsAt($scenario['start_date'])
                ->setEndsAt($scenario['end_date']);

            $expectsValid = $scenario['expects_valid'];

            $thrownException = false;
            try {
                $entityManager->persist($meetingRoom);
                $entityManager->persist($booking);
                $entityManager->flush();
            } catch (OutOfRangeBookingException $e) {
                $thrownException = true;
            }

            if ($expectsValid) {
                $this->assertFalse($thrownException, 'No exception should be thrown for scenario '.$i);
                $this->assertNotEmpty($booking->getId(), 'Booking should be persisted for scenario '.$i);
            } else {
                $this->assertTrue($thrownException, 'An exception should be thrown for scenario '.$i);
            }
        }
        $this->assertEquals(count($scenarios) - 1, $i, 'All scenarios should be executed');
    }

    private function addOneHour(\DateTimeImmutable $date): \DateTimeImmutable
    {
        return $date->add(new \DateInterval('PT1H'));
    }

    private function subOneHour(\DateTimeImmutable $date): \DateTimeImmutable
    {
        return $date->sub(new \DateInterval('PT1H'));
    }
}
