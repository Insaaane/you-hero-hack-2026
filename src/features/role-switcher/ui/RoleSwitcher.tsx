import { Segmented, Space, Typography } from "antd";
import { useNavigate } from "react-router";
import { setCurrentRole } from "@/app/model/sessionSlice";
import type { UserRole } from "@/entities/user";
import { useAppDispatch, useAppSelector } from "@/shared/lib/store";

const roleOptions: Array<{ label: string; value: UserRole }> = [
  { label: "Обходчик", value: "inspector" },
  { label: "Диспетчер", value: "dispatcher" },
];

export function RoleSwitcher() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const currentRole = useAppSelector((state) => state.session.currentRole);

  const handleRoleChange = (value: string | number) => {
    const nextRole: UserRole =
      value === "dispatcher" ? "dispatcher" : "inspector";

    dispatch(setCurrentRole(nextRole));
    navigate(
      nextRole === "inspector"
        ? "/inspector/rounds"
        : "/dispatcher/rounds",
    );
  };

  return (
    <Space orientation="vertical" size={8} style={{ width: "100%" }}>
      <Typography.Text type="secondary">Временная роль</Typography.Text>
      <Segmented
        block
        options={roleOptions}
        value={currentRole}
        onChange={handleRoleChange}
      />
    </Space>
  );
}
