"use client";
import { useSearchParams } from "next/navigation";
import {
  Form,
  Input,
  Button,
  Card,
  Divider,
  Flex,
  Layout as AntLayout,
  Alert,
  Space,
  Modal,
  QRCode,
  Radio,
  RadioChangeEvent,
  Typography,
} from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { SignInOptions, signIn } from "next-auth/react";
import useWebSocket from "@/lib/useWebsocket";
import { v4 } from "uuid";

const loginPDoptions: Record<string, any> = {
  pid: {
    id: `${v4()}`,
    name: "PersonalIdentityCardProof",
    format: {
      jwt_vc: {
        alg: ["ES256"],
      },
    },
    input_descriptors: [
      {
        id: `${v4()}`,
        format: {
          jwt_vc: {
            alg: ["ES256"],
          },
        },
        constraints: {
          fields: [
            {
              path: [
                "$.credentialSubject.given_name",
                "$.vc.credentialSubject.given_name",
              ],
            },
            {
              path: [
                "$.credentialSubject.family_name",
                "$.vc.credentialSubject.family_name",
              ],
            },
            {
              path: [
                "$.credentialSubject.birth_date",
                "$.vc.credentialSubject.birth_date",
              ],
            },
            {
              path: [
                "$.credentialSubject.age_over_18",
                "$.vc.credentialSubject.age_over_18",
              ],
            },
            {
              path: [
                "$.credentialSubject.issuance_date",
                "$.vc.credentialSubject.issuance_date",
              ],
            },
            {
              path: [
                "$.credentialSubject.expiry_date",
                "$.vc.credentialSubject.expiry_date",
              ],
            },
            {
              path: [
                "$.credentialSubject.issuing_authority",
                "$.vc.credentialSubject.issuing_authority",
              ],
            },
            {
              path: [
                "$.credentialSubject.issuing_country",
                "$.vc.credentialSubject.issuing_country",
              ],
            },
          ],
        },
        limit_disclosure: "required",
      },
    ],
  },
  dl: {},
  hi: {},
  mid: {
    id: `${v4()}`,
    name: "MedicalLicense",
    format: {
      jwt_vc: {
        alg: ["ES256"],
      },
    },
    input_descriptors: [
      {
        id: `${v4()}`,
        format: {
          jwt_vc: {
            alg: ["ES256"],
          },
        },
        constraints: {
          fields: [
            {
              path: [
                "$.credentialSubject.license_id",
                "$.vc.credentialSubject.license_id",
              ],
            },
            {
              path: [
                "$.credentialSubject.given_name",
                "$.vc.credentialSubject.given_name",
              ],
            },
            {
              path: [
                "$.credentialSubject.family_name",
                "$.vc.credentialSubject.family_name",
              ],
            },
            {
              path: [
                "$.credentialSubject.birth_date",
                "$.vc.credentialSubject.birth_date",
              ],
            },
            {
              path: [
                "$.credentialSubject.issuance_date",
                "$.vc.credentialSubject.issuance_date",
              ],
            },
            {
              path: [
                "$.credentialSubject.expiry_date",
                "$.vc.credentialSubject.expiry_date",
              ],
            },
            {
              path: [
                "$.credentialSubject.issuing_authority",
                "$.vc.credentialSubject.issuing_authority",
              ],
            },
            {
              path: [
                "$.credentialSubject.issuing_country",
                "$.vc.credentialSubject.issuing_country",
              ],
            },
          ],
        },
        limit_disclosure: "required",
      },
    ],
  },
};

const SignIn = () => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/";
  const authError = searchParams.get("error");

  const [presentationDefKey, setSelectedPresentationDefKey] = useState("pid");
  const [role, setRole] = useState("patient");

  const onChange = (e: RadioChangeEvent) => {
    setSelectedPresentationDefKey(e.target.value);
  };

  const {
    socket,
    wsClientId,
    setWsClientId,
    showQR,
    setShowQR,
    verifiablePresentationRequestUrl,
    setVerifiablePresentationRequestUrl,
  } = useWebSocket(process.env.NEXT_PUBLIC_WS_URL!);

  const handleSignInWithVP = async () => {
    const res = await fetch(
      `${
        window.location.origin
      }/api/verifier/generate-vp-request?state=${wsClientId}&pd=${JSON.stringify(
        loginPDoptions[presentationDefKey],
      )}`,
    );
    const link = await res.json();
    setVerifiablePresentationRequestUrl(link.vpRequest);
    setShowQR(true);
  };
  const handleModalClose = () => {
    setShowQR(false);
  };

  useEffect(() => {
    if (socket) {
      socket.onmessage = async (message) => {
        const data = JSON.parse(message.data);
        if (!message.data.toString().includes("Hello")) {
          setShowQR(false);
          await signIn("credentials-login", {
            verifiable_presentation_data: JSON.stringify({
              vp: data.vpToken,
              role,
            }),
            callbackUrl,
          });
        } else {
          setWsClientId(data.clientId);
        }
      };
    }
  }, [socket, callbackUrl, setShowQR, setWsClientId]);

  return (
    <AntLayout>
      <div style={{ top: "20%", position: "absolute" }}>
        <Flex justify="center" style={{ width: "100vw" }}>
          <Card
            style={{
              boxShadow:
                "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
              minHeight: "500px",
              minWidth: "400px",
              display: "flex",
              justifyContent: "space-around",
              flexDirection: "column",
            }}
          >
            <Flex align="center" vertical>
              <Image src={"/aegis.png"} width={150} height={80} alt="logo" />
              <Divider></Divider>
              <Radio.Group
                value={role}
                onChange={(e) => setRole(e.target.value)}
                buttonStyle="solid"
                style={{ marginBottom: "10px" }}
              >
                <Radio.Button value="patient">Patient</Radio.Button>
                <Radio.Button value="practitioner">
                  Medical Practitioner
                </Radio.Button>
              </Radio.Group>
            </Flex>
            <Typography.Title style={{ fontSize: "24px" }}>
              Login with
            </Typography.Title>
            {authError && (
              <Alert
                description={"Invalid email or password"}
                type="error"
                style={{ marginBottom: "2rem" }}
              />
            )}
            <Divider></Divider>
            <Radio.Group
              onChange={onChange}
              value={presentationDefKey}
              size="large"
              style={{ width: "100%", minHeight: "150px" }}
            >
              {role === "patient" ? (
                <Space direction="vertical" style={{ width: "100%" }}>
                  <Radio.Button
                    value="pid"
                    style={{
                      width: "100%",
                      textAlign: "center",
                      //  fontWeight: "500",
                    }}
                  >
                    Personal Identity Card
                  </Radio.Button>
                  <Radio.Button
                    value="dl"
                    style={{
                      width: "100%",
                      textAlign: "center",
                      //  fontWeight: "500",
                    }}
                  >
                    Driving License
                  </Radio.Button>
                  <Radio.Button
                    value="hi"
                    style={{
                      width: "100%",
                      textAlign: "center",
                      // fontWeight: "500",
                    }}
                  >
                    Health Insurance Card
                  </Radio.Button>
                </Space>
              ) : (
                <Space direction="vertical" style={{ width: "100%" }}>
                  <Radio.Button
                    value="mid"
                    style={{
                      width: "100%",
                      textAlign: "center",
                      //  fontWeight: "500",
                    }}
                  >
                    Medical License VC
                  </Radio.Button>
                </Space>
              )}
            </Radio.Group>

            <Divider></Divider>
            <Flex justify="center">
              <Button size="large" type="primary" onClick={handleSignInWithVP}>
                Login
              </Button>
            </Flex>
          </Card>
        </Flex>
      </div>
      <Modal
        open={showQR}
        onCancel={handleModalClose}
        footer={<></>}
        width={400}
      >
        <Space>{role}</Space>
        <Divider>QRCode Authentication</Divider>
        <Flex justify="center">
          <QRCode size={320} value={verifiablePresentationRequestUrl} />
        </Flex>
      </Modal>
    </AntLayout>
  );
};

export default SignIn;
