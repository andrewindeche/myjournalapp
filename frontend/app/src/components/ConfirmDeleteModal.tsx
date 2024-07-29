import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";

const ConfirmDeleteModal = ({ isOpen, onConfirm, onCancel }) =>
  isOpen ? (
    <View style={styles.overlay}>
      <View style={styles.modal}>
        <Text style={styles.title}>
          Are you sure you want to delete all entries?
        </Text>
        <Pressable style={styles.button} onPress={onConfirm}>
          <Text style={styles.buttonText}>Yes</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={onCancel}>
          <Text style={styles.buttonText}>No</Text>
        </Pressable>
      </View>
    </View>
  ) : null;

const styles = StyleSheet.create({
  overlay: {
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    bottom: 0,
    justifyContent: "center",
    left: 0,
    position: "absolute",
    right: 0,
    top: 0,
    zIndex: 1000,
  },
  modal: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    width: "80%",
  },
  title: {
    fontSize: 18,
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#020035",
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
  },
});

export default ConfirmDeleteModal;
