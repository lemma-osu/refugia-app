import React from "react";

export default function Card({ children }) {
  return (
    <div
      className="card text-white bg-dark m-3"
      style={{ maxWidth: "20rem", height: "calc(100vh - 32px)" }}
    >
      <div className="card-body">{children}</div>
    </div>
  );
}

export function Dropdown({ on_change }) {
  return (
    <select onChange={(e) => on_change(e.currentTarget.value)}>
      <option value="0">nofp</option>
      <option value="1">ogsi</option>
      <option value="2">op</option>
    </select>
  );
}

export function ResponseDropdown({ config, on_change }) {
  return (
    <select onChange={on_change}>
      {config.tiles.map((d, i) => (
        <option value={i}>{d.name}</option>
      ))}
    </select>
  );
}
