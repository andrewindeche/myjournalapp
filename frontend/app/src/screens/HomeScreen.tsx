import React from "react";
import { Text, View, StyleSheet, Pressable, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
const HomeScreen: React.FC = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.outerContainer}>
        <Image
          style={styles.image}
          resizeMode="cover"
          source={require("@/assets/images/journaler.jpg")}
        />
      </View>
      <View style={styles.innerContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Everyday has a Story!</Text>
          <Text style={styles.title}>Write Yours</Text>
          <Text style={styles.subtitle}>Dive into Creativity</Text>
          <Text style={styles.subtitle}> Document Your Imagination</Text>
        </View>
        <View style={styles.footer}>
          <Pressable
            style={styles.pressable}
            onPress={() => navigation.navigate("Login")}
          >
            <Text style={styles.text}>Sign In</Text>
          </Pressable>
          <Pressable
            style={[styles.pressable, styles.register]}
            onPress={() => navigation.navigate("Register")}
          >
            <Text style={[styles.text, styles.registerText]}>Register</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: "#020035",
    flex: 1,
    justifyContent: "center",
  },
  footer: {
    backgroundColor: "#020035",
    flexDirection: "column",
    gap: 20,
    height: "100%",
    padding: 20,
    width: "100%",
  },
  header: {
    alignItems: "center",
    color: "white",
    display: "flex",
    gap: 10,
    justifyContent: "center",
    paddingHorizontal: 10,
    paddingVertical: 20,
  },
  image: {
    borderRadius: 100,
    height: 300,
    width: "90%",
  },
  innerContainer: {
    alignItems: "center",
    backgroundColor: "#020035",
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    flex: 1,
    height: "100%",
    justifyContent: "flex-start",
    width: "100%",
  },
  outerContainer: {
    alignItems: "center",
    backgroundColor: "white",
    borderBottomLeftRadius: 50,
    flex: 1,
    justifyContent: "flex-end",
    width: "100%",
  },
  pressable: {
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 8,
    fontSize: 8,
    fontWeight: "bold",
    justifyContent: "center",
    padding: 10,
    width: "95%",
  },
  register: {
    backgroundColor: "#020035",
    borderColor: "white",
    borderWidth: 2,
    justifyContent: "space-around",
  },
  registerText: {
    color: "white",
  },
  subtitle: {
    color: "white",
    fontSize: 10,
  },
  text: {
    color: "black",
    fontSize: 10,
  },
  title: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default HomeScreen;
