import { useEffect, useState } from "react";
import { View, Text, ScrollView, ActivityIndicator, StyleSheet } from "react-native";
import { Card } from "@ui-kitten/components";
import axios from "axios";

interface Notification {
  message: string;
  timestamp: string;
  type: "danger" | "warning" | "info";
}

type GroupedNotifications = {
  [key: string]: Notification[];
};

const NotificationScreen: React.FC = () => {
  const [notifications, setNotifications] = useState<GroupedNotifications>({});
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get<Notification[]>("/events/notification-danger");
        setNotifications(groupByDate(response.data));
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const groupByDate = (notifications: Notification[]): GroupedNotifications => {
    return notifications.reduce((acc: GroupedNotifications, notification) => {
      const date = new Date(notification.timestamp).toLocaleDateString();
      if (!acc[date]) acc[date] = [];
      acc[date].push(notification);
      return acc;
    }, {});
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#6200ea" style={styles.loader} />;
  }

  const todayDate = new Date().toLocaleDateString();

  if (Object.entries(notifications).length === 0) {
    return (
      <View style={styles.noNotificationsContainer}>
        <Text style={styles.noNotificationsTitle}>Alertas</Text>
        <Text style={styles.noNotificationsMessage}>No hay notificaciones disponibles hoy.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Alertas</Text>
      {Object.entries(notifications).map(([date, alerts], index) => (
        <View key={index} style={styles.section}>
          <Text style={styles.dateHeader}>{date === todayDate ? "Hoy" : date}</Text>
          {alerts.map((notification, subIndex) => (
            <Card
              key={subIndex}
              style={[styles.card, notification.type === "danger" ? styles.danger : styles.warning]}
            >
              <Text style={styles.message}>{notification.message}</Text>
              <Text style={styles.timestamp}>{new Date(notification.timestamp).toLocaleTimeString()}</Text>
            </Card>
          ))}
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
    textAlign: "center",
  },
  section: {
    marginBottom: 16,
  },
  dateHeader: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#555",
    marginBottom: 8,
    textAlign: "left",
  },
  card: {
    marginBottom: 10,
    padding: 16,
    borderRadius: 10,
  },
  danger: {
    backgroundColor: "#f8d7da",
  },
  warning: {
    backgroundColor: "#fff3cd",
  },
  message: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  timestamp: {
    fontSize: 12,
    color: "#777",
    marginTop: 4,
    textAlign: "right",
  },
  noNotificationsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  noNotificationsTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#D79B3C",
    marginBottom: 10,
  },
  noNotificationsMessage: {
    fontSize: 16,
    color: "#777",
    textAlign: "center",
  },
});

export default NotificationScreen;
