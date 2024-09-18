import React, { useState, useEffect } from "react";
import { StatusBar, StyleSheet, View, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Onboarding from "./Onboarding/Onboarding";
import DefaultHome from "./Screen/DefaultHome";
import OnboardingContext from "./Onboarding/OnboardingContext";


const Stack = createStackNavigator();

const Loading = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" />
  </View>
);

const OnboardingStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Onboarding" component={Onboarding} />
  </Stack.Navigator>
);

const MainStack = () => (

  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Default Home" component={DefaultHome} />
  </Stack.Navigator>
);

export default function App() {
  const [loading, setLoading] = useState(true);
  const [viewedOnboarding, setViewedOnboarding] = useState(false);

  const checkOnboarding = async () => {
    try {
      const value = await AsyncStorage.getItem("@viewedOnboarding");
      if (value !== null) {
        setViewedOnboarding(true);
      }
    } catch (err) {
      console.log("Error @checkOnboarding:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkOnboarding();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <OnboardingContext.Provider value={{ viewedOnboarding, setViewedOnboarding }}>
      <StatusBar style="auto" />
      <NavigationContainer>
        {!viewedOnboarding ? <OnboardingStack /> : <MainStack />}
      </NavigationContainer>
    </OnboardingContext.Provider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
