import React from "react";
import Slider from "./Slider";

export default function SliderContainer({ sliders, onChange }) {
  return (
    <>
      {sliders.map((slider) => (
        <Slider key={slider.name} data={slider} onChange={onChange} />
      ))}
    </>
  );
}
