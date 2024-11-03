import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  Divider,
  Flex,
  Form,
  Input,
  Modal,
  Row,
  Space,
  Table,
  Typography,
  message,
} from "antd";
import type { TableColumnsType } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import { MedicalRecord } from "@/data/medical-data-demo";
import CreateMedicalRecord from "./add-medical-record";
import { BiEdit } from "react-icons/bi";
import { useSession } from "next-auth/react";
import MedicalRecordsModal from "./medical-record-modal";
import { addPatient, getAllRegisteredPatients } from "@/data/did-store";
import { IoCopyOutline } from "react-icons/io5";
import { getPatientFiles } from "@/data/pinata-data-api";

const PatientsList = () => {
  const [showMedicalRecords, setShowMedicalRecords] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [patients, setPatients] = useState<any[]>([]);
  const [selectedMedicalRecord, setSelectedMedicalRecord] =
    useState<MedicalRecord>();
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [showAddMedicalRecordModal, setShowAddMedicalRecordModal] =
    useState(false);
  const [selectedPatientDID, setSelectedPatientDID] = useState("");
  const session = useSession();
  const [form] = Form.useForm();

  const handleModalClose = () => setShowMedicalRecords(false);

  const columns: TableColumnsType<any> = [
    {
      title: "S.N",
      dataIndex: "id",
      key: "id",
      width: 50,
    },
    {
      title: "Patient DID",
      dataIndex: "did",
      key: "did",
      width: 1000,
      render: (_text, record) => (
        <>
          <Space>
            <Typography.Text>{record.did}</Typography.Text>
            <IoCopyOutline
              onClick={() => {
                navigator.clipboard.writeText(record.did);
                message.success("DID copied");
              }}
              style={{ cursor: "pointer" }}
            />
          </Space>
        </>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_text, record) => (
        <Space size="large" align="center">
          <EyeOutlined
            style={{ color: "#1890ff", fontSize: "20px", cursor: "pointer" }}
            onClick={async () => {
              const medicalRecords = await getPatientFiles(record.did);
              console.log(medicalRecords);
              setMedicalRecords(medicalRecords as MedicalRecord[]);
              setShowMedicalRecords(true);
            }}
          />
          <BiEdit
            style={{ fontSize: "20px", cursor: "pointer" }}
            onClick={() => {
              setSelectedPatientDID(record.did);
              setShowAddMedicalRecordModal(true);
            }}
          />
        </Space>
      ),
    },
  ];

  const handleAddNewPatient = (values: { did: string }) => {
    console.log(values);
    const { did } = values;

    const userDid = session.data?.user?.did;
    if (!userDid) {
      message.error("User DID is not available.");
      return;
    }
    if (patients.some((patient) => patient.did === did)) {
      message.error("User already in the list");
      return;
    }
    const updatedPatientsList = addPatient(did, userDid);
    setPatients(updatedPatientsList.map((did, idx) => ({ id: idx + 1, did })));

    message.success("Access added successfully.");
    setIsModalVisible(false);
    form.resetFields();
  };

  useEffect(() => {
    const patients = getAllRegisteredPatients(session.data?.user.did!);
    setPatients(patients.map((did, idx) => ({ id: idx + 1, did })));
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <Button
        type="primary"
        size="middle"
        style={{ marginBottom: "10px", width: "150px" }}
        onClick={() => setIsModalVisible(true)}
      >
        Add New Patient
      </Button>
      <Card
        style={{
          width: "100%",
          maxWidth: "85vw",
          maxHeight: "72vh",
          borderRadius: "8px",
          overflow: "hidden",
        }}
      >
        <Typography.Title level={4}>Patients</Typography.Title>
        <Divider style={{ background: "#004494", marginTop: "10px" }} />

        <Table
          dataSource={patients}
          pagination={{ pageSize: 5 }}
          scroll={{ y: 480 }}
          columns={columns}
          rowKey="id"
          bordered
          style={{ padding: "0 16px" }}
        />
      </Card>

      <MedicalRecordsModal
        showModal={showMedicalRecords}
        handleModalClose={handleModalClose}
        medicalRecords={medicalRecords}
        selectedMedicalRecord={selectedMedicalRecord}
        setSelectedMedicalRecord={setSelectedMedicalRecord}
      />
      <Modal
        open={showAddMedicalRecordModal}
        onCancel={() => setShowAddMedicalRecordModal(false)}
        footer={null}
        centered
        width={1200}
      >
        <CreateMedicalRecord patientDID={selectedPatientDID} />
      </Modal>
      <Modal
        title="Add New Access"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={() => form.submit()}
        okText="Add"
      >
        <Form form={form} layout="vertical" onFinish={handleAddNewPatient}>
          <Form.Item
            name="did"
            label="Patient's DID"
            rules={[{ required: true, message: "Please enter patient's DID." }]}
          >
            <Input type="text" placeholder="Enter DID" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default PatientsList;
