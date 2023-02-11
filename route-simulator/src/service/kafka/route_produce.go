package servicekafka

import (
	"log"
	"os"
	"encoding/json"
	"time"
	"fmt"

	infrakafka "github.com/moura1001/route-simulator/src/infra/kafka"
	model "github.com/moura1001/route-simulator/src/model"
	kafka "github.com/confluentinc/confluent-kafka-go/v2/kafka"
)

// {"clientId":"1","routeId":"1"}
// {"clientId":"2","routeId":"2"}
// {"clientId":"3","routeId":"3"}
func Produce(msg *kafka.Message) {
	producer := infrakafka.NewKafkaProducer()
	route := model.NewRoute()

	json.Unmarshal(msg.Value, &route)

	err := route.LoadPositions()
	if err == nil {

		positions, err := route.GetPositionsJSONFormatted()

		if err == nil {

			deliveryChan := make(chan kafka.Event)
			go func() {
				for e := range deliveryChan {
					switch ev := e.(type) {
					case *kafka.Message:
						m := ev
						if m.TopicPartition.Error != nil {
							fmt.Printf("Delivery failed: %v\n", m.TopicPartition.Error)
						} else {
							fmt.Printf("Delivered message %s to: %s[%d]@%v\n", string(m.Value),
								*m.TopicPartition.Topic, m.TopicPartition.Partition, m.TopicPartition.Offset)
						}
					default:
						fmt.Printf("Ignored event: %s\n", ev)
					}
				}
			}()
			
			for _, pos := range positions {

				err = infrakafka.Publish(pos, os.Getenv("KAFKA_PRODUCE_TOPIC"), producer, deliveryChan)
				if err != nil {
					log.Println(err.Error())
				}				
				
				time.Sleep(time.Millisecond * 500)
			}

			close(deliveryChan)
		
		} else {
			log.Println(err.Error())
		}		

	} else {
		log.Println(err.Error())
	}

	producer.Close()
}
