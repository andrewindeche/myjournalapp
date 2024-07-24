import React from "react";
import { View, Text, Pressable, StyleSheet, Modal } from "react-native";

interface LogoutConfirmationModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const LogoutConfirmationModal: React.FC<LogoutConfirmationModalProps> = ({
  visible,
  onClose,
  onConfirm,
}) => {
  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalText}>
            Are you sure you want to log out?
          </Text>
          <View style={styles.modalButtonsContainer}>
            <Pressable style={styles.modalButton} onPress={onConfirm}>
              <Text style={styles.buttonText}>Yes</Text>
            </Pressable>
            <Pressable style={styles.modalButton} onPress={onClose}>
              <Text style={styles.buttonText}>No</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  modalText: {
    marginBottom: 20,
    fontSize: 18,
    textAlign: "center",
  },
  modalButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  modalButton: {
    padding: 20,
    backgroundColor: "#020035",
    borderRadius: 5,
    marginHorizontal: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default LogoutConfirmationModal;
