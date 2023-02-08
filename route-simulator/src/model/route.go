package model

import (
	"bufio"
	"encoding/json"
	"fmt"
	"os"
	"strconv"
	"strings"
)

type Route struct {
	Id        string `json:"routeId"`
	ClientId  string `json:"clientId"`
	Positions []Position
}

type Position struct {
	Latitude  float64
	Longitude float64
}

type PartialRoutePosition struct {
	Id       string    `json:"routeId"`
	ClientId string    `json:"clientId"`
	Position []float64 `json:"position"`
	Finished bool      `json:"finished"`
}

func NewRoute() *Route {
	return new(Route)
}

func (r *Route) LoadPositions() error {
	if strings.TrimSpace(r.Id) == "" {
		return fmt.Errorf("route id not valid")
	}

	f, err := os.Open(fmt.Sprintf("./src/data/routes/%s.txt", r.Id))
	if err != nil {
		if os.IsNotExist(err) {
			return fmt.Errorf("route '%s' does not exist", r.Id)
		}
		return fmt.Errorf("error to get route information for '%s'. Details: %s", r.Id, err)
	}
	defer f.Close()

	line := bufio.NewScanner(f)
	for line.Scan() {
		data := strings.Split(line.Text(), ",")

		lat, err := strconv.ParseFloat(data[0], 64)
		if err != nil {
			return fmt.Errorf("error to parse latitude route position '%s' for data '%s'", r.Id, line.Text())
		}

		lon, err := strconv.ParseFloat(data[1], 64)
		if err != nil {
			return fmt.Errorf("error to parse longitude route position '%s' for data '%s'", r.Id, line.Text())
		}

		r.Positions = append(r.Positions, Position{
			Latitude:  lat,
			Longitude: lon,
		})
	}

	return nil
}

func (r *Route) GetPositionsJSONFormatted() ([]string, error) {
	var route PartialRoutePosition
	var routeData []string
	totalPos := len(r.Positions)

	for k, pos := range r.Positions {
		route.Id = r.Id
		route.ClientId = r.ClientId
		route.Position = []float64{pos.Latitude, pos.Longitude}
		route.Finished = false
		if k == totalPos-1 {
			route.Finished = true
		}

		routeJson, err := json.Marshal(route)
		if err != nil {
			return nil, fmt.Errorf("error to build json data for route '%s'. Details: '%s'", r.Id, err)
		}

		routeData = append(routeData, string(routeJson))
	}

	return routeData, nil
}
