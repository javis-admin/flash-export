import React from "react";
import Button from "./Button";
import Download from "./Icons/Download";
import { useFlashExport } from "./FlashExportProvider";

const ExportButton = ({ type }) => {
  const { startExport } = useFlashExport();
  return (
    <Button type={type} onClick={startExport}>
      <Download />
      {` `}Export
    </Button>
  );
};

export default ExportButton;
