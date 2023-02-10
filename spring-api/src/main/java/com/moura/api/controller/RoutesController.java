package com.moura.api.controller;

import com.moura.api.kafka.MessageProducer;
import com.moura.api.model.dto.RouteRequestDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/routes")
public class RoutesController {

    @Autowired
    private MessageProducer producer;

    @GetMapping("/{id}")
    public ResponseEntity<Object> requestRoute(@PathVariable("id") Long routeId){
        producer.sendMessage(new RouteRequestDTO(Long.toString(routeId), ""));
        return ResponseEntity.ok("route request sent successfully");
    }
}
