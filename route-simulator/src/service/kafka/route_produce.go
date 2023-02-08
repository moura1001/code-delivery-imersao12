package servicekafka

import (
	"log"
	"os"
	"encoding/json"
	"time"

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
			
			for _, pos := range positions {
				err = infrakafka.Publish(pos, os.Getenv("KAFKA_PRODUCE_TOPIC"), producer)
				if err != nil {
					log.Println(err.Error())
				}				
				
				time.Sleep(time.Millisecond * 500)
			}
		
		} else {
			log.Println(err.Error())
		}		

	} else {
		log.Println(err.Error())
	}
}
