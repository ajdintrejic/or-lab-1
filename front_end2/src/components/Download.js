import React from "react";

import { Card, Button } from "antd";

function Download() {
  return (
    <Card
      title="Download data"
      bordered={false}
      style={{ display: "block", margin: 20 }}
    >
      <a href="/somefile.txt" download>
        <Button type="primary" style={{ margin: 10 }}>
          JSON
        </Button>
      </a>
      <a href="/somefile.txt" download>
        <Button type="primary" style={{ margin: 10 }}>
          CSV
        </Button>
      </a>
    </Card>
  );
}

export default Download;
