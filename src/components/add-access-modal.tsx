import React, { useState } from "react";
import { Modal, Form, Input, Select, Button, Checkbox, message } from "antd";
import { FileListItem } from "pinata";
import { updateFileACL } from "@/data/pinata-data-api";
import { parseAccessControlList } from "@/lib/jsHelper";
import { useSession } from "next-auth/react";

const { Option } = Select;

type AddAccessModalProps = {
  visible: boolean;
  onClose: () => void;
  practitionerDID?: string;
  onAddAccess?: (accessData: { did: string; permission: "READ" }) => void;
  patientRecords?: FileListItem[];
};

const AddAccessModal: React.FC<AddAccessModalProps> = ({
  visible,
  onClose,
  onAddAccess,
  practitionerDID,
  patientRecords,
}) => {
  const [form] = Form.useForm();
  const [selectedRecord, setSelectedRecord] = useState<FileListItem[]>([]);
  const handleCheckboxChange = (recordId: FileListItem, checked: boolean) => {
    setSelectedRecord((prev) =>
      checked ? [...prev, recordId] : prev.filter((id) => id !== recordId),
    );
  };

  const handleFinish = (values: { did: string; permission: "READ" }) => {
    const did = values.did;
    onAddAccess
      ? onAddAccess(values)
      : selectedRecord.forEach(async (record) => {
          const accessList = parseAccessControlList(
            record.keyvalues.accessControlList,
          );
          const newAccessList = { ...accessList, [did]: values.permission };
          const res = await updateFileACL(record.id, newAccessList);
          if (res) {
            message.success("ACL updated successfully");
          } else {
            message.error(`Error updating acl: ${record.name}`);
          }
        });

    form.resetFields();
    onClose();
  };

  return (
    <Modal
      title="Add New Access"
      open={visible}
      onCancel={onClose}
      onOk={() => form.submit()}
      okText="Add"
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{ did: practitionerDID || "" }}
        onFinish={handleFinish}
      >
        <Form.Item
          name="did"
          label="Practitioner DID"
          rules={[{ required: true, message: "Please enter a DID." }]}
        >
          <Input placeholder="Enter DID" />
        </Form.Item>
        <Form.Item
          name="permission"
          label="Permission"
          rules={[{ required: true, message: "Please select a permission." }]}
        >
          <Select placeholder="Select Permission">
            <Option value="READ">READ</Option>
          </Select>
        </Form.Item>
        {patientRecords && patientRecords.length > 0 && (
          <Form.Item label="Select records to disclose">
            {patientRecords.map((record) => (
              <Checkbox
                key={record.id}
                onChange={(e) => handleCheckboxChange(record, e.target.checked)}
              >
                {record.name}
              </Checkbox>
            ))}
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
};

export default AddAccessModal;
