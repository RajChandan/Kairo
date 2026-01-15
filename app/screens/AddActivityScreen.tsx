import { useEffect, useMemo, useState } from "react";
import { Alert, Pressable, Text, TextInput, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import type { RootStackParamList } from "../types/navigation";
import { getSettings } from "../db/settings";
import { insertActivity, type Area, type Kind } from "../db/activities";

type Props = NativeStackScreenProps<RootStackParamList, "AddActivity">;

const kinds: Kind[] = ["Productive", "Casual", "Other"];
const areas: Area[] = [
  "Startup",
  "Job",
  "Health",
  "Learning",
  "Rest",
  "Personal",
  "Admin",
];

function uuid() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export default function AddActivityScreen({ navigation }: Props) {
  const now = Date.now();

  const [title, setTitle] = useState("");
  const [kind, setKind] = useState<Kind>("Productive");
  const [area, setArea] = useState<Area>("Startup");
  const [startTs, setStartTs] = useState(now);
  const [endTs, setEndTs] = useState(now + 30 * 60 * 1000);
  const [notes, setNotes] = useState("");

  // ✅ Hook is INSIDE the component
  useEffect(() => {
    getSettings()
      .then((s) => {
        setStartTs(Date.now());
        setEndTs(Date.now() + s.default_chunk_minutes * 60 * 1000);
      })
      .catch(() => {});
  }, []);

  const durationMins = useMemo(
    () => Math.max(0, Math.round((endTs - startTs) / 60000)),
    [startTs, endTs]
  );

  function bumpEnd(minutes: number) {
    setEndTs((v) => v + minutes * 60 * 1000);
  }

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
      category: area, // backward compatibility field
      kind,
      area,
      start_ts: startTs,
      end_ts: endTs,
      notes: notes.trim() ? notes.trim() : null,
      created_ts: Date.now(),
    });

    navigation.goBack();
  }

  return (
    <View style={{ flex: 1, padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 28, fontWeight: "700" }}>Log activity</Text>

      <View style={{ gap: 6 }}>
        <Text style={{ fontWeight: "700" }}>Title</Text>
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="e.g., Deep work"
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
        <Text style={{ fontWeight: "700" }}>Kind</Text>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
          {kinds.map((k) => {
            const active = k === kind;
            return (
              <Pressable
                key={k}
                onPress={() => setKind(k)}
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
                  style={{ color: active ? "#fff" : "#111", fontWeight: "700" }}
                >
                  {k}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={{ gap: 6 }}>
        <Text style={{ fontWeight: "700" }}>Area</Text>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
          {areas.map((a) => {
            const active = a === area;
            return (
              <Pressable
                key={a}
                onPress={() => setArea(a)}
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
                  style={{ color: active ? "#fff" : "#111", fontWeight: "700" }}
                >
                  {a}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={{ gap: 6 }}>
        <Text style={{ fontWeight: "700" }}>Duration</Text>
        <Text style={{ opacity: 0.75 }}>{durationMins} minutes</Text>

        <View style={{ flexDirection: "row", gap: 8, marginTop: 6 }}>
          <Pressable
            onPress={() => bumpEnd(5)}
            style={{ padding: 10, borderRadius: 12, backgroundColor: "#eee" }}
          >
            <Text style={{ fontWeight: "700" }}>+5m</Text>
          </Pressable>
          <Pressable
            onPress={() => bumpEnd(15)}
            style={{ padding: 10, borderRadius: 12, backgroundColor: "#eee" }}
          >
            <Text style={{ fontWeight: "700" }}>+15m</Text>
          </Pressable>
          <Pressable
            onPress={() => bumpEnd(30)}
            style={{ padding: 10, borderRadius: 12, backgroundColor: "#eee" }}
          >
            <Text style={{ fontWeight: "700" }}>+30m</Text>
          </Pressable>
          <Pressable
            onPress={() => bumpEnd(60)}
            style={{ padding: 10, borderRadius: 12, backgroundColor: "#eee" }}
          >
            <Text style={{ fontWeight: "700" }}>+60m</Text>
          </Pressable>
        </View>
      </View>

      <View style={{ gap: 6 }}>
        <Text style={{ fontWeight: "700" }}>Notes (optional)</Text>
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
          marginTop: 6,
          paddingVertical: 14,
          paddingHorizontal: 16,
          borderRadius: 12,
          backgroundColor: "#111",
          alignItems: "center",
        }}
      >
        <Text style={{ color: "#fff", fontSize: 16, fontWeight: "800" }}>
          Save
        </Text>
      </Pressable>
    </View>
  );
}
