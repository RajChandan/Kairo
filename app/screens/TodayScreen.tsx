import { View, Text, Pressable } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../types/navigation";

type Props = NativeStackScreenProps<RootStackParamList, "Today">;

export default function TodayScreen({ navigation }: Props) {
  return (
    <View style={{ flex: 1, padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 28, fontWeight: "700" }}>Today</Text>

      <Text style={{ fontSize: 16, opacity: 0.8 }}>
        This will become your 24-hour timeline.
      </Text>

      <Pressable
        onPress={() => navigation.navigate("AddActivity")}
        style={{
          marginTop: 8,
          paddingVertical: 14,
          paddingHorizontal: 16,
          borderRadius: 12,
          backgroundColor: "#111",
          alignSelf: "flex-start",
        }}
      >
        <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>
          + Log activity
        </Text>
      </Pressable>
    </View>
  );
}
