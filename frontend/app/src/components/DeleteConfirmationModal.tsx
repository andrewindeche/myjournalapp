import React from "react";
import { View, Text, Modal, Pressable, StyleSheet } from "react-native";
import { Colors } from "../colors";

interface DeleteConfirmationModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
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
            Are you sure you want to delete your account? This action cannot be
            undone.
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
  buttonText: {
    color: Colors.white,
    fontWeight: "bold",
  },
  modalBackground: {
    alignItems: "center",
    backgroundColor: Colors.modalBackdroundColor,
    flex: 1,
    justifyContent: "center",
  },
  modalButton: {
    alignItems: "center",
    backgroundColor: Colors.loginBackgroundColor,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 10,
    paddingVertical: 10,
  },
  modalButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  modalContainer: {
    alignItems: "center",
    backgroundColor: Colors.white,
    borderRadius: 10,
    padding: 20,
    width: "80%",
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
  },
});

export default DeleteConfirmationModal;
