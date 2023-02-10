package com.moura.api.kafka;

import com.moura.api.model.dto.PartialRoutePositionDTO;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
public class MessageListener {
    @KafkaListener(
            topics = "${myconf.kafka.consumer.topic}",
            groupId = "${myconf.kafka.consumer.group-id}",
            containerFactory = "kafkaListenerContainerFactory"
    )
    public void listenGroup(PartialRoutePositionDTO partialRoute) {
        System.out.println("Received Message: " + partialRoute);
    }
}
