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
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleUpdate = async () => {
    try {
      setError("");
      setSuccessMessage(""); // Limpiar mensaje anterior de éxito

      if (!email) {
        setError("El correo electrónico es requerido");
        return;
      }

      setLoading(true);
      await updateUser({ email });
      setSuccessMessage("Correo actualizado exitosamente");
      setEmail(""); // Limpiar campo de correo
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} backdropStyle={styles.backdrop} onBackdropPress={onClose}>
      <Card disabled={true} style={styles.card}>
        <Text category="h5" style={styles.title}>
          Actualizar Correo
        </Text>

        {error && (
          <Text style={[styles.errorText, { color: '#BA2121' }]}>
            {error}
          </Text>
        )}

        {successMessage && (
          <Text style={[styles.successText]}>
            {successMessage}
          </Text>
        )}

        <TextInput
          style={styles.input}
          placeholder="Nuevo correo electrónico"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <Button style={styles.saveButton} onPress={handleUpdate} disabled={loading || !email}>
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
  backdrop: { 
    backgroundColor: "rgba(0, 0, 0, 0.5)" 
  },
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
  errorText: {
    marginBottom: 10,
    textAlign: 'center',
    fontSize: 14,
  },
  successText: {
    marginBottom: 10,
    textAlign: 'center',
    fontSize: 14,
    color: "#28a745",
  }
});

export default UpdateEmailModal;
