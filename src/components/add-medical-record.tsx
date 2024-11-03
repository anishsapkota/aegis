import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  Row,
  Select,
  Space,
  Upload,
  Typography,
  Modal,
  message,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import {
  MedicalRecord,
  RecordType,
  RecordStatus,
  Attachment,
} from "@/data/medical-data-demo"; // Update to your file path for types
import { useSession } from "next-auth/react";
import { uploadJsonPinata } from "@/data/pinata-data-api";
import UploadFileComponent from "./upload-file";
import { FileListItem, UploadResponse } from "pinata";
import FormItem from "antd/es/form/FormItem";

const { Option } = Select;
const { TextArea } = Input;

const CreateMedicalRecord = ({ patientDID }: { patientDID: string }) => {
  const [form] = Form.useForm();
  const [attachment, setAttachment] = useState<Attachment>();
  const session = useSession();
  const [isFileNameModalOpen, setIsFileNameModalOpen] = useState(false);
  const [formValues, setFormValues] = useState<any>();
  const [filename, setFilename] = useState("");

  const handleSubmit = async (values: any) => {
    const record: MedicalRecord = {
      patientId: patientDID,
      id: `MR-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: values.status,
      attachments: attachment ? [attachment] : [],
      provider: session.data?.user.did,
      metadata: {
        title: values.title,
        specialtyType: values.specialtyType,
        urgencyLevel: values.urgencyLevel,
        confidentialityLevel: values.confidentialityLevel,
        description: values.description,
        language: "",
      },
      recordType: values.recordType,
    };

    // Call backend API to save the record

    console.log("Submitting Medical Record:", record);

    const res = await uploadJsonPinata(
      `${filename}.json`,
      record,
      patientDID,
      session.data?.user.did!,
    );
    if (res.cid) {
      message.success("Added Medical Record for patient");
      setIsFileNameModalOpen(false);
    }
    form.resetFields();
  };

  const handleCreate = (values: any) => {
    setIsFileNameModalOpen(true);
    setFormValues(values);
  };

  const handleUploadedFile = (uploadedFile: UploadResponse) => {
    const attachment: Attachment = {
      id: uploadedFile.id,
      cid: uploadedFile.cid,
      uploadedAt: uploadedFile.created_at,
      fileSize: uploadedFile.size,
      fileType: uploadedFile.mime_type,
      fileName: uploadedFile.name,
    };
    setAttachment(attachment);
  };
  return (
    <Card
      style={{
        maxWidth: "800px",
        margin: "auto",
        marginTop: "20px",
        maxHeight: "80vh",
        overflowY: "scroll",
      }}
    >
      <Typography.Title level={4}>Create Medical Record</Typography.Title>
      <Divider />
      <Form form={form} layout="vertical" onFinish={handleCreate}>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="patientId" label="Patient ID">
              <Input disabled type="text" defaultValue={patientDID} />
            </Form.Item>

            <Form.Item
              name="recordType"
              label="Record Type"
              rules={[{ required: true, message: "Record type is required" }]}
            >
              <Select placeholder="Select record type">
                <Option value="PRESCRIPTION">Prescription</Option>
                <Option value="LAB_RESULT">Lab Result</Option>
                <Option value="CONSULTATION">Consultation</Option>
                <Option value="SURGERY">Surgery</Option>
                <Option value="VACCINATION">Vaccination</Option>
                <Option value="ALLERGY">Allergy</Option>
                <Option value="DISCHARGE_SUMMARY">Discharge Summary</Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="status"
              label="Status"
              rules={[{ required: true, message: "Status is required" }]}
            >
              <Select placeholder="Select urgency level">
                <Option value="ACTIVE">Active</Option>
                <Option value="ARCHIVED">Archived</Option>
                <Option value="PENDING_REVIEW">Pending review</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="createdAt"
              label="Date Created"
              rules={[{ required: true, message: "Date is required" }]}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item name="specialtyType" label="Specialty Type">
              <Input placeholder="e.g., Cardiology, Dermatology" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="title"
          label="Record Title"
          rules={[{ required: true, message: "Title is required" }]}
        >
          <Input placeholder="Enter title of the record" />
        </Form.Item>
        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true, message: "Description is required" }]}
        >
          <TextArea rows={4} placeholder="Enter description" />
        </Form.Item>

        <Form.Item name="urgencyLevel" label="Urgency Level">
          <Select placeholder="Select urgency level">
            <Option value="LOW">Low</Option>
            <Option value="MEDIUM">Medium</Option>
            <Option value="HIGH">High</Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="confidentialityLevel"
          label="Confidentiality Level"
          rules={[
            { required: true, message: "Confidentiality level is required" },
          ]}
        >
          <Select placeholder="Select confidentiality level">
            <Option value="NORMAL">Normal</Option>
            <Option value="SENSITIVE">Sensitive</Option>
            <Option value="HIGHLY_SENSITIVE">Highly Sensitive</Option>
          </Select>
        </Form.Item>

        <Divider />
        <Typography.Title level={5}>Upload Attachments</Typography.Title>

        <UploadFileComponent onUploadFinish={handleUploadedFile} />

        <Divider />
        <Space>
          <Button type="primary" htmlType="submit">
            Create Record
          </Button>
          <Button htmlType="button" onClick={() => form.resetFields()}>
            Reset
          </Button>
        </Space>
      </Form>
      <Modal
        open={isFileNameModalOpen}
        onCancel={() => setIsFileNameModalOpen(false)}
        onOk={() => handleSubmit(formValues)}
      >
        <Form layout="vertical">
          <FormItem name="file name" label="File Name">
            <Input
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
            />
          </FormItem>
        </Form>
      </Modal>
    </Card>
  );
};

export default CreateMedicalRecord;
