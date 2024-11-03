"use client";

import { FC, PropsWithChildren, useCallback, useEffect, useState } from "react";
import {
  Layout as AntLayout,
  Space,
  Badge,
  Drawer,
  Card,
  Divider,
  message,
  Menu,
  MenuProps,
  notification as antNotification,
} from "antd";
import Image from "next/image";
import { BellOutlined, UserOutlined } from "@ant-design/icons";
import HeaderActions from "./header-actions";
import Sider from "antd/es/layout/Sider";
import { FiUpload } from "react-icons/fi"; // for Document Upload
import { MdSecurity } from "react-icons/md"; // for Access Control
import { AiOutlineFile } from "react-icons/ai"; // for View Files
import React from "react";
import UploadFileComponent from "./upload-file";
import FilesList from "./view-files";
import { useSession } from "next-auth/react";
import { FaUpLong } from "react-icons/fa6";
import PatientsList from "./patients-list";
import { INotification, useNotifications } from "@/lib/useNotification";
import { formatDID } from "@/lib/jsHelper";
import AccessControl from "./access-control";
import AccessControlList from "./access-control";
import { IoCopyOutline } from "react-icons/io5";
import RequestAccessPage from "./request-access";
import AddAccessModal from "./add-access-modal";
import { getFilesList } from "@/data/pinata-data-api";
import { FileListItem } from "pinata";

const headerStyle: React.CSSProperties = {
  textAlign: "center",
  height: "10vh",
  paddingInline: 48,
  lineHeight: "64px",
  backgroundColor: "#fff",
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  borderBottom: "0.5px solid lightgrey",
};

const contentStyle: React.CSSProperties = {
  textAlign: "left",
  margin: "10px",
  height: "80vh",
  color: "#000",
  display: "flex",
  justifyContent: "center",
  flexDirection: "row",
  alignItems: "start",
  overflow: "scroll",
};

const footerStyle: React.CSSProperties = {
  borderTop: "0.5px solid lightgrey",
  textAlign: "center",
  color: "#000",
  height: "10vh",
  backgroundColor: "#F3F6FB",
};

const layoutStyle = {
  borderRadius: 8,
  overflow: "hidden",
  width: "calc(100% - 0px)",
  maxWidth: "calc(100% - 0px)",
};

const siderStyle = {
  borderRight: "0.5px solid lightgrey",
  height: "80vh",
};

type ContentProps = PropsWithChildren<{ title?: string }>;

const Content: FC<ContentProps> = ({ children, title }) => {
  const session = useSession();
  const loggedIn = session.status === "authenticated";
  const [selectedMenuKey, setSelectedMenuKey] = useState<string>("1"); // Default to first item
  const [open, setOpen] = useState(false);
  const [files, setFiles] = useState<FileListItem[]>();
  const [showAddAccessModal, setShowAddAccessModal] = useState(false);
  const [selectedNotif, setSelectedNotif] = useState<INotification | null>(
    null,
  );

  const patientMenuOptions = [
    {
      key: "1",
      icon: <AiOutlineFile />,
      title: "View Files",
      component: <FilesList files={files!} />,
    },
    {
      key: "2",
      icon: <MdSecurity />,
      title: "Access Control",
      component: (
        <div style={{ width: "90vw" }}>
          <AccessControlList />
        </div>
      ),
    },
  ];

  const practitonerMenuOptions = [
    {
      key: "1",
      icon: <UserOutlined />,
      title: "Patients",
      component: <PatientsList />,
    },
    {
      key: "2",
      icon: <MdSecurity />,
      title: "Request Access",
      component: (
        <div style={{ width: "90vw" }}>
          <RequestAccessPage />
        </div>
      ),
    },
  ];

  const role = session.data?.user.role;
  const menuOptions =
    role === "patient" ? patientMenuOptions : practitonerMenuOptions;

  const [api, contextHolder] = antNotification.useNotification();

  const menuItems: MenuProps["items"] = menuOptions.map((option) => ({
    key: option.key,
    icon: option.icon,
    label: option.title,
  }));

  const showDrawer = useCallback(() => {
    setOpen(true);
  }, []);

  const onClose = useCallback(() => {
    setOpen(false);
  }, []);

  const handleMenuClick: MenuProps["onClick"] = (e) => {
    setSelectedMenuKey(e.key);
    localStorage.setItem("selectedMenuKey", e.key);
  };

  const selectedComponent = menuOptions.find(
    (option) => option.key === selectedMenuKey,
  )?.component;

  useEffect(() => {
    const savedMenuKey = localStorage.getItem("selectedMenuKey");
    if (savedMenuKey) {
      setSelectedMenuKey(savedMenuKey);
    }
  }, []);

  const {
    notifications,
    latestNotification,
    notificationCounter,
    setNotifications,
    setNotificationCounter,
  } = useNotifications(session.data?.user?.did);

  const handleNotificationCardClick = async (notification: INotification) => {
    setNotificationCounter((currentCounter) =>
      currentCounter > 0 ? currentCounter - 1 : 0,
    );
    // Mark the notification as read
    setNotifications((prevNotifications) =>
      prevNotifications.map((notif) =>
        notif.id === notification.id ? { ...notif, read: true } : notif,
      ),
    );

    setSelectedNotif(notification);
    setShowAddAccessModal(true);
  };

  useEffect(() => {
    if (notificationCounter > 0) {
      api.open({
        message: latestNotification?.title,
        description: latestNotification?.message,
        //duration: 0,
        placement: "bottomRight",
        showProgress: true,
        pauseOnHover: true,
      });
    }
  }, [latestNotification]);

  useEffect(() => {
    if (!session.data?.user) return;
    (async () => {
      const files = await getFilesList(session.data?.user.did!);
      setFiles(files.files);
    })();
  }, [session]);

  return (
    <AntLayout style={layoutStyle}>
      {contextHolder}
      <AntLayout.Header style={headerStyle}>
        <Image src={"/aegis.png"} width={150} height={80} alt="logo" />
        <Space>
          {loggedIn ? (
            <>
              <Space style={{ marginRight: "10px" }}>
                <p>
                  Hello{" "}
                  <b
                    style={{ color: "#013581" }}
                    title={session.data.user!.did}
                  >
                    {formatDID(session.data.user!.did)}
                  </b>
                </p>
                <IoCopyOutline
                  onClick={() => {
                    navigator.clipboard.writeText(session.data.user!.did);
                    message.success("DID copied");
                  }}
                  style={{ cursor: "pointer" }}
                />
              </Space>

              <Badge count={notificationCounter}>
                <BellOutlined
                  style={{ fontSize: "24px" }}
                  onClick={showDrawer}
                />
              </Badge>
            </>
          ) : null}
          <HeaderActions />
        </Space>
      </AntLayout.Header>
      <AntLayout>
        {loggedIn ? (
          <>
            <Sider style={siderStyle}>
              <Menu
                mode="inline"
                selectedKeys={[selectedMenuKey]}
                style={{ height: "100%", borderRight: 0 }}
                items={menuItems}
                onClick={handleMenuClick}
              />
            </Sider>
            <AntLayout.Content style={contentStyle}>
              {selectedComponent || children} {/* Render selected component */}
              <Drawer
                onClose={onClose}
                open={open}
                closeIcon={false}
                style={{ backgroundColor: "rgba(255, 255, 255, 0.5)" }}
              >
                {" "}
                <div style={{ marginTop: "35%" }}>
                  {notifications.length > 0 ? (
                    notifications.map((notif) => (
                      <React.Fragment key={notif.id}>
                        <Card
                          style={{
                            backgroundColor: notif.read ? "#E1E2E4" : "#FFFFFF",
                          }}
                          hoverable
                          onClick={() => handleNotificationCardClick(notif)}
                        >
                          <p>
                            <b>{notif.title}</b>
                          </p>
                          <p>{notif.message}</p>
                          <p style={{ textAlign: "right" }}>
                            <small>{notif.timestamp}</small>
                          </p>
                        </Card>
                        <Divider />
                      </React.Fragment>
                    ))
                  ) : (
                    <p style={{ textAlign: "center", color: "grey" }}>
                      No notifications
                    </p>
                  )}
                </div>
                {selectedNotif ? (
                  <AddAccessModal
                    visible={showAddAccessModal}
                    practitionerDID={selectedNotif.senderDID}
                    onClose={() => setShowAddAccessModal(false)}
                    patientRecords={files}
                  />
                ) : null}
              </Drawer>
            </AntLayout.Content>
          </>
        ) : null}
      </AntLayout>
      <AntLayout.Footer style={footerStyle}>© 2024 Aegis</AntLayout.Footer>
    </AntLayout>
  );
};

export default Content;
function setFiles(files: import("pinata").FileListItem[]) {
  throw new Error("Function not implemented.");
}
