import React from "react";
import Header from "../header/header";
import Tables from "./tables/tables";

interface HistorialContentProps {
  adminName: string;
  selectedOption: string;
  projectImage: string;
  handleLogout: () => void;
}

export default function HistorialContent({
  adminName,
  selectedOption,
  projectImage,
  handleLogout,
}: HistorialContentProps) {
  return (
    <div className="main-content">
      <Header
        adminName={adminName}
        selectedOption={selectedOption}
        projectImage={projectImage}
        handleLogout={handleLogout}
      />
      <Tables />
    </div>
  );
}