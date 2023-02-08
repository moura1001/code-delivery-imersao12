package infrakafka

import (
	"fmt"
	"log"
	"os"

	"github.com/confluentinc/confluent-kafka-go/v2/kafka"
)

func NewKafkaProducer() *kafka.Producer {
	p, err := kafka.NewProducer(&kafka.ConfigMap{
		"bootstrap.servers": os.Getenv("KAFKA_BOOTSTRAP_SERVERS"),
	})

	if err != nil {
		log.Fatalf("error to obtain kafka producer. Details: '%s'", err)
	}

	return p
}

func Publish(message, topic string, producer *kafka.Producer) error {
	m := &kafka.Message{
		TopicPartition: kafka.TopicPartition{Topic: &topic, Partition: kafka.PartitionAny},
		Value:          []byte(message),
	}

	err := producer.Produce(m, nil)
	if err != nil {
		return fmt.Errorf("error to enqueue the message. Details: '%s'", err)
	}

	return nil
}
