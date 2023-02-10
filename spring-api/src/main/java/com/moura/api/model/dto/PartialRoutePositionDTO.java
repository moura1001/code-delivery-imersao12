package com.moura.api.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Arrays;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PartialRoutePositionDTO {
    private String routeId;
    private String clientId;
    private Double[] position;
    private Boolean finished;

    @Override
    public String toString() {
        return "RoutePos{ " +
                "routeId='" + routeId + '\'' +
                ", clientId='" + clientId + '\'' +
                ", position='" + Arrays.toString(position) + '\'' +
                ", finished='" + finished + '\'' +
                " }";
    }
}
