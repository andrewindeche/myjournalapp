import React from "react";
import { Text, View, StyleSheet, Pressable, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Colors } from "../colors";
import { StackNavigationProp } from "@react-navigation/stack";

type RootStackParamList = {
  Login: undefined;
  Register: undefined;
};

type NavigationProps = StackNavigationProp<RootStackParamList>;

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProps>();

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
          <Text style={styles.title}>Every Day has a Story!</Text>
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
    backgroundColor: Colors.loginBackgroundColor,
    flex: 1,
    justifyContent: "center",
  },
  footer: {
    backgroundColor: Colors.loginBackgroundColor,
    flexDirection: "column",
    gap: 20,
    height: "100%",
    padding: 20,
    width: "100%",
  },
  header: {
    alignItems: "center",
    color: Colors.white,
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
    backgroundColor: Colors.loginBackgroundColor,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    flex: 1,
    height: "100%",
    justifyContent: "flex-start",
    width: "100%",
  },
  outerContainer: {
    alignItems: "center",
    backgroundColor: Colors.white,
    borderBottomLeftRadius: 50,
    flex: 1,
    justifyContent: "flex-end",
    width: "100%",
  },
  pressable: {
    alignItems: "center",
    backgroundColor: Colors.white,
    borderRadius: 8,
    fontSize: 10,
    fontWeight: "bold",
    justifyContent: "center",
    padding: 10,
    width: "95%",
  },
  register: {
    backgroundColor: Colors.loginBackgroundColor,
    borderColor: Colors.white,
    borderWidth: 2,
    justifyContent: "space-around",
  },
  registerText: {
    color: Colors.white,
  },
  subtitle: {
    color: Colors.white,
    fontSize: 12,
  },
  text: {
    color: Colors.black,
    fontSize: 14,
  },
  title: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default HomeScreen;
