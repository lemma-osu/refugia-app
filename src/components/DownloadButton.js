import React from "react";
import Button from "react-bootstrap/Button";

export default function DownloadButton({ title, href }) {
  const downloadFile = () => {
    // alert(`Downloading: ${href}`);
    window.location.href = href;
  };
  return (
    <Button variant="success" onClick={downloadFile}>
      {title}
    </Button>
  );
}
