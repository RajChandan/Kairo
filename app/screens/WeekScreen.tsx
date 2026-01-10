import { View, Text } from "react-native";

export default function WeekScreen() {
  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 28, fontWeight: "700" }}>Week</Text>
      <Text style={{ marginTop: 10, fontSize: 16, opacity: 0.8 }}>
        Weekly totals and category breakdown will be here.
      </Text>
    </View>
  );
}
