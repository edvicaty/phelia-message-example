import React from "react";
import axios from "axios";

import {
  Button,
  Divider,
  Input,
  Message,
  Modal,
  MultiSelectMenu,
  PheliaMessageProps,
  Section,
  Text,
  DatePicker,
  Actions,
} from "phelia";

export function TextMessage({ props }: any) {
  return (
    <Message>
      <Section>
        <Text>{props.message}</Text>
      </Section>
    </Message>
  );
}
