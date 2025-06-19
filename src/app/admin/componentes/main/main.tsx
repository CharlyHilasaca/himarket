import React from "react";
import Header from "../header/header";
import Actions from "./actions/actions";
import Tables from "./tables/tables";

interface MainContentProps {
  adminName: string;
  selectedOption: string;
  projectImage: string;
  handleLogout: () => void;
}

export default function MainContent({
  adminName,
  selectedOption,
  projectImage,
  handleLogout,
}: MainContentProps) {
  return (
    <div className="main-content">
      <Header
        adminName={adminName}
        selectedOption={selectedOption}
        projectImage={projectImage}
        handleLogout={handleLogout}
      />
      <Actions />
      <Tables />
    </div>
  );
}