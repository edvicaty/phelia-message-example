import React from "react";

import { Message, Section, Text } from "phelia";

export function TextMessage({ props }: any) {
  return (
    <Message>
      <Section>
        <Text>{props.message}</Text>
      </Section>
    </Message>
  );
}
