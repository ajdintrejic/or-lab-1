import { Layout, Menu, Breadcrumb } from "antd";
import Search from "./components/Search2";
import Download from "./components/Download";

const { Header, Content, Footer } = Layout;

function App() {
  return (
    <Layout className="layout" style={{ minHeight: "100vh" }}>
      <Header>
        <div className="logo" />
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["1"]}>
          <Menu.Item key="1">or-lab-2</Menu.Item>
        </Menu>
      </Header>
      <Content style={{ padding: "0 50px" }}>
        <Breadcrumb style={{ margin: "16px 0" }}>
          <Breadcrumb.Item>or</Breadcrumb.Item>
          <Breadcrumb.Item>lab</Breadcrumb.Item>
          <Breadcrumb.Item>2</Breadcrumb.Item>
        </Breadcrumb>
        <div>
          <Download />
          <Search />
        </div>
      </Content>
      <Footer style={{ textAlign: "center" }}>Ajdin Trejić FER OR LAB 2</Footer>
    </Layout>
  );
}

export default App;
