import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import TodayScreen from "./app/screens/TodayScreen";
import AddActivityScreen from "./app/screens/AddActivityScreen";
import WeekScreen from "./app/screens/WeekScreen";
import HabitsScreen from "./app/screens/HabitsScreen";
import ReviewScreen from "./app/screens/ReviewScreen";

import type { RootStackParamList } from "./app/types/navigation";
import { initDb } from "./app/db";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const [ready, setReady] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    initDb()
      .then(() => setReady(true))
      .catch((e) => setErr(String(e)));
  }, []);

  if (err) {
    return (
      <View style={{ flex: 1, padding: 16, justifyContent: "center" }}>
        <Text style={{ fontSize: 18, fontWeight: "700" }}>DB init failed</Text>
        <Text style={{ marginTop: 8 }}>{err}</Text>
      </View>
    );
  }

  if (!ready) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text>Loading Kairo…</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Today">
        <Stack.Screen name="Today" component={TodayScreen} />
        <Stack.Screen
          name="AddActivity"
          component={AddActivityScreen}
          options={{ title: "Log" }}
        />
        <Stack.Screen name="Week" component={WeekScreen} />
        <Stack.Screen name="Habits" component={HabitsScreen} />
        <Stack.Screen name="Review" component={ReviewScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
