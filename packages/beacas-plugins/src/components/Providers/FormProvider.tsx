import { Form } from "@arco-design/web-react";
import React from "react";

export const FormProvider = ({ children }: { children: React.ReactNode }) => {
  const [form] = Form.useForm();
  return <Form form={form}>{children}</Form>;
};
