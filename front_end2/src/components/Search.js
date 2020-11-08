import React from "react";

import { Card, Form, Input, Button, Radio } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import { Table } from "antd";
import reqwest from "reqwest";

const columns = [
  {
    title: "Name",
    dataIndex: "name",
    sorter: true,
    render: (name) => `${name.first} ${name.last}`,
    width: "20%",
  },
  {
    title: "Gender",
    dataIndex: "gender",
    filters: [
      { text: "Male", value: "male" },
      { text: "Female", value: "female" },
    ],
    width: "20%",
  },
  {
    title: "Email",
    dataIndex: "email",
  },
];

const getRandomuserParams = (params) => {
  return {
    results: params.pagination.pageSize,
    page: params.pagination.current,
    ...params,
  };
};

class Search extends React.Component {
  state = {
    data: [],
    pagination: {
      current: 1,
      pageSize: 10,
    },
    loading: false,
  };

  componentDidMount() {
    const { pagination } = this.state;
    this.fetch({ pagination });
  }

  handleTableChange = (pagination, filters, sorter) => {
    this.fetch({
      sortField: sorter.field,
      sortOrder: sorter.order,
      pagination,
      ...filters,
    });
  };

  fetch = (params = {}) => {
    this.setState({ loading: true });
    reqwest({
      url: "https://randomuser.me/api",
      method: "get",
      type: "json",
      data: getRandomuserParams(params),
    }).then((data) => {
      console.log(data);
      this.setState({
        loading: false,
        data: data.results,
        pagination: {
          ...params.pagination,
          total: 200,
          // 200 is mock data, you should read it from server
          // total: data.totalCount,
        },
      });
    });
  };

  render() {
    const { data, pagination, loading } = this.state;
    return (
      <Card
        title="Polje za pretragu"
        bordered={false}
        style={{ display: "block", margin: 20 }}
      >
        <Form.Item
          label="Naziv distribucije"
          tooltip={{
            title: "Prema ovome će se pretraživati podatci",
            icon: <InfoCircleOutlined />,
          }}
        >
          <Input placeholder="npr. Debian" />
        </Form.Item>
        <Form form={form} layout="vertical">
          <Form.Item label="Polja za pretragu" name="requiredMark">
            <Radio.Group>
              <Radio.Button value={"both"}>Sva polja (wildcard)</Radio.Button>
              <Radio.Button value={"dist"}>Naziv distribucije</Radio.Button>
              <Radio.Button value={"upst"}>
                Naziv upstream distribucije
              </Radio.Button>
            </Radio.Group>
          </Form.Item>

          <Form.Item>
            <Button type="primary">Pretraga</Button>
          </Form.Item>
        </Form>
        <Table columns={columns} dataSource={data} />
      </Card>
    );
  }
}

export default Search;
