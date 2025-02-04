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
  const navigation = useNavigation();

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

  const menuOptions = [
    { title: "Gestión de Contactos", action: () => setShowContactModal(true) },
    { title: "Actualizar correo", action: () => setEmailModalVisible(true) },
    { title: "Actualizar contraseña", action: () => setPasswordModalVisible(true) },
    { title: "Ayuda y soporte", screen: "Help" },
  ];

  return (
    <Layout style={styles.container}>
      {/* Encabezado */}
      <View style={styles.header}>
        <Avatar source={{ uri: user?.avatar || "https://via.placeholder.com/100" }} style={styles.avatar} />
        <Text category="h5" style={styles.name}>
          {user?.username || "Cargando..."}
        </Text>
      </View>

      <Divider />

      {/* Lista de opciones */}
      <List
        data={menuOptions}
        renderItem={({ item }) => (
          <ListItem
            title={item.title}
            style={styles.listItem}
            onPress={item.action ? item.action : () => navigation.navigate(item.screen as never)}
          />
        )}
      />

      <Button style={styles.logoutButton} status="danger">
        Cerrar Sesión
      </Button>

      {/* Modales */}
      <ContactModal visible={showContactModal} onClose={() => setShowContactModal(false)} />
      <UpdateEmailModal visible={emailModalVisible} onClose={() => setEmailModalVisible(false)} />
      <UpdatePasswordModal visible={passwordModalVisible} onClose={() => setPasswordModalVisible(false)} />
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#F7F9FC" },
  header: { alignItems: "center", marginBottom: 20 },
  avatar: { width: 100, height: 100, borderRadius: 50, marginBottom: 10 },
  name: { fontWeight: "bold", fontSize: 20, marginTop: 5 },
  listItem: {
    marginVertical: 5,
    borderRadius: 10,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // Para Android
  },
  logoutButton: {
    marginTop: 20,
    borderRadius: 10,
  },
});

export default ProfileScreen;
