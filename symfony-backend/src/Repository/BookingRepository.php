<?php

namespace App\Repository;

use App\Entity\Booking;
use App\Entity\MeetingRoom;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Booking>
 *
 * @method Booking|null find($id, $lockMode = null, $lockVersion = null)
 * @method Booking|null findOneBy(array $criteria, array $orderBy = null)
 * @method Booking[]    findAll()
 * @method Booking[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class BookingRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Booking::class);
    }

    public function getOverlappingBooking(Booking $booking): ?Booking
    {
        $queryBuilder = $this->createQueryBuilder('b');
        $queryBuilder
            ->where('b.startsAt < :endsAt')
            ->andWhere('b.endsAt > :startsAt')
            ->andWhere('b.meetingRoom = :meetingRoom')
            ->setParameter('startsAt', $booking->getStartsAt())
            ->setParameter('endsAt', $booking->getEndsAt())
            ->setParameter('meetingRoom', $booking->getMeetingRoom())
            ->setMaxResults(1)
        ;

        return $queryBuilder->getQuery()->getOneOrNullResult();
    }

    public function findBooking(MeetingRoom $meetingRoom, \DateTimeImmutable $startsAt, \DateTimeImmutable $endsAt): ?Booking
    {
        $queryBuilder = $this->createQueryBuilder('b');
        $queryBuilder
            ->where('b.startsAt = :startsAt')
            ->andWhere('b.endsAt = :endsAt')
            ->andWhere('b.meetingRoom = :meetingRoom')
            ->setParameter('startsAt', $startsAt)
            ->setParameter('endsAt', $endsAt)
            ->setParameter('meetingRoom', $meetingRoom)
            ->setMaxResults(1)
        ;

        return $queryBuilder->getQuery()->getOneOrNullResult();
    }

    //    /**
    //     * @return Booking[] Returns an array of Booking objects
    //     */
    //    public function findByExampleField($value): array
    //    {
    //        return $this->createQueryBuilder('b')
    //            ->andWhere('b.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->orderBy('b.id', 'ASC')
    //            ->setMaxResults(10)
    //            ->getQuery()
    //            ->getResult()
    //        ;
    //    }

    //    public function findOneBySomeField($value): ?Booking
    //    {
    //        return $this->createQueryBuilder('b')
    //            ->andWhere('b.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }
}
