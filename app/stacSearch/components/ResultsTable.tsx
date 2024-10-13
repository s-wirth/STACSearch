"use client";
import { useState } from "react";

const isDate = function (date) {
  return new Date(date) !== "Invalid Date" && !isNaN(new Date(date));
};

/* Create printable string for display on site */
const cleanUpNumberString = (featureValue) => {
  let cleanString = "-";
  if (!featureValue) {
    return cleanString;
  } else if (typeof featureValue === "number") {
    cleanString = featureValue.toFixed(2);
  } else if (typeof featureValue === "string") {
    cleanString = featureValue;
  } else if (Array.isArray(featureValue)) {
    for (let i = 0; i < featureValue.length; i++) {
      if (i === 0) {
        cleanString = cleanUpNumberString(featureValue[i]);
      } else {
        cleanString = cleanString + ", " + cleanUpNumberString(featureValue[i]);
      }
    }
  }
  return cleanString;
};

/* Create printable date string for display on site */
const cleanUpDateString = (featureValue) => {
  if (isDate(featureValue)) {
    return new Date(featureValue).toLocaleString("en-US", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    });
  } else {
    return cleanUpNumberString(featureValue);
  }
};

/* Create printable BBox string for display on site 
  - TODO: Add handling for multiple BBox values 
*/
const cleanUpBBoxString = (featureValue) => {
  let cleanString = "";
  let featureValueArray = [];
  if (typeof featureValue === "object") {
    Object.keys(featureValue).map((key) => {
      featureValueArray.push(featureValue[key]);
    })
  }
  if (Array.isArray(featureValue)) {
    featureValueArray = [...featureValue];
  }

  if( featureValueArray.length === 4) {
    return `[${cleanUpNumberString(featureValueArray[0])}, ${cleanUpNumberString(featureValueArray[1])}], [${cleanUpNumberString(featureValueArray[2])}, ${cleanUpNumberString(featureValueArray[3])}]`
  }
  for (let i = 0; i < featureValueArray.length; i++) {
    if (i === 0) {
      cleanString = cleanUpNumberString(featureValueArray[i]);
    } else {
      cleanString = cleanString + ", " + cleanUpNumberString(featureValueArray[i]);
    }
  }
  return cleanString;
}

/* Render STAC Feature Table Body content from search results */
const RenderSTACFeatureTable = ({
  isLoading,
  features,
  queryOptions,
  setSelectedFeatureBbox,
}) => {
  if (isLoading) {
    <p>Loading...</p>;
  } else if (!features || !features["features"] || features["features"].length === 0) {
    <p>Search returned no results</p>;
  } else {
    return Object.values(features["features"]).map((feature, i) => {
      // set className for alternative row background color
      const rowClassName =
        i % 2 === 0
          ? "feature-results__table--row"
          : "feature-results__table--row row-light";
      // create bounding box string for nicer display
      const bboxCoordsOne = `[${cleanUpNumberString(
        feature["bbox"][0]
      )}, ${cleanUpNumberString(feature["bbox"][1])}]`;
      const bboxCoordsTwo = `[${cleanUpNumberString(
        feature["bbox"][2]
      )}, ${cleanUpNumberString(feature["bbox"][3])}]`;
      return (
        <div key={"results-table-row-" + i} className={rowClassName}>
          <div className="feature-results__table--cell cell-large">
            {cleanUpNumberString(feature["description"])}
          </div>
          <div className="feature-results__table--cell cell-large">
            {cleanUpNumberString(feature["id"])}
          </div>
          <div className="feature-results__table--cell cell-medium">
            {new Date(feature["properties"]["created"]).toLocaleString(
              "en-US",
              {
                year: "numeric",
                month: "numeric",
                day: "numeric",
              }
            )}
          </div>
          <div className="feature-results__table--cell cell-medium">
            {new Date(feature["properties"]["updated"]).toLocaleString(
              "en-US",
              {
                year: "numeric",
                month: "numeric",
                day: "numeric",
              }
            )}
          </div>
          <div
            className="feature-results__table--cell cell-medium bbox-cell"
            onClick={() => {
              setSelectedFeatureBbox({
                longOne: Number(feature["bbox"][0]),
                latOne: Number(feature["bbox"][1]),
                longTwo: Number(feature["bbox"][2]),
                latTwo: Number(feature["bbox"][3]),
              });
            }}
          >
            <ul>
              <li>{bboxCoordsOne}</li>
              <li>{bboxCoordsTwo}</li>
            </ul>
          </div>
          <div className="feature-results__table--cell cell-small">
            {cleanUpNumberString(feature["properties"]["instruments"])}
          </div>
          <div className="feature-results__table--cell cell-small">
            {cleanUpNumberString(feature["properties"]["eo:cloud_cover"])}
          </div>
          <div className="feature-results__table--cell cell-small">
            {cleanUpNumberString(feature["properties"]["view:sun_azimuth"])}
          </div>
          <div className="feature-results__table--cell cell-small">
            {cleanUpNumberString(feature["properties"]["view:sun_elevation"])}
          </div>
        </div>
      );
    });
  }
};

export default function ResultsTable({
  queryOptions,
  features,
  isLoading,
  setSelectedFeatureBbox,
  featuresFound,
}) {
  return (
    <div className="site-content__results">
      <div className="feature-results__container">
        <div className="feature-results__table">
          <div className="feature-results__table--header">
            <div className="feature-results__table--row row-header">
              <div className="feature-results__table--cell cell-large">
                Description
              </div>
              <div className="feature-results__table--cell cell-large">ID</div>
              <div className="feature-results__table--cell cell-medium">
                Created
              </div>
              <div className="feature-results__table--cell cell-medium">
                Updated
              </div>
              <div className="feature-results__table--cell cell-medium">
                BBox
              </div>
              <div className="feature-results__table--cell cell-small">
                Instr.
              </div>
              <div className="feature-results__table--cell cell-small">
                Cloud Cover
              </div>
              <div className="feature-results__table--cell cell-small">
                Azimuth
              </div>
              <div className="feature-results__table--cell cell-small">
                Elevation
              </div>
            </div>
          </div>
          <div className="feature-results__table--body">
            { isLoading ? <p>Loading...</p> :
              <RenderSTACFeatureTable
                isLoading={isLoading}
                features={features}
                queryOptions={queryOptions}
                setSelectedFeatureBbox={setSelectedFeatureBbox}
              />
            }
          </div>
        </div>
        <div className="feature-results__info">
          <div className="feature-results__info--query">
            <span>Collection: {queryOptions.collections[0]}</span>
            <span>Start: {cleanUpDateString(queryOptions.startDateTime)}</span>
            <span>End: {cleanUpDateString(queryOptions.endDateTime)}</span>
            <span>BBox: {cleanUpBBoxString(queryOptions.bbox)}</span>
          </div>
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            <div className="feature-results__info--results">
              {featuresFound ? `${featuresFound} results` : "No results"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
