import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Colors } from "../colors";

const ConfirmDeleteModal = ({ isOpen, onConfirm, onCancel }) =>
  isOpen ? (
    <View style={styles.overlay}>
      <View style={styles.modal}>
        <Text style={styles.title}>Are you sure you want to delete entry?</Text>
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
  button: {
    alignItems: "center",
    backgroundColor: Colors.loginBackgroundColor,
    borderRadius: 5,
    marginVertical: 5,
    padding: 10,
    width: "100%",
  },
  buttonText: {
    color: Colors.white,
  },
  modal: {
    alignItems: "center",
    backgroundColor: Colors.white,
    borderRadius: 10,
    padding: 20,
    width: "80%",
  },
  overlay: {
    alignItems: "center",
    backgroundColor: Colors.modalBackdroundColor,
    bottom: 0,
    justifyContent: "center",
    left: 0,
    position: "absolute",
    right: 0,
    top: 0,
    zIndex: 1000,
  },
  title: {
    fontSize: 18,
    marginBottom: 15,
  },
});

export default ConfirmDeleteModal;
