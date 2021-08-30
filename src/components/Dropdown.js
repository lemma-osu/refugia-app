import React from "react";
import Form from "react-bootstrap/Form";

export function ResponseDropdown({ config, onChange }) {
  return (
    <>
      {config.sliders.map((s, i) => (
        <Form.Group key={i} className="mb-3 mt-3">
          <Form.Label>{s.description}</Form.Label>
          <Form.Select
            name={s.name}
            defaultValue={s.initial_value}
            aria-label={s.description}
            onChange={onChange}
          >
            {s.steps.map((d) => (
              <option key={d.value} value={d.value}>
                {d.label}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
      ))}
    </>
  );
}

export function MiwDropdown({ onChange }) {
  return (
    <Form.Group className="mb-3 mt-3">
      <Form.Label>Model Inspector Widow (MIW) Size</Form.Label>
      <Form.Select
        name="miw-select"
        defaultValue={0}
        aria-label="MIW Size"
        onChange={onChange}
      >
        <option key={0} value={0}>
          9 x 6 kilometers
        </option>
        <option key={1} value={1}>
          18 x 12 kilometers
        </option>
      </Form.Select>
    </Form.Group>
  );
}
