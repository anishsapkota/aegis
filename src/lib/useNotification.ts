import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { createPubSubTopicAndSubscribe } from "./server-actions";

export type NotificationType =
  | "accessRequest"
  | "accessGranted"
  | "accessDenied";

export interface INotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  read?: boolean;
  senderDID: string;
  presignedUrl?: string;
}

export const useNotifications = (senderDID: string | undefined) => {
  const session = useSession();

  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [notificationCounter, setNotificationCounter] = useState(0);
  const [latestNotification, setLatestNotification] = useState<INotification>();

  useEffect(() => {
    if (senderDID) {
      const setupSSE = async () => {
        await createPubSubTopicAndSubscribe(senderDID);

        const eventSource = new EventSource(
          `${process.env.NEXT_PUBLIC_REDIS_URL}/sse?userId=${senderDID}`,
        );

        eventSource.onopen = () => {
          console.log("Connection to SSE established");
        };

        eventSource.onerror = (error) => {
          console.error("SSE error:", error);
        };

        eventSource.onmessage = async (event) => {
          const newMessage: INotification = JSON.parse(event.data);

          setNotifications((prevNotifications) => [
            newMessage,
            ...prevNotifications,
          ]);
          setLatestNotification(newMessage);
          setNotificationCounter((prevCounter) => prevCounter + 1);
        };

        return () => {
          eventSource.close();
        };
      };
      setupSSE();
    }
  }, [session.data?.user.did, senderDID]);

  return {
    notifications,
    latestNotification,
    notificationCounter,
    setNotifications,
    setNotificationCounter,
  };
};
