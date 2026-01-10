import { View, Text } from "react-native";

export default function ReviewScreen() {
  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 28, fontWeight: "700" }}>Daily review</Text>
      <Text style={{ marginTop: 10, fontSize: 16, opacity: 0.8 }}>
        Wins, blockers, mood, plan tomorrow will be here.
      </Text>
    </View>
  );
}
