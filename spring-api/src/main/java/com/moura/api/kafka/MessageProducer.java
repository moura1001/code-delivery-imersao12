package com.moura.api.kafka;

import com.moura.api.model.dto.RouteRequestDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.SendResult;
import org.springframework.util.concurrent.ListenableFuture;
import org.springframework.util.concurrent.ListenableFutureCallback;

public class MessageProducer {
    @Autowired
    private KafkaTemplate<String, RouteRequestDTO> kafkaTemplate;
    @Value(value = "${myconf.kafka.producer.topic}")
    private String topic;

    public void sendMessage(RouteRequestDTO msg) {
        
        ListenableFuture<SendResult<String, RouteRequestDTO>> future =
                kafkaTemplate.send(topic, msg);

        future.addCallback(new ListenableFutureCallback<SendResult<String, RouteRequestDTO>>() {

            @Override
            public void onSuccess(SendResult<String, RouteRequestDTO> result) {
                System.out.println("Sent message=[" + msg +
                        "] with offset=[" + result.getRecordMetadata().offset() + "]");
            }
            @Override
            public void onFailure(Throwable ex) {
                System.out.println("Unable to send message=["
                        + msg + "] due to : " + ex.getMessage());
            }
        });
    }
}
