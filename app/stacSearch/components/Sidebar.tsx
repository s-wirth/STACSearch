"use client";
import React, { useState } from "react";
import DatePicker from "react-datepicker";

export default function Sidebar({
  queryOptions,
  collectionsList,
  setQueryOptions,
  setLoading,
  selectedFeatureBbox,
  setFeaturesFound,
  featuresJson,
  isLoading,
}) {
  /* State Values for input interactions */
  const [collectionSelect, setCollectionSelect] = useState(
    queryOptions.collections[0]
  );
  const [inputCollection, setInputCollection] = useState(
    queryOptions.collections[0]
  );
  const [inputStartDateTime, setInputStartDateTime] = useState(
    queryOptions.startDateTime
  );
  const [inputEndDateTime, setInputEndDateTime] = useState(
    queryOptions.endDateTime
  );
  const [bboxInputValues, setBboxInputValues] = useState(queryOptions.bbox);

  /* Set min and max values for lat and long input */
  const minLat = -90;
  const maxLat = 90;
  const minLong = -180;
  const maxLong = 180;

  const [correctedLat, setCorrectLat] = useState(90);

  /* Create JSON file from current features and download */
  const downloadJson = () => {
    console.log("JSON.stringify(featuresJson)", JSON.stringify(featuresJson));
    const dataStr = `data:text/json,${encodeURIComponent(
      JSON.stringify(featuresJson, null, "  ")
    )}`;
    const downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "data.json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <div className="sidebar flex-wrapper">
      <h1 className="sidebar__title">STACSearch</h1>
      <h2 className="sidebar__subtitle">
        Query the SpatioTemporal Asset Catalog (STAC) API of the{" "}
        <a href="https://landsatlook.usgs.gov">USGS</a>.
      </h2>
      <aside className="query-parameters">
        <h3 className="query-parameters__title">Query Parameters</h3>
        <ul className="query-parameters__list">
          <li className="query-parameters__list--item">
            Collection - The collection to query
          </li>
          <li>Date - Start and end date of feature catalog</li>
          <li>BBox - Features with intersecting bounding box</li>
        </ul>
      </aside>
      <div className="filter-options flex-wrapper">
        <h3 className="filter-options__title">Filters</h3>
        <div className="filter-option__container">
          <p className="filter-option__label">Collection</p>
          <div className="filter-option__bumper" />
          <select
            className="filter-option__input filter-option__input--select"
            value={inputCollection}
            onChange={(e) => setInputCollection(event.target.value)}
          >
            {collectionsList.map((collection) => (
              <option key={collection} value={collection}>
                {collection}
              </option>
            ))}
          </select>
        </div>
        <div className="filter-option__separator" />
        <div className="filter-option__container">
          <p className="filter-option__label">Start Date</p>
          <div className="filter-option__bumper" />
          <DatePicker
            className="filter-option__input filter-option__input--date"
            selected={inputStartDateTime}
            onChange={(e) => {
              setInputStartDateTime(
                new Date(e).toISOString().replace("Z", "+00:00")
              );
            }}
            dateFormat="MM/dd/yyyy"
          />
        </div>
        <div className="filter-option__container">
          <p className="filter-option__label">End Date</p>
          <div className="filter-option__bumper" />
          <DatePicker
            className="filter-option__input filter-option__input--date"
            selected={inputEndDateTime}
            onChange={(e) => {
              setInputEndDateTime(
                new Date(e).toISOString().replace("Z", "+00:00")
              );
            }}
            dateFormat="MM/dd/yyyy"
          />
        </div>
        <div className="filter-option__separator" />
        <div className="filter-option__container">
          <p className="filter-option__label">LatLong 1</p>
          <div className="filter-option__bumper" />
          <input
            type="number"
            className="filter-option__input filter-option__input--number"
            value={bboxInputValues.latOne}
            onChange={(e) => {
              const value = Math.max(
                minLat,
                Math.min(maxLat, Number(e.target.value))
              );
              setBboxInputValues({
                ...bboxInputValues,
                latOne: value,
              });
            }}
          />
          <input
            type="number"
            className="filter-option__input filter-option__input--number"
            value={bboxInputValues.longOne}
            onChange={(e) => {
              const value = Math.max(
                minLong,
                Math.min(maxLong, Number(e.target.value))
              );
              setBboxInputValues({
                ...bboxInputValues,
                longOne: value,
              });
            }}
          />
        </div>
        <div className="filter-option__container">
          <p className="filter-option__label">LatLong 2</p>
          <div className="filter-option__bumper" />
          <input
            type="number"
            className="filter-option__input filter-option__input--number"
            value={bboxInputValues.latTwo}
            onChange={(e) => {
              const value = Math.max(
                minLat,
                Math.min(maxLat, Number(e.target.value))
              );
              setBboxInputValues({
                ...bboxInputValues,
                latTwo: value,
              });
            }}
          />
          <input
            type="number"
            className="filter-option__input filter-option__input--number"
            value={bboxInputValues.longTwo}
            onChange={(e) => {
              const value = Math.max(
                minLong,
                Math.min(maxLong, Number(e.target.value))
              );
              setBboxInputValues({
                ...bboxInputValues,
                longTwo: value,
              });
            }}
          />
        </div>
        <button
          className="filter-options__update-button"
          onClick={() => {
            setQueryOptions({
              collections: [inputCollection],
              startDateTime: inputStartDateTime,
              endDateTime: inputEndDateTime,
              bbox: {
                longOne: Number(bboxInputValues.longOne),
                latOne: Number(bboxInputValues.latOne),
                longTwo: Number(bboxInputValues.longTwo),
                latTwo: Number(bboxInputValues.latTwo),
              },
            });
            setFeaturesFound(null);
            setLoading(true);
          }}
        >
          Search
        </button>
      </div>
      <div className="sidebar__download">
        <p>Download search results as JSON.</p>
        <button
          className={
            featuresJson && !isLoading
              ? "sidebar__download-button"
              : "sidebar__download-button disabled"
          }
          disabled={!featuresJson || isLoading}
          onClick={downloadJson}
        >
          Download
        </button>
      </div>
    </div>
  );
}
