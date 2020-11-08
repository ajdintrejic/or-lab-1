import React from "react";
import { Button } from "antd";

function SearchDownload(data) {
  const downloadJsonFile = () => {
    const element = document.createElement("a");
    const file = new Blob(
      [decodeURIComponent(encodeURI(JSON.stringify(data, null, 2)))],
      {
        type: "text/plain",
      }
    );
    element.href = URL.createObjectURL(file);
    element.download = "or-lab-2.json";
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  };

  const convertToCSV = (objArray) => {
    console.log(objArray);
    var array = typeof objArray != "object" ? JSON.parse(objArray) : objArray;
    var str = "";
    var header =
      "distributionname,basename,releasetype,packagemanager,supportedarch,yearofcreation,homepage,distrowatchrank,targetuse,supportedde,wikipage,developername";
    str = header + "\r\n";
    for (var i = 0; i < array.data.length; i++) {
      var line = "";
      for (var index in array.data[i]) {
        if (line !== "") line += ",";
        line += array.data[i][index];
      }

      str += line + "\r\n";
    }
    return str;
  };

  const downloadCSVFile = () => {
    var CSVData = convertToCSV(data);
    const element = document.createElement("a");
    const file = new Blob([decodeURIComponent(encodeURI(CSVData))], {
      type: "text/plain",
    });
    element.href = URL.createObjectURL(file);
    element.download = "or-lab-2.csv";
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  };

  return (
    <>
      <Button style={{ margin: 10 }} onClick={downloadJsonFile}>
        Export table to JSON
      </Button>
      <Button style={{ margin: 10 }} onClick={downloadCSVFile}>
        Export table to CSV
      </Button>
    </>
  );
}

export default SearchDownload;
