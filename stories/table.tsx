import React, { useMemo } from "react";
import { AgGridReact } from "ag-grid-react";
import { faker } from "@faker-js/faker";

import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-balham.css";

import { TailedEllipsis } from "../src";

function getRenderer(field: string) {
  return ({ data }) => {
    const text = data[field];

    return <TailedEllipsis tailLength={5}>{text}</TailedEllipsis>;
  };
}

const columnDefs = [
  { field: "name", cellRenderer: getRenderer("name"), resizable: true },
  { field: "text", cellRenderer: getRenderer("text"), resizable: true },
  { field: "email", cellRenderer: getRenderer("email"), resizable: true },
];

function generateItem() {
  return {
    name: faker.name.fullName(),
    email: faker.internet.email(),
    text: faker.lorem.sentences(),
  };
}

export const Table: React.FC<{ rowsNumber?: number }> = ({
  rowsNumber = 10,
}) => {
  const data = useMemo(
    () => new Array(rowsNumber).fill(null).map(generateItem),
    [rowsNumber]
  );

  return (
    <div className="ag-theme-balham" style={{ height: 400, width: 1000 }}>
      <AgGridReact
        enableCellTextSelection={true}
        rowData={data}
        columnDefs={columnDefs}
        suppressRowVirtualisation={true}
      ></AgGridReact>
    </div>
  );
};
