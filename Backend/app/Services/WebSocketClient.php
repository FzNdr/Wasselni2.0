<?php

namespace App\Services;

use WebSocket\Client;

class WebSocketClient
{
    protected $client;

    public function __construct()
    {
        $this->client = new Client("ws://localhost:8080");
    }

    public function send(array $data)
    {
        $this->client->send(json_encode($data));
    }
}
