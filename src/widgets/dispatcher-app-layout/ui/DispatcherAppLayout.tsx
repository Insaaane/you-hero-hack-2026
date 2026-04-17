import { useEffect, useMemo, useState } from "react";
import {
  AppstoreOutlined,
  EnvironmentOutlined,
  FileTextOutlined,
  LeftOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  RightOutlined,
  TeamOutlined,
  ToolOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Layout, Menu, type MenuProps } from "antd";
import { Link, Outlet, useLocation, useNavigate } from "react-router";
import { setCurrentRole } from "@/app/model/sessionSlice";
import { RoleSwitcher } from "@/features/role-switcher";
import { useAppDispatch } from "@/shared/lib/store";

const { Header, Content, Sider } = Layout;

const dispatcherNavigationItems: NonNullable<MenuProps["items"]> = [
  {
    key: "/dispatcher/rounds",
    icon: <FileTextOutlined />,
    label: "Обходы",
  },
  {
    key: "/dispatcher/maintenance",
    icon: <ToolOutlined />,
    label: "Заявки на техобслуживание",
  },
  {
    key: "/dispatcher/locations",
    icon: <EnvironmentOutlined />,
    label: "Локации",
  },
  {
    key: "/dispatcher/equipment",
    icon: <AppstoreOutlined />,
    label: "Оборудование",
  },
  {
    key: "/dispatcher/employees",
    icon: <TeamOutlined />,
    label: "Сотрудники",
  },
];

function getSelectedNavigationKey(pathname: string) {
  if (pathname.startsWith("/dispatcher/rounds")) {
    return "/dispatcher/rounds";
  }

  const selectedItem = dispatcherNavigationItems.find((item) => {
    if (!item || !("key" in item) || typeof item.key !== "string") {
      return false;
    }

    return item.key === "/dispatcher/rounds"
      ? pathname === item.key
      : pathname.startsWith(item.key);
  });

  return selectedItem && "key" in selectedItem && typeof selectedItem.key === "string"
    ? selectedItem.key
    : "/dispatcher/rounds";
}

export function DispatcherAppLayout() {
  const [collapsed, setCollapsed] = useState(true);
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const selectedNavigationKey = useMemo(
    () => getSelectedNavigationKey(location.pathname),
    [location.pathname],
  );

  useEffect(() => {
    dispatch(setCurrentRole("dispatcher"));
  }, [dispatch]);

  return (
    <Layout className="dispatcher-shell">
      <Header className="dispatcher-topbar">
        <Link
          to="/dispatcher/rounds"
          className="dispatcher-topbar__brand"
          aria-label="ТехДозор"
        >
          <img
            src="/Logo_techdosor.svg"
            alt="ТехДозор"
            className="dispatcher-topbar__logo"
          />
        </Link>

        <Button
          type="text"
          className="dispatcher-topbar__mobile-menu"
          aria-label={collapsed ? "Открыть меню" : "Закрыть меню"}
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => setCollapsed((current) => !current)}
        />

        <Avatar size={42} className="dispatcher-topbar__avatar">
          И
        </Avatar>
      </Header>

      <Layout className="dispatcher-workspace">
        <Sider
          theme="light"
          width={272}
          collapsedWidth={48}
          collapsed={collapsed}
          collapsible
          trigger={null}
          className="dispatcher-sidebar"
        >
          <Menu
            mode="inline"
            selectedKeys={[selectedNavigationKey]}
            items={dispatcherNavigationItems}
            className="dispatcher-sidebar__menu"
            onClick={({ key }) => navigate(key)}
          />

          <div className="dispatcher-sidebar__footer">
            <RoleSwitcher />
          </div>

          <Button
            type="text"
            className="dispatcher-sidebar__trigger"
            aria-label={collapsed ? "Развернуть меню" : "Свернуть меню"}
            icon={collapsed ? <RightOutlined /> : <LeftOutlined />}
            onClick={() => setCollapsed((current) => !current)}
          />
        </Sider>

        <Content className="dispatcher-content">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
