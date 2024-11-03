import { MedicalRecord } from "@/data/medical-data-demo";
import { Button, Card, Divider, Flex, Typography, Modal, Row, Col } from "antd";
import { useSession } from "next-auth/react";
import { FilePdfOutlined } from "@ant-design/icons";
import React, { FC, useState } from "react";

const { Title, Text } = Typography;

type MedicalRecordPreviewProps = {
  selectedMedicalRecord: MedicalRecord;
};

const MedicalRecordPreview = ({
  selectedMedicalRecord,
}: MedicalRecordPreviewProps) => {
  const { data: session } = useSession();
  const role = session?.user.role;
  const [fileUrl, setFileUrl] = useState<string>();
  const handleFileClick = async (cid: string) => {
    const urlRequest = await fetch("/api/sign", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ cid: cid }),
    });
    const url = await urlRequest.json();
    setFileUrl(url);
  };
  return (
    <Card>
      <Card
        style={{
          height: role == "user" ? "55vh" : "60vh",
          overflowY: "scroll",
        }}
      >
        {selectedMedicalRecord.attachments &&
          selectedMedicalRecord.attachments.length > 0 && (
            <Button
              type="link"
              icon={<FilePdfOutlined />}
              href={fileUrl}
              onClick={() =>
                handleFileClick(selectedMedicalRecord.attachments![0].cid)
              }
              target="_blank"
            >
              {selectedMedicalRecord.attachments[0].fileName}
            </Button>
          )}
        <Flex justify="space-between">
          <Title level={2}>{selectedMedicalRecord.metadata.title}</Title>
        </Flex>

        <Divider />
        <div style={{ minHeight: "300px", overflowY: "scroll" }}>
          <Title level={4}>Specialty:</Title>
          <Text>
            {selectedMedicalRecord.metadata.specialtyType || "General"}
          </Text>

          <Title level={4}>Description:</Title>
          <Text>{selectedMedicalRecord.metadata.description}</Text>

          {selectedMedicalRecord.diagnosis && (
            <>
              <Title level={4}>Diagnosis:</Title>
              {selectedMedicalRecord.diagnosis.map((diag, idx) => (
                <Text key={idx}>
                  {" "}
                  - {diag.name} ({diag.code})
                </Text>
              ))}
            </>
          )}

          {selectedMedicalRecord.medications && (
            <>
              <Title level={4}>Medications:</Title>
              {selectedMedicalRecord.medications.map((med, idx) => (
                <Text key={idx}>
                  {" "}
                  - {med.name}, {med.dosage} ({med.frequency})
                </Text>
              ))}
            </>
          )}
        </div>
        <Text style={{ fontStyle: "italic" }}>
          {selectedMedicalRecord.provider
            ? (selectedMedicalRecord.provider as string)
            : null}
        </Text>
      </Card>
      {role === "user" && (
        <Flex justify="end" style={{ marginTop: 10 }}>
          <Button type="primary">Request Edit</Button>
        </Flex>
      )}
    </Card>
  );
};

type MedicalRecordsModalProps = {
  showModal: boolean;
  handleModalClose: () => void;
  medicalRecords: MedicalRecord[];
  selectedMedicalRecord: MedicalRecord | undefined;
  setSelectedMedicalRecord: (record: MedicalRecord) => void;
};

const MedicalRecordsModal: FC<MedicalRecordsModalProps> = ({
  showModal,
  handleModalClose,
  medicalRecords,
  selectedMedicalRecord,
  setSelectedMedicalRecord,
}) => (
  <Modal
    title={"Patient Medical Records"}
    open={showModal}
    onCancel={handleModalClose}
    footer={null}
    centered
    style={{ height: "90vh" }}
    width={1400}
  >
    {medicalRecords.length > 0 ? (
      <Row style={{ marginTop: 10 }}>
        <Col span={12}>
          <Flex justify="center" style={{ height: "65vh", marginTop: 5 }}>
            <Flex
              vertical
              gap={10}
              style={{ maxWidth: "90%", minWidth: "90%", overflowY: "scroll" }}
            >
              {medicalRecords.map((record) => (
                <Card
                  key={record.id}
                  hoverable
                  style={{
                    backgroundColor:
                      selectedMedicalRecord?.id === record.id
                        ? "#f0f8ff"
                        : "#fff",
                    border:
                      selectedMedicalRecord?.id === record.id
                        ? "2px solid lightblue"
                        : "#fff",
                    overflowY: "scroll",
                  }}
                  onClick={() => setSelectedMedicalRecord(record)}
                >
                  <Title level={3}>{record.metadata.title}</Title>
                  <Text>{record.metadata.description}</Text>
                </Card>
              ))}
            </Flex>
          </Flex>
        </Col>
        <Col span={12}>
          {selectedMedicalRecord && (
            <MedicalRecordPreview
              selectedMedicalRecord={selectedMedicalRecord}
            />
          )}
        </Col>
      </Row>
    ) : (
      <Typography.Text>
        No record available. Please request access for medical records
      </Typography.Text>
    )}
  </Modal>
);

export default MedicalRecordsModal;
