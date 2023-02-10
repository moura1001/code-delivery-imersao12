package com.moura.api.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RouteRequestDTO {
    private String routeId;
    private String clientId;

    @Override
    public String toString() {
        return "RouteRequest{ " +
                "routeId='" + routeId + '\'' +
                ", clientId='" + clientId + '\'' +
                " }";
    }
}
