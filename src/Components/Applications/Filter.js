import React from "react";
import "./Filter.css";

function Filter({ setFilter }) {
  return (
    <div className="filter">
      <select onChange={(e) => setFilter(e.target.value)}>
        <option>All</option>
        <option>Applied</option>
        <option>Interview</option>
        <option>Offer</option>
        <option>Rejected</option>
      </select>
    </div>
  );
}

export default Filter;