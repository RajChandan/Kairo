import { View, Text } from "react-native";

export default function HabitsScreen() {
  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 28, fontWeight: "700" }}>Habits</Text>
      <Text style={{ marginTop: 10, fontSize: 16, opacity: 0.8 }}>
        Daily habit checklist (walk/workout/sleep) will be here.
      </Text>
    </View>
  );
}
