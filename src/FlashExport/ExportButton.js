import React from "react";
import Button from "./Button";
import Download from "./Icons/Download";
import { useFlashExport } from "./FlashExportProvider";

const ExportButton = ({ type }) => {
  const { handleClick } = useFlashExport();
  return (
    <Button type={type} onClick={handleClick}>
      <Download />
      {` `}Export
    </Button>
  );
};

export default ExportButton;
