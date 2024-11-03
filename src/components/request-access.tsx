import React, { useState } from "react";
import {
  Button,
  Card,
  Form,
  Input,
  Modal,
  Select,
  Typography,
  message,
} from "antd";
import { SendOutlined } from "@ant-design/icons";
import { useSession } from "next-auth/react";
import { sendAccessRquest } from "@/lib/server-actions";

const { Title, Text } = Typography;
const { Option } = Select;

const RequestAccessPage = () => {
  const [form] = Form.useForm();
  const { data: session } = useSession();

  const handleRequestAccess = async (values: {
    practitionerDID: string;
    patientDID: string;
    accessType: string;
  }) => {
    await sendAccessRquest(values.patientDID);
    message.success("Access request submitted successfully.");
    form.resetFields();
  };

  return (
    <Card>
      <Title level={4}>Request Access for Medical Records</Title>
      <Text>Please fill in the following details to request access.</Text>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleRequestAccess}
        initialValues={{
          practitionerDID: session?.user?.did || "", // Default to session DID if available
        }}
        style={{ marginTop: 20 }}
      >
        <Form.Item
          label="Practitioner DID"
          name="practitionerDID"
          rules={[{ required: true, message: "Please enter your DID" }]}
        >
          <Input placeholder="Enter your DID" />
        </Form.Item>

        <Form.Item
          label="Patient DID"
          name="patientDID"
          rules={[
            { required: true, message: "Please enter the patient's DID" },
          ]}
        >
          <Input placeholder="Enter patient DID" />
        </Form.Item>

        <Form.Item
          label="Access Type"
          name="accessType"
          rules={[{ required: true, message: "Please select an access type" }]}
        >
          <Select placeholder="Select Access Type">
            <Option value="READ">READ</Option>
          </Select>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" icon={<SendOutlined />}>
            Submit Request
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default RequestAccessPage;
