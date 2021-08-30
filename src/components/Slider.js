import React from "react";
import { min, max } from "d3";

const Slider = ({ data, onChange }) => {
  const minValue = min(data.steps, (d) => d.value);
  const maxValue = max(data.steps, (d) => d.value);
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
        min={minValue}
        max={maxValue}
        defaultValue={data.initial_value}
        step={1}
        onChange={onChange}
      />
    </>
  );
};

export default Slider;
