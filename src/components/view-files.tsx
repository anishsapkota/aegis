import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  Divider,
  List,
  Modal,
  QRCode,
  Row,
  Space,
  Table,
  Typography,
} from "antd";
import type { TableColumnsType } from "antd";
import { EyeOutlined, FilePdfOutlined } from "@ant-design/icons";
import { getFileByCID, getFilesList } from "@/data/pinata-data-api";
import { FileListItem } from "pinata";
import { FaLock } from "react-icons/fa";
import { useSession } from "next-auth/react";
import {
  MedicalRecord,
  getMedicalRecordFromCID,
  getMedicalRecordMetaData,
} from "@/data/medical-data-demo";
import Title from "antd/es/typography/Title";
import MedicalRecordsModal from "./medical-record-modal";
import axios from "axios";

const FilesList = ({ files }: { files: FileListItem[] }) => {
  const [showRecordModal, setShowRecordModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord>();
  //const [files, setFiles] = useState<FileListItem[]>([]);

  const handleModalClose = () => {
    setShowRecordModal(false);
  };

  const columns: TableColumnsType<FileListItem> = [
    {
      title: "S.N",
      key: "idx",
      render: (_text, _record, index) => index + 1,
      width: 50,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: 300,
    },
    {
      title: "CID",
      dataIndex: "cid",
      key: "cid",
      width: 450,
    },
    {
      title: "Group Id",
      dataIndex: "group_id",
      key: "group_id",
    },
    {
      title: "Created on",
      dataIndex: "created_at",
      key: "created_at",
      width: 120,
      render: (text: string) => {
        const date = new Date(text);
        const formattedDate = `${date.getFullYear()}/${String(
          date.getMonth() + 1,
        ).padStart(2, "0")}/${String(date.getDate()).padStart(2, "0")}`;
        return formattedDate;
      },
    },
    {
      title: "Actions",
      key: "actions",
      width: 100,
      render: (_text, record) => (
        <Space size="large" align="center">
          <EyeOutlined
            style={{ color: "#1890ff", fontSize: "24px", cursor: "pointer" }}
            onClick={async () => {
              // const res = await axios.get(url);
              const res = await getFileByCID(record.cid);
              console.log(res);
              //const mRecords = getMedicalRecordFromCID(record.cid);
              if (res.data) {
                setSelectedRecord(res.data as unknown as MedicalRecord);
                setShowRecordModal(true);
              }
            }}
          />
        </Space>
      ),
    },
  ];

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <Card
        style={{
          width: "100%",
          maxWidth: "85vw",
          borderRadius: "8px",
          overflow: "hidden",
        }}
      >
        <Typography.Title
          level={3}
          style={{ color: "#004494", marginLeft: "15px" }}
        >
          My Health Records
        </Typography.Title>
        <Divider style={{ background: "#004494", marginTop: "10px" }} />

        <Table
          dataSource={files}
          pagination={{ pageSize: 8 }}
          scroll={{ y: 500 }}
          columns={columns}
          rowKey="id"
          bordered
          style={{ padding: "0 16px" }}
          rowClassName="custom-table-row"
        />
      </Card>
      {selectedRecord ? (
        <MedicalRecordsModal
          showModal={showRecordModal}
          handleModalClose={handleModalClose}
          medicalRecords={[selectedRecord!]}
          selectedMedicalRecord={selectedRecord!}
          setSelectedMedicalRecord={setSelectedRecord}
        />
      ) : null}
    </div>
  );
};

export default FilesList;
