import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "../app/src/screens/HomeScreen";

// Mock Navigation
const Stack = createStackNavigator();
const mockNavigate = jest.fn();

const MockNavigator = () => (
  <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Login" component={() => <></>} />
      <Stack.Screen name="Register" component={() => <></>} />
    </Stack.Navigator>
  </NavigationContainer>
);

jest.mock("@react-navigation/native", () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
  }),
}));

describe("HomeScreen", () => {
  it("renders correctly", () => {
    const { getByText } = render(<MockNavigator />);
    expect(getByText("Everyday has a Story!")).toBeTruthy();
    expect(getByText("Write Yours")).toBeTruthy();
    expect(getByText("Dive into Creativity")).toBeTruthy();
    expect(getByText("Document Your Imagination")).toBeTruthy();
  });

  it("navigates to Sign In screen on press", () => {
    const { getByText } = render(<MockNavigator />);
    fireEvent.press(getByText("Sign In"));
    expect(mockNavigate).toHaveBeenCalledWith("Login");
  });

  it("navigates to Register screen on press", () => {
    const { getByText } = render(<MockNavigator />);
    fireEvent.press(getByText("Register"));
    expect(mockNavigate).toHaveBeenCalledWith("Register");
  });
});
