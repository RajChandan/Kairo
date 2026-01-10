import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import TodayScreen from "./app/screens/TodayScreen";
import AddActivityScreen from "./app/screens/AddActivityScreen";
import WeekScreen from "./app/screens/WeekScreen";
import HabitsScreen from "./app/screens/HabitsScreen";
import ReviewScreen from "./app/screens/ReviewScreen";

import type { RootStackParamList } from "./app/types/navigation";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
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
