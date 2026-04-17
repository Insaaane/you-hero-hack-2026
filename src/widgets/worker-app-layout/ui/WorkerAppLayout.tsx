import { useEffect, useMemo, useState } from "react";
import { Button, Drawer, Flex, Typography } from "antd";
import { Outlet, useLocation, useNavigate } from "react-router";
import { setCurrentRole } from "@/app/model/sessionSlice";
import { RoleSwitcher } from "@/features/role-switcher";
import { useAppDispatch } from "@/shared/lib/store";

const navigationItems = [
  { label: "Заявка на обход", path: "/inspector/rounds/1488228" },
  { label: "Маршрут", path: "/inspector/route" },
  { label: "Все задачи", path: "/inspector/tasks" },
  { label: "Чек-листы", path: "/inspector/checklists" },
  { label: "Показания", path: "/inspector/readings" },
  { label: "Фотофиксация", path: "/inspector/photo" },
];

function getTitle(pathname: string) {
  if (pathname.includes("/rounds/")) {
    return `Обход ${pathname.split("/").at(-1) ?? ""}`;
  }

  const currentItem = navigationItems.find((item) => item.path === pathname);
  return currentItem?.label ?? "Мобильный обходчик";
}

export function WorkerAppLayout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const title = useMemo(() => getTitle(location.pathname), [location.pathname]);

  useEffect(() => {
    dispatch(setCurrentRole("inspector"));
  }, [dispatch]);

  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 0);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleBack = () => {
    if (location.pathname.includes("/rounds/")) {
      navigate("/inspector/tasks");
      return;
    }

    navigate("/inspector/rounds/1488228");
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  return (
    <div className="worker-shell">
      <header
        className={`worker-topbar ${
          hasScrolled ? "worker-topbar--scrolled" : ""
        }`}
      >
        <Button
          type="text"
          className="worker-topbar__button"
          aria-label="Назад"
          onClick={handleBack}
        >
          <span className="worker-topbar__back" aria-hidden="true" />
        </Button>

        <Typography.Text className="worker-topbar__title">
          {title}
        </Typography.Text>

        <Button
          type="text"
          className="worker-topbar__button"
          aria-label="Открыть меню"
          onClick={() => setIsMenuOpen(true)}
        >
          <span className="worker-topbar__grid" aria-hidden="true" />
        </Button>
      </header>

      <Outlet />

      <Drawer
        title="Меню"
        placement="right"
        width={320}
        open={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
      >
        <Flex vertical gap={20}>
          <RoleSwitcher />

          <nav aria-label="Разделы обходчика">
            <Flex vertical gap={8}>
              {navigationItems.map((item) => (
                <Button
                  key={item.path}
                  block
                  type={location.pathname === item.path ? "primary" : "default"}
                  onClick={() => handleNavigate(item.path)}
                >
                  {item.label}
                </Button>
              ))}
            </Flex>
          </nav>
        </Flex>
      </Drawer>
    </div>
  );
}
