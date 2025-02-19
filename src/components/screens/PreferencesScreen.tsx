import React, { useEffect, useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { Avatar, Text, List, ListItem, Layout, Divider, Button } from "@ui-kitten/components";
import { useNavigation } from "@react-navigation/native";
import { getUserData } from "../service/api";
import ContactModal from "./ContactModal";
import UpdateEmailModal from "./UpdateEmailModal";
import UpdatePasswordModal from "./UpdatePasswordModal";

const ProfileScreen = () => {
  const [user, setUser] = useState<{ username: string; avatar: string } | null>(null);
  const [showContactModal, setShowContactModal] = useState(false);
  const [emailModalVisible, setEmailModalVisible] = useState(false);
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);

  // Actualiza el tipo de navigation si es necesario
  const navigation = useNavigation<any>(); // Aquí podemos usar 'any' o un tipo más específico como 'RootStackParamList'

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getUserData();
        setUser(data);
      } catch (error) {
        Alert.alert("Error", "No se pudo cargar la información del usuario.");
        console.error("Error obteniendo datos del usuario:", error);
      }
    };

    fetchUser();
  }, []);

  const menuOptions: { title: string; action?: () => void; screen?: string }[] = [
    { title: "Gestión de Contactos", action: () => setShowContactModal(true) },
    { title: "Actualizar correo", action: () => setEmailModalVisible(true) },
    { title: "Actualizar contraseña", action: () => setPasswordModalVisible(true) },
    { title: "Ayuda y soporte", screen: "Help" },
  ];

  return (
    <Layout style={styles.container}>
      <View style={styles.header}>
        <Avatar
          source={{
            uri: user?.avatar || "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y",
          }}
          style={styles.avatar}
        />
        <Text category="h5" style={styles.name}>
          {user?.username || "Cargando..."}
        </Text>
      </View>

      <Divider />

      <List
        data={menuOptions}
        renderItem={({ item }) => (
          <ListItem
            title={item.title}
            style={styles.listItem}
            onPress={() => {
              if (item.action) {
                item.action(); // Ejecuta la acción si existe
              } else if (item.screen) {
                navigation.navigate(item.screen); // Navega a la pantalla si existe
              }
            }}
          />
        )}
      />

      <Button style={styles.logoutButton} status="danger">
        Cerrar Sesión
      </Button>

      <ContactModal visible={showContactModal} onClose={() => setShowContactModal(false)} />
      <UpdateEmailModal visible={emailModalVisible} onClose={() => setEmailModalVisible(false)} />
      <UpdatePasswordModal visible={passwordModalVisible} onClose={() => setPasswordModalVisible(false)} />
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#F7F9FC" },
  header: { alignItems: "center", marginBottom: 20 },
  avatar: { width: 120, height: 120, borderRadius: 60, marginBottom: 10 },
  name: { fontWeight: "bold", fontSize: 20, marginTop: 5 },
  listItem: {
    marginVertical: 5,
    borderRadius: 10,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, 
  },
  logoutButton: {
    marginTop: 20,
    borderRadius: 10,
  },
});

export default ProfileScreen;
