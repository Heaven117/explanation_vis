import React from "react";
import { predictionTag, categoryTag } from "./tags";

const InfoCard = ({ data, isAB = false }) => {
  return (
    <div className="info-card">
      <div className="top-info">
        <div className="label">ID: </div>
        {data?.id}
      </div>

      {!isAB &&(
        <>
          <div className="top-info">
            <div className="label">Category: </div>
            {categoryTag(data?.category)}
          </div>
          <div className="top-info">
            <div className="label">Label: </div>
            {predictionTag(data?.income)}
          </div>
          <div className="top-info">
            <div className="label">Prediction: </div>
            {predictionTag(data?.prediction)}
          </div>
        </>
      )}
    </div>
  );
};
export default InfoCard;
