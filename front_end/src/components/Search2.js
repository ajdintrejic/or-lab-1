import React from "react";
import { Table, Card, Button, Input, Radio } from "antd";
import reqwest from "reqwest";
import SearchDownload from "./SearchDownload";

const columns = [
  {
    title: "Distribution name",
    dataIndex: "distributionname",
    sorter: true,
    render: (distributionname) => `${distributionname}`,
  },
  {
    title: "Base distribution name",
    dataIndex: "basename",
    sorter: true,
    render: (basename) => `${basename}`,
  },
  {
    title: "Release type",
    dataIndex: "releasetype",
    sorter: true,
    render: (releasetype) => `${releasetype}`,
  },
  {
    title: "Distrowatch rank",
    dataIndex: "distrowatchrank",
    sorter: true,
    render: (distrowatchrank) => `${distrowatchrank}`,
  },
  {
    title: "Home page",
    dataIndex: "homepage",
    sorter: true,
    render: (homepage) => `${homepage}`,
  },
  {
    title: "Package Manager",
    dataIndex: "packagemanager",
    sorter: true,
    render: (packagemanager) => `${packagemanager}`,
  },
  {
    title: "Supported Architecure",
    dataIndex: "releasetype",
    sorter: true,
    render: (supportedarch) => `${supportedarch}`,
  },
  {
    title: "Supported DE",
    dataIndex: "supportedde",
    sorter: true,
    render: (supportedde) => `${supportedde}`,
  },
  {
    title: "Target use",
    dataIndex: "targetuse",
    sorter: true,
    render: (targetuse) => `${targetuse}`,
  },
  {
    title: "Wikipedia page",
    dataIndex: "wikipage",
    sorter: true,
    render: (wikipage) => `${wikipage}`,
  },
  {
    title: "Year of creation",
    dataIndex: "yearofcreation",
    sorter: true,
    render: (yearofcreation) => `${yearofcreation}`,
  },
  {
    title: "Original developers",
    dataIndex: "od",
    sorter: true,
    render: (od) => `${od.name}`,
  },
];

class Search2 extends React.Component {
  state = {
    data: [],
    loading: false,
    searchQuery: "",
    searchType: "wildcard",
  };

  componentDidMount() {
    this.fetch(this.state.searchQuery, this.state.searchType);
  }

  handleTableChange = (filters, sorter) => {
    this.fetch({
      sortField: sorter.field,
      sortOrder: sorter.order,
      ...filters,
    });
  };

  getParamsInJson = (params) => {
    console.log(params);
    return "a";
  };

  fetch = (searchQuery, searchType) => {
    this.setState({ loading: true });
    reqwest({
      url: "http://localhost:3001/api/v1/dist",
      method: "get",
      type: "json",
      data: { searchQuery, searchType },
    }).then((data) => {
      console.log(data);
      this.setState({
        loading: false,
        data: data,
      });
    });
  };

  render() {
    const { data, loading, searchType, searchQuery } = this.state;
    return (
      <Card
        title="Search data"
        bordered={false}
        style={{ display: "block", margin: 20 }}
      >
        <p style={{ margin: 10 }}>Search Query</p>
        <Input
          placeholder='try to search for "debian"'
          style={{ margin: 10, width: 400 }}
          onChange={(e) => {
            this.setState({
              searchQuery: e.target.value,
            });
          }}
        />
        <p style={{ margin: 10 }}>Search Type</p>
        <Radio.Group
          value={searchType}
          onChange={(e) => {
            this.setState({
              searchType: e.target.value,
            });
          }}
          style={{ margin: 10 }}
        >
          <Radio.Button value="wildcard">Wildcard</Radio.Button>
          <Radio.Button value="distribution">Distribution Name</Radio.Button>
          <Radio.Button value="base">Base Name</Radio.Button>
        </Radio.Group>
        <Button
          type="primary"
          onClick={() => this.componentDidMount()}
          style={{ margin: 10, display: "block" }}
        >
          Search
        </Button>
        <Table
          columns={columns}
          dataSource={data}
          loading={loading}
          onChange={this.handleTableChange}
          style={{ overflow: "scroll" }}
          pagination={false}
        />
        <SearchDownload data={data} />
      </Card>
    );
  }
}

export default Search2;
