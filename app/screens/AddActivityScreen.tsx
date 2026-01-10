import { useMemo, useState } from "react";
import { Alert, Pressable, Text, TextInput, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../types/navigation";
import { insertActivity } from "../db/activities";

type Props = NativeStackScreenProps<RootStackParamList, "AddActivity">;

const categories = ["Startup", "Job", "Health", "Learning", "Rest"] as const;

function uuid() {
  // good enough for local-only v1
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export default function AddActivityScreen({ navigation }: Props) {
  const now = Date.now();

  const [title, setTitle] = useState("");
  const [category, setCategory] =
    useState<(typeof categories)[number]>("Startup");
  const [startTs, setStartTs] = useState(now);
  const [endTs, setEndTs] = useState(now + 30 * 60 * 1000);
  const [notes, setNotes] = useState("");

  const durationMins = useMemo(
    () => Math.max(0, Math.round((endTs - startTs) / 60000)),
    [startTs, endTs]
  );

  async function onSave() {
    const trimmed = title.trim();
    if (!trimmed) {
      Alert.alert(
        "Title required",
        "Add something like “Deep work” or “Workout”."
      );
      return;
    }
    if (endTs <= startTs) {
      Alert.alert("Time invalid", "End time must be after start time.");
      return;
    }

    await insertActivity({
      id: uuid(),
      title: trimmed,
      category,
      start_ts: startTs,
      end_ts: endTs,
      notes: notes.trim() ? notes.trim() : null,
      created_ts: Date.now(),
    });

    navigation.goBack();
  }

  function bumpEnd(minutes: number) {
    setEndTs((v) => v + minutes * 60 * 1000);
  }

  return (
    <View style={{ flex: 1, padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 28, fontWeight: "700" }}>Log activity</Text>

      <View style={{ gap: 6 }}>
        <Text style={{ fontWeight: "600" }}>Title</Text>
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="e.g., Deep work on Kairo"
          style={{
            borderWidth: 1,
            borderColor: "#ddd",
            borderRadius: 12,
            paddingHorizontal: 12,
            paddingVertical: 10,
            fontSize: 16,
          }}
        />
      </View>

      <View style={{ gap: 6 }}>
        <Text style={{ fontWeight: "600" }}>Category</Text>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
          {categories.map((c) => {
            const active = c === category;
            return (
              <Pressable
                key={c}
                onPress={() => setCategory(c)}
                style={{
                  paddingVertical: 8,
                  paddingHorizontal: 12,
                  borderRadius: 999,
                  borderWidth: 1,
                  borderColor: active ? "#111" : "#ddd",
                  backgroundColor: active ? "#111" : "#fff",
                }}
              >
                <Text
                  style={{ color: active ? "#fff" : "#111", fontWeight: "600" }}
                >
                  {c}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={{ gap: 6 }}>
        <Text style={{ fontWeight: "600" }}>Duration</Text>
        <Text style={{ fontSize: 16, opacity: 0.8 }}>
          {durationMins} minutes
        </Text>

        <View style={{ flexDirection: "row", gap: 8, marginTop: 6 }}>
          <Pressable
            onPress={() => bumpEnd(15)}
            style={{ padding: 10, borderRadius: 12, backgroundColor: "#eee" }}
          >
            <Text style={{ fontWeight: "600" }}>+15m</Text>
          </Pressable>
          <Pressable
            onPress={() => bumpEnd(30)}
            style={{ padding: 10, borderRadius: 12, backgroundColor: "#eee" }}
          >
            <Text style={{ fontWeight: "600" }}>+30m</Text>
          </Pressable>
          <Pressable
            onPress={() => bumpEnd(60)}
            style={{ padding: 10, borderRadius: 12, backgroundColor: "#eee" }}
          >
            <Text style={{ fontWeight: "600" }}>+60m</Text>
          </Pressable>
        </View>
      </View>

      <View style={{ gap: 6 }}>
        <Text style={{ fontWeight: "600" }}>Notes (optional)</Text>
        <TextInput
          value={notes}
          onChangeText={setNotes}
          placeholder="Any context…"
          multiline
          style={{
            borderWidth: 1,
            borderColor: "#ddd",
            borderRadius: 12,
            paddingHorizontal: 12,
            paddingVertical: 10,
            fontSize: 16,
            minHeight: 90,
            textAlignVertical: "top",
          }}
        />
      </View>

      <Pressable
        onPress={onSave}
        style={{
          marginTop: 8,
          paddingVertical: 14,
          paddingHorizontal: 16,
          borderRadius: 12,
          backgroundColor: "#111",
          alignItems: "center",
        }}
      >
        <Text style={{ color: "#fff", fontSize: 16, fontWeight: "700" }}>
          Save
        </Text>
      </Pressable>
    </View>
  );
}
