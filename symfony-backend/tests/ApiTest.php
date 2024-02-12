<?php

namespace App\Tests;

use ApiPlatform\Symfony\Bundle\Test\ApiTestCase;

class ApiTest extends ApiTestCase
{
    /**
     * @todo extend to check api response
     */
    public function testApiCalls(): void
    {
        $client = $this->createClient();
        $statusCode = $client->request('GET', '/api/meeting-rooms')->getStatusCode();
        $this->assertEquals(200, $statusCode);
        $statusCode = $client->request('GET', '/api/bookings')->getStatusCode();
        $this->assertEquals(200, $statusCode);
        $statusCode = $client->request('POST', '/api/bookings', [
            'headers' => [
                'Content-Type' => 'application/ld+json',
            ],
            'json' => [
                'startsAt' => '2025-01-04T03:30:00+00:00',
                'endsAt' => '2025-01-04T04:30:00+00:00',
                'meetingRoom' => '/api/meeting-rooms/1',
                'email' => 'test@gmail.com',
            ],
        ])->getStatusCode();
        $this->assertEquals(201, $statusCode);
    }
}
