package com.moura.api.kafka;

import com.moura.api.model.dto.PartialRoutePositionDTO;
import com.moura.api.websocket.WebSocketConfig;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

@Component
public class MessageListener {
    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;

    @KafkaListener(
            topics = "${myconf.kafka.consumer.topic}",
            groupId = "${myconf.kafka.consumer.group-id}",
            containerFactory = "kafkaListenerContainerFactory"
    )
    public void listenGroup(PartialRoutePositionDTO partialRoute) {
        //System.out.println("Received Message: " + partialRoute);

        String destination = String.format(
                "%s%s%s-%s",
                WebSocketConfig.WEBSOCKET_QUEUE,
                "-user",
                partialRoute.getClientId(),
                partialRoute.getRouteId()
        );
        simpMessagingTemplate.convertAndSend(destination, partialRoute);
    }
}
