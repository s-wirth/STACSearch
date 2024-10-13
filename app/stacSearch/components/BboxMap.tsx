import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

// Token for mapbox access, https://docs.mapbox.com/help/how-mapbox-works/access-tokens/
mapboxgl.accessToken = "pk.eyJ1Ijoic29waGlld2lydGgiLCJhIjoiY20xNzM3YWZzMG50aTJqcXhicjl1eGRuNCJ9.2RetSrpovzOmcXgsVpt3Dg";

const MapComponent = ({
  bboxMap,
  setBboxMap,
  isLoading,
  bboxQuery,
  selectedFeatureBbox,
}) => {
  const mapContainerRef = useRef(null);

  // Add selected bounding box when a feature is selected from ResultsTable
  useEffect(() => {
    if (selectedFeatureBbox) {
      if (bboxMap.getLayer("selected-bounding-box")) {
        bboxMap.removeLayer("selected-bounding-box");
      }
      if (bboxMap.getSource("selected-bounding-box")) {
        bboxMap.removeSource("selected-bounding-box");
      }
      bboxMap.addLayer({
        id: "selected-bounding-box",
        type: "fill",
        paint: {
          "fill-color": "#2db185",
          "fill-opacity": 0.6,
        },
        source: {
          type: "geojson",
          data: {
            type: "Feature",
            properties: {},
            geometry: {
              type: "Polygon",
              coordinates: [
                [
                  [selectedFeatureBbox.longOne, selectedFeatureBbox.latOne],
                  [selectedFeatureBbox.longOne, selectedFeatureBbox.latTwo],
                  [selectedFeatureBbox.longTwo, selectedFeatureBbox.latTwo],
                  [selectedFeatureBbox.longTwo, selectedFeatureBbox.latOne],
                  [selectedFeatureBbox.longOne, selectedFeatureBbox.latOne],
                ],
              ],
            },
          },
        },
      });
    }
  }, [selectedFeatureBbox]);

  // Initialize map and set initial bounds
  useEffect(() => {
    const initializeMap = () => {
      const bounds = [
        [bboxQuery.longOne, bboxQuery.latOne], 
        [bboxQuery.longTwo, bboxQuery.latTwo], 
      ];
      const mapInstance = new mapboxgl.Map({
        container: mapContainerRef.current,
        bounds,
        fitBoundsOptions: { padding: 60 },
      });

      mapInstance.on("load", () => {
        mapInstance.addLayer({
          id: "query-bounding-box",
          type: "fill",
          paint: {
            "fill-color": "#D54619",
            "fill-opacity": 0.6,
          },
          source: {
            type: "geojson",
            data: {
              type: "Feature",
              properties: {},
              geometry: {
                type: "Polygon",
                coordinates: [
                  [
                    [bboxQuery.longOne, bboxQuery.latOne],
                    [bboxQuery.longOne, bboxQuery.latTwo],
                    [bboxQuery.longTwo, bboxQuery.latTwo],
                    [bboxQuery.longTwo, bboxQuery.latOne],
                    [bboxQuery.longOne, bboxQuery.latOne],
                  ],
                ],
              },
            },
          },
        });
      });
      return mapInstance;
    };

    setBboxMap(initializeMap(bboxQuery, selectedFeatureBbox));
  }, [bboxQuery]);

  return (
    <div className="site-content__map">
      <div id="map-table-row-wrapper-inner">
        <div id="map" ref={mapContainerRef}></div>
      </div>
    </div>
  );
};

export default MapComponent;
