<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use App\Repository\BookingRepository;
use Doctrine\ORM\Mapping as ORM;
use Gedmo\Timestampable\Timestampable;
use Gedmo\Timestampable\Traits\TimestampableEntity;
use Symfony\Component\Serializer\Annotation\Groups;

#[ApiResource(
    operations: [
        new Get(
            uriTemplate: '/bookings/{id}',
            normalizationContext: ['groups' => ['booking:read']]
        ),
        new Post(uriTemplate: '/bookings',
            normalizationContext: ['groups' => ['booking:write']]
        ),
        // The GetCollection operation returns a list of Books.
        new GetCollection(uriTemplate: '/bookings',
            normalizationContext: ['groups' => ['booking:read']]
        ),
    ],
)]
#[ORM\Entity(repositoryClass: BookingRepository::class)]
class Booking implements Timestampable
{
    use TimestampableEntity;

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['booking:write', 'booking:read'])]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'bookings')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['booking:write', 'booking:read'])]
    private ?MeetingRoom $meetingRoom = null;

    #[ORM\ManyToOne(inversedBy: 'bookings')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['booking:write', 'booking:read'])]
    private ?User $bookedBy = null;

    #[ORM\Column]
    #[Groups(['booking:write', 'booking:read'])]
    private ?\DateTimeImmutable $startsAt = null;

    #[ORM\Column]
    #[Groups(['booking:write', 'booking:read'])]
    private ?\DateTimeImmutable $endsAt = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getMeetingRoom(): ?MeetingRoom
    {
        return $this->meetingRoom;
    }

    public function setMeetingRoom(?MeetingRoom $meetingRoom): static
    {
        $this->meetingRoom = $meetingRoom;

        return $this;
    }

    public function getBookedBy(): ?User
    {
        return $this->bookedBy;
    }

    public function setBookedBy(?User $bookedBy): static
    {
        $this->bookedBy = $bookedBy;

        return $this;
    }

    public function getStartsAt(): ?\DateTimeImmutable
    {
        return $this->startsAt;
    }

    public function setStartsAt(\DateTimeImmutable $startsAt): static
    {
        $this->startsAt = $startsAt;

        return $this;
    }

    public function getEndsAt(): ?\DateTimeImmutable
    {
        return $this->endsAt;
    }

    public function setEndsAt(\DateTimeImmutable $endsAt): static
    {
        $this->endsAt = $endsAt;

        return $this;
    }

    public function getDuration(): \DateInterval|false
    {
        return $this->startsAt->diff($this->endsAt);
    }
}
