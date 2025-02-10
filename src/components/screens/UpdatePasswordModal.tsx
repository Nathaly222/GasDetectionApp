import React, { useState } from "react";
import { View, StyleSheet, TextInput } from "react-native";
import { Button, Text, Modal, Card } from "@ui-kitten/components";
import { updateUser } from "../service/api";

interface UpdatePasswordModalProps {
  visible: boolean;
  onClose: () => void;
}

const UpdatePasswordModal: React.FC<UpdatePasswordModalProps> = ({ visible, onClose }) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleUpdate = async () => {
    try {
      setError("");
      setSuccessMessage(""); // Clear previous success message

      if (!password || !confirmPassword) {
        setError("Todos los campos son requeridos");
        return;
      }

      if (password.length < 6) {
        setError("La contraseña debe tener al menos 6 caracteres");
        return;
      }

      if (password !== confirmPassword) {
        setError("Las contraseñas no coinciden");
        return;
      }

      setLoading(true);
      await updateUser({ password });
      setSuccessMessage("Contraseña actualizada exitosamente");
      setPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} backdropStyle={styles.backdrop} onBackdropPress={onClose}>
      <Card disabled={true} style={styles.card}>
        <Text category="h5" style={styles.title}>Actualizar Contraseña</Text>

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
          placeholder="Nueva contraseña"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <TextInput
          style={styles.input}
          placeholder="Confirmar nueva contraseña"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
        <Button 
          style={styles.saveButton} 
          onPress={handleUpdate} 
          disabled={loading || !password || !confirmPassword}
        >
          {loading ? "Actualizando..." : "Guardar"}
        </Button>
        <Button 
          style={styles.cancelButton} 
          appearance="outline" 
          onPress={onClose}
          disabled={loading}
        >
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

export default UpdatePasswordModal;
