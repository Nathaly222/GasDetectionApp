import React, { useState } from "react";
import { View, StyleSheet, TextInput } from "react-native";
import { Button, Text, Modal, Card } from "@ui-kitten/components";
import { updateUser } from "../service/api";

interface UpdateEmailModalProps {
  visible: boolean;
  onClose: () => void;
}

const UpdateEmailModal: React.FC<UpdateEmailModalProps> = ({ visible, onClose }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    setLoading(true);
    await updateUser({ email });
    setLoading(false);
    onClose();
  };

  return (
    <Modal visible={visible} backdropStyle={styles.backdrop} onBackdropPress={onClose}>
      <Card disabled={true} style={styles.card}>
        <Text category="h5" style={styles.title}>
          Actualizar Correo
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Nuevo correo electrónico"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <Button style={styles.saveButton} onPress={handleUpdate} disabled={loading}>
          {loading ? "Actualizando..." : "Guardar"}
        </Button>
        <Button style={styles.cancelButton} appearance="outline" onPress={onClose}>
          Cancelar
        </Button>
      </Card>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: { backgroundColor: "rgba(0, 0, 0, 0.5)" },
  card: {
    padding: 20,
    width: 320,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5, 
  },
  title: {
    marginBottom: 15,
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 18,
    color: "#D79B3C",
  },
  input: {
    borderWidth: 1,
    borderColor: "#D79B3C",
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: "#D79B3C",
    borderColor: "#D79B3C",
    borderRadius: 8,
  },
  cancelButton: {
    marginTop: 10,
    borderColor: "#BA2121",
    borderRadius: 8,
  },
});

export default UpdateEmailModal;
