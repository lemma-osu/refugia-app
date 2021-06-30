import React from "react";
import { min, max } from "d3";

const Slider = ({ data, onChange }) => {
  const min_value = min(data.steps, (d) => d.value);
  const max_value = max(data.steps, (d) => d.value);
  return (
    <>
      <label htmlFor={data.name} className="form-label">
        {data.description}
      </label>
      <input
        className="form-range"
        type="range"
        id={data.name}
        name={data.name}
        min={min_value}
        max={max_value}
        defaultValue={data.initial_value}
        step={1}
        onChange={onChange}
      />
    </>
  );
};

export default Slider;
