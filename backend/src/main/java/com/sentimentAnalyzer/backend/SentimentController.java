package com.sentimentAnalyzer.backend;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/api")
public class SentimentController {

    private final String FLASK_API_URL = "http://127.0.0.1:5000/analyze";

    @PostMapping("/analyze")
    public ResponseEntity<String> analyzeSentiment(@RequestBody String text) {
        RestTemplate restTemplate = new RestTemplate();

        // Create a JSON body
        String requestBody = "{\"query\": \"" + text + "\"}";

        // Send POST request to Flask API
        ResponseEntity<String> response = restTemplate.postForEntity(FLASK_API_URL, requestBody, String.class);

        return ResponseEntity.ok(response.getBody());
    }
}
