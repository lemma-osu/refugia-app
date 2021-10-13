import React from "react";
import Button from "react-bootstrap/Button";

export default function DownloadButton({ title, href }) {
  const downloadFile = () => {
    alert(`Downloading: ${href}`);
    // window.location.href =
    //   "http://localhost:3002/projects/v2_small/rmin_raw_1_tmmx_raw_1.7z";
  };
  return (
    <Button variant="success" onClick={downloadFile}>
      {title}
    </Button>
  );
}
