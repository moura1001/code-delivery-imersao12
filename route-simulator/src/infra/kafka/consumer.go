package infrakafka

import (
	"fmt"
	"log"
	"os"

	"github.com/confluentinc/confluent-kafka-go/v2/kafka"
)

type KafkaConsumer struct {
	MessageChan chan *kafka.Message
}

func NewKafkaConsumer(msgChan chan *kafka.Message) *KafkaConsumer {
	return &KafkaConsumer{
		MessageChan: msgChan,
	}
}

func (kc *KafkaConsumer) Consume() {
	c, err := kafka.NewConsumer(&kafka.ConfigMap{
		"bootstrap.servers": os.Getenv("KAFKA_BOOTSTRAP_SERVERS"),
		"group.id":          os.Getenv("KAFKA_CONSUMER_GROUP_ID"),
		"auto.offset.reset": "earliest",
	})

	if err != nil {
		log.Fatalf("error to obtain kafka consumer. Details: '%s'", err)
	}

	c.SubscribeTopics([]string{os.Getenv("KAFKA_READ_TOPIC")}, nil)

	fmt.Println("kafka consumer has been started")

	run := true

	for run {
		msg, err := c.ReadMessage(-1)
		if err == nil {
			kc.MessageChan <- msg
		} else if !err.(kafka.Error).IsTimeout() {
			fmt.Printf("consumer error: %v (%v)\n", err, msg)
		}
	}
}
