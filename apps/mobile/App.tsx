import { StatusBar } from "expo-status-bar";
import React from "react";
import { NavigationContainer, DefaultTheme, Theme } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import DailyDetailScreen from "@/screens/DailyDetailScreen";
import DailyOverviewScreen from "@/screens/DailyOverviewScreen";
import SourcesScreen from "@/screens/SourcesScreen";
import BigTechScreen from "@/screens/BigTechScreen";
import type { DailyStackParamList } from "@/types/navigation";

const Tab = createBottomTabNavigator();
const DailyStack = createNativeStackNavigator<DailyStackParamList>();

const theme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "#2563eb",
    background: "#f8fafc",
    text: "#0f172a",
    card: "#ffffff",
    border: "#e2e8f0",
    notification: "#0ea5e9",
  },
};

const DailyStackNavigator = () => (
  <DailyStack.Navigator screenOptions={{ headerShown: false }}>
    <DailyStack.Screen name="DailyOverview" component={DailyOverviewScreen} />
    <DailyStack.Screen name="DailyDetail" component={DailyDetailScreen} />
  </DailyStack.Navigator>
);

const App = () => (
  <NavigationContainer theme={theme}>
    <StatusBar style="auto" />
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
      }}
    >
      <Tab.Screen name="Daily" component={DailyStackNavigator} />
      <Tab.Screen name="Sources" component={SourcesScreen} />
      <Tab.Screen name="Big Tech" component={BigTechScreen} />
    </Tab.Navigator>
  </NavigationContainer>
);

export default App;
