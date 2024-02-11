<?php

namespace App\Controller\Api;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/settings', name: 'api_settings_', methods: ['GET'])]
class SettingsController extends AbstractController
{
    public function __construct(
        private string $allowedStartDate,
        private string $allowedEndDate
    ) {}

    #[Route('', name: 'get', methods: ['GET'])]
    public function getSettings(): JsonResponse
    {
        return new JsonResponse([
            'allowedStartDate' => $this->allowedStartDate,
            'allowedEndDate' => $this->allowedEndDate,
        ]);
    }
}
