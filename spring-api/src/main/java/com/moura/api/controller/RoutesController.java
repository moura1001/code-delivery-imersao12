package com.moura.api.controller;

import com.moura.api.kafka.MessageProducer;
import com.moura.api.model.dto.RouteRequestDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Controller;

@Controller
public class RoutesController {

    @Autowired
    private MessageProducer producer;

    //@Autowired
    //private SimpMessagingTemplate simpMessagingTemplate;

    @MessageMapping("/routes")
    public void requestRoute(
            @Payload RouteRequestDTO routeRequest,
            @Header("simpSessionId") String sessionId
    ){
        routeRequest.setClientId(sessionId);
        producer.sendMessage(routeRequest);
        //simpMessagingTemplate.convertAndSendToUser(routeRequest.getClientId(), WebSocketConfig.WEBSOCKET_QUEUE, routeRequest);
        //String destination = WebSocketConfig.WEBSOCKET_QUEUE + "-user" + sessionId;
        //simpMessagingTemplate.convertAndSend(destination, routeRequest);
    }
}
