import { useEffect, useState } from "react";
import { View, Text, ScrollView, ActivityIndicator, StyleSheet, Dimensions } from "react-native";
import { getNotificationDanger } from "../service/api";

interface Notification {
  event_type: string;
  event_time: string;
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
        const response = await getNotificationDanger();
        if (response.status === "success") {
          setNotifications(groupByDate(response.data));
        }
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
      const date = new Date(notification.event_time).toLocaleDateString();
      if (!acc[date]) acc[date] = [];
      acc[date].push(notification);
      return acc;
    }, {});
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#6200ea" />
      </View>
    );
  }

  const todayDate = new Date().toLocaleDateString();

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Alertas</Text>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        {Object.entries(notifications)
          .sort(([dateA], [dateB]) => new Date(dateB).getTime() - new Date(dateA).getTime()) // Orden descendente
          .map(([date, alerts], index) => (
            <View key={index} style={styles.section}>
              <View style={styles.dateContainer}>
                <Text style={styles.dateHeader}>
                  {date === todayDate ? "Hoy" : date}
                </Text>
              </View>
              {alerts
                .sort((a, b) => new Date(b.event_time).getTime() - new Date(a.event_time).getTime()) // Orden descendente
                .map((notification, subIndex) => (
                  <View
                    key={subIndex}
                    style={[
                      styles.chatBubble,
                      notification.event_type === "danger" ? styles.danger : styles.warning
                    ]}
                  >
                    <Text style={styles.message}>
                      {notification.event_type.replace("_", " ")}
                    </Text>
                    <Text style={styles.timestamp}>
                      {new Date(notification.event_time).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </Text>
                  </View>
                ))}
            </View>
          ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  header: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#333",
    padding: 16,
    backgroundColor: "#fff",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  section: {
    marginTop: 16,
    alignItems: 'center', 
  },
  dateContainer: {
    alignItems: "center",
    marginBottom: 12,
    width: '100%',
  },
  dateHeader: {
    fontSize: 14,
    color: "#666",
    backgroundColor: "#e1e1e1",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    overflow: "hidden",
  },
  chatBubble: {
    marginVertical: 4,
    padding: 12,
    borderRadius: 16,
    width: '90%', 
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  danger: {
    backgroundColor: "#F8E0C1", 
    borderTopRightRadius: 4,
  },
  warning: {
    backgroundColor: "#FCE4B7", 
    borderTopLeftRadius: 4,
  },
  message: {
    fontSize: 16,
    color: "#333",
    marginBottom: 4,
  },
  timestamp: {
    fontSize: 12,
    color: "#666",
    alignSelf: "flex-end",
  },
});

export default NotificationScreen;
