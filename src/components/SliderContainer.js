import React from "react";
import Slider from "./Slider";

const SliderContainer = ({ sliders, onChange }) => (
  <>
    {sliders.map((slider) => (
      <Slider key={slider.name} data={slider} onChange={onChange} />
    ))}
  </>
);

export default SliderContainer;
