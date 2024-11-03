import React, { useState } from "react";
import { Upload, UploadProps, UploadFile, Button, Flex, Card } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { pinata } from "@/utils/config";
import Image from "next/image";
import { FileObject, UploadResponse } from "pinata";

const { Dragger } = Upload;

const UploadFileComponent = ({
  onUploadFinish,
}: {
  onUploadFinish: (uploadRes: UploadResponse) => void;
}) => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [url, setUrl] = useState("");
  const props: UploadProps = {
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    onChange: ({ fileList }) => {
      setFileList(fileList);
    },
    fileList,
  };

  const handleUpload = async () => {
    setUploading(true);
    fileList.forEach(async (file) => {
      if (!file || !file.originFileObj) {
        console.log("File obj is undefined");
        setUploading(false);
        return;
      }
      const keyRequest = await fetch("/api/key");
      const keyData = await keyRequest.json();
      const fileObjPinata = file.originFileObj as FileObject;
      const uploadRes = await pinata.upload
        .file(fileObjPinata)
        .key(keyData.JWT);
      onUploadFinish(uploadRes);
      setUploading(false);
    });
  };

  return (
    <Card
      style={{
        zIndex: "1",
        width: "100%",
      }}
    >
      <Button
        type="primary"
        onClick={handleUpload}
        disabled={fileList.length === 0}
        loading={uploading}
        style={{ marginTop: 16, marginBottom: 16 }}
      >
        {uploading ? "Uploading" : "Start Upload"}
      </Button>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "white",
        }}
      >
        <Dragger {...props} style={{ width: "100%", padding: "100px" }}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined style={{ fontSize: "64px", color: "#1890ff" }} />
          </p>
          <p className="ant-upload-text">
            Drag and drop files here, or click to upload
          </p>
        </Dragger>
      </div>
    </Card>
  );
};

export default UploadFileComponent;
