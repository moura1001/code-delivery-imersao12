package main

import (
	"fmt"
	"log"

	infrakafka "github.com/moura1001/route-simulator/src/infra/kafka"
	servicekafka "github.com/moura1001/route-simulator/src/service/kafka"
	kafka "github.com/confluentinc/confluent-kafka-go/v2/kafka"
	"github.com/joho/godotenv"
)

func init() {
	err := godotenv.Load()
	if err != nil {
		log.Fatalf("error loading .env file. Details: %s", err)
	}
}

func main() {
	
	fmt.Println("started")

	msgChan := make(chan *kafka.Message)
	consumer := infrakafka.NewKafkaConsumer(msgChan)
	go consumer.Consume()

	for message := range msgChan {
		fmt.Printf("route request: %s\n", string(message.Value))
		go servicekafka.Produce(message)
	}

}
