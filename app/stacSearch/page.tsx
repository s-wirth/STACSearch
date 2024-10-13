"use client";
import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import MapComponent from "./components/BboxMap";
import QueryData from "./components/QueryData";
import ResultsTable from "./components/ResultsTable";

export default function STACTablePage() {
  /* Site State Management */

  // Loading State
  const [isLoading, setLoading] = useState(true);

  // Query Options State for API Calls
  const [queryOptions, setQueryOptions] = useState({
    collections: ["landsat-c2l1"],
    startDateTime: "2018-02-12T00:00:00Z",
    endDateTime: "2018-03-18T12:31:12Z",
    bbox: {
      longOne: -90,
      latOne: 39.5,
      longTwo: -105,
      latTwo: 40.5,
    },
  });

  // Search Results - STAC Features and amount found
  const [features, setFeatures] = useState(null);
  const [featuresFound, setFeaturesFound] = useState(null);
  const [featuresJson, setFeaturesJson] = useState({});

  // Map State
  const [bboxMap, setBboxMap] = useState(null);
  const [selectedFeatureBbox, setSelectedFeatureBbox] = useState(null);

  // Collection State - Two default collections, will be updated on API call with full list of collections
  const [collectionsList, setCollectionsList] = useState([
    "landsat-c2l1",
    "landsat-c2l2-st",
  ]);

  /* --------- API Calls --------- */

  // Get List of Collections
  useEffect(() => {
    setLoading(true);
    const endpoint = "https://landsatlook.usgs.gov/stac-server/collections/";

    fetch(endpoint, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((collections) => {
        setLoading(false);
        const collectionsList = collections["collections"].map(
          (collection) => collection.id
        );
        setCollectionsList(collectionsList);
      });
  }, []);
  

  // Get STAC Features
  useEffect(() => {
    setLoading(true);
    const endpoint = "https://landsatlook.usgs.gov/stac-server/search";
    const startTime = new Date(queryOptions.startDateTime)
      .toISOString()
      .replace("Z", "+00:00");
    const endTime = new Date(queryOptions.endDateTime)
      .toISOString()
      .replace("Z", "+00:00");
    const dateTime = `${startTime}/${endTime}`;

    const requestBody = {
      rel: "search",
      limit: 100,
      bbox: [
        Number(queryOptions.bbox.longOne),
        Number(queryOptions.bbox.latOne),
        Number(queryOptions.bbox.longTwo),
        Number(queryOptions.bbox.latTwo),
      ],
      datetime: dateTime,

      collections: queryOptions.collections,
    };

    fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    })
      .then((res) => res.json())
      .then((features) => {
        setFeatures(features);
        setLoading(false);
      });
  }, [queryOptions]);

  /* --------- Rendering --------- */

  // Set Features Found and downloadable JSON
  useEffect(() => {
    if (features && features.features && features.features.length > 0) {
      setFeaturesFound(features.features.length);
      setFeaturesJson(JSON.stringify(features, null, "  "));
    } else {
      setFeaturesFound(0);
      setFeaturesJson({});
    }
  }, [features]);

  return (
    <div className="site-scaffolding flex-wrapper">
      <Sidebar
        queryOptions={queryOptions}
        collectionsList={collectionsList}
        setQueryOptions={setQueryOptions}
        setLoading={setLoading}
        selectedFeatureBbox={selectedFeatureBbox}
        setSelectedFeatureBbox={setSelectedFeatureBbox}
        setFeaturesFound={setFeaturesFound}
        featuresJson={featuresJson}
        isLoading={isLoading}
      />
      <div className="site-content flex-wrapper">
        <MapComponent
          bboxMap={bboxMap}
          setBboxMap={setBboxMap}
          isLoading={isLoading}
          bboxQuery={queryOptions.bbox}
          selectedFeatureBbox={selectedFeatureBbox}
        />

        <ResultsTable
          isLoading={isLoading}
          features={features}
          queryOptions={queryOptions}
          setSelectedFeatureBbox={setSelectedFeatureBbox}
          featuresFound={featuresFound}
        />
      </div>
    </div>
  );
}
