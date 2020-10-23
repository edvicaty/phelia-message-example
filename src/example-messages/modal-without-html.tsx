import { Actions, Button, Home, PheliaHomeProps, Section, Text } from "phelia";
import React from "react";
import { MyModal } from "./modal-example";
export function HomeApp({ useState, useModal }: PheliaHomeProps) {
  const [counter, setCounter] = useState("counter", 0);
  const [notifications, setNotifications] = useState("notifications", []);
  const [form, setForm] = useState("form");
  const [user, setUser] = useState("user");

  useModal("modal", MyModal, (event) =>
    setForm(JSON.stringify(event.form, null, 2))
  );

  return <></>;
}
