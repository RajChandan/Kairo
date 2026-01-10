import { View, Text, Pressable } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../types/navigation";

type Props = NativeStackScreenProps<RootStackParamList, "AddActivity">;

export default function AddActivityScreen({ navigation }: Props) {
  return (
    <View style={{ flex: 1, padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 28, fontWeight: "700" }}>Add activity</Text>

      <Text style={{ fontSize: 16, opacity: 0.8 }}>
        Form will come next (title, category, start/end time).
      </Text>

      <Pressable
        onPress={() => navigation.goBack()}
        style={{
          marginTop: 8,
          paddingVertical: 14,
          paddingHorizontal: 16,
          borderRadius: 12,
          backgroundColor: "#eee",
          alignSelf: "flex-start",
        }}
      >
        <Text style={{ fontSize: 16, fontWeight: "600" }}>Back</Text>
      </Pressable>
    </View>
  );
}
