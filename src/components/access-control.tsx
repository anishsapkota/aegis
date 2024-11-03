import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Input, Select, Tag, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { getMedicalRecordMetaData } from "@/data/medical-data-demo";
import { FileListItem } from "pinata";
import AddAccessModal from "./add-access-modal";
import { getFilesList, updateFileACL } from "@/data/pinata-data-api";
import { useSession } from "next-auth/react";
import { parseAccessControlList } from "@/lib/jsHelper";

const { Option } = Select;

const AccessControl = ({ record }: { record: FileListItem }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [accessList, setAccessList] = useState(
    parseAccessControlList(record.keyvalues.accessControlList),
  );
  const [form] = Form.useForm();

  const openModal = () => setIsModalVisible(true);
  const closeModal = () => setIsModalVisible(false);

  const addAccess = async (values: { did: any; permission: "READ" }) => {
    const { did, permission } = values;
    const newAccessList = { ...accessList, [did]: permission };
    const res = await updateFileACL(record.id, newAccessList);
    if (res) {
      setAccessList(newAccessList);
      message.success("Access added successfully.");
    } else {
      message.success("Error updating the ACL");
    }
    closeModal();
  };

  const revokeAccess = async (did: string | number) => {
    const newAccessList = { ...accessList };
    delete newAccessList[did];
    const res = await updateFileACL(record.id, newAccessList);
    if (res) {
      setAccessList(newAccessList);
      message.success("Access revoked successfully.");
    } else {
      message.success("Error updating the ACL");
    }
    closeModal();
  };

  const columns = [
    {
      title: "DID",
      dataIndex: "did",
      key: "did",
      render: (text: string) => <span title={text}>{text}</span>,
    },
    {
      title: "Permission",
      dataIndex: "permission",
      key: "permission",
      render: (text: string) => (
        <Tag color={text.includes("WRITE") ? "volcano" : "green"}>{text}</Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: { did: string | number }) => (
        <Button type="link" onClick={() => revokeAccess(record.did)}>
          Revoke
        </Button>
      ),
    },
  ];

  const accessData = Object.keys(accessList).map((did) => ({
    key: did,
    did,
    permission: accessList[did],
  }));

  return (
    <div>
      <h3>{record.name}</h3>
      <Table columns={columns} dataSource={accessData} pagination={false} />

      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={openModal}
        style={{ marginTop: 16 }}
      >
        Add Access
      </Button>

      <AddAccessModal
        onAddAccess={addAccess}
        visible={isModalVisible}
        onClose={closeModal}
      />
      {/* <Modal
        title="Add New Access"
        open={isModalVisible}
        onCancel={closeModal}
        onOk={() => form.submit()}
        okText="Add"
      >
        <Form form={form} layout="vertical" onFinish={addAccess}>
          <Form.Item
            name="did"
            label="DID"
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
              <Option value="WRITE">WRITE</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal> */}
    </div>
  );
};

const AccessControlList = () => {
  const [medicalRecordMetaData, setMedicalRecordMetaData] =
    useState<FileListItem[]>();
  const { data } = useSession();

  useEffect(() => {
    (async () => {
      const res = await getFilesList(data?.user.did!);
      console.log(res);
      if (res) {
        setMedicalRecordMetaData(res.files);
      }
    })();
  }, []);
  return (
    <div>
      {medicalRecordMetaData &&
        medicalRecordMetaData.map((record) => (
          <AccessControl key={record.id} record={record} />
        ))}
    </div>
  );
};

export default AccessControlList;
