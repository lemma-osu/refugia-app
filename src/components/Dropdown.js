import React from "react";
import Form from "react-bootstrap/Form";

function ResponseVariableDropdown({ v, selected, onChange }) {
  function handleChange(e) {
    onChange({ [e.target.name]: +e.target.value });
  }

  return (
    <Form.Group className="mb-3 mt-3 ms-3">
      <Form.Label>{v.description}</Form.Label>
      <Form.Select
        name={v.name}
        aria-label={v.description}
        value={selected}
        onChange={handleChange}
      >
        {v.steps.map((d) => (
          <option key={d.value} value={d.value}>
            {d.label}
          </option>
        ))}
      </Form.Select>
    </Form.Group>
  );
}

function ResponseVariableDropdownGroup({ variables, responses, onChange }) {
  return (
    <>
      {variables.map((v, idx) => (
        <ResponseVariableDropdown
          key={idx}
          v={v}
          selected={responses[v.name]}
          onChange={onChange}
        />
      ))}
    </>
  );
}

export function ResponseSurfaceDropdown({
  config,
  surface,
  responses,
  onSurfaceChange,
  onResponseChange,
}) {
  return (
    <Form.Group className="mb-3 mt-3">
      <Form.Label>Response Surface</Form.Label>
      <Form.Select
        name="response"
        defaultValue={0}
        aria-label="Response Surface"
        onChange={onSurfaceChange}
      >
        {config.sliders.map((s, i) => (
          <option key={i} value={i}>
            {s.description}
          </option>
        ))}
      </Form.Select>
      <ResponseVariableDropdownGroup
        variables={config.sliders[surface].variables}
        responses={responses}
        onChange={onResponseChange}
      />
    </Form.Group>
  );
}

export function MiwDropdown({ onChange }) {
  return (
    <Form.Group className="mb-3 mt-3">
      <Form.Label>Model Inspector Window (MIW) Size</Form.Label>
      <Form.Select
        name="miw-select"
        defaultValue={1}
        aria-label="MIW Size"
        onChange={onChange}
      >
        <option key={0} value={0}>
          4.5 x 3 kilometers
        </option>
        <option key={1} value={1}>
          9 x 6 kilometers
        </option>
        <option key={2} value={2}>
          18 x 12 kilometers
        </option>
      </Form.Select>
    </Form.Group>
  );
}
