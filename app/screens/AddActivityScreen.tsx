import { useEffect, useMemo, useState } from "react";
import { Alert, Pressable, Text, TextInput, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import type { RootStackParamList } from "../types/navigation";
import { getSettings } from "../db/settings";
import { listKinds, type KindRow } from "../db/kinds";
import { listAreas, type AreaRow } from "../db/areas";
import { insertActivity } from "../db/activities";

type Props = NativeStackScreenProps<RootStackParamList, "AddActivity">;

function uuid() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export default function AddActivityScreen({ navigation }: Props) {
  const now = Date.now();

  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");

  const [kinds, setKinds] = useState<KindRow[]>([]);
  const [areas, setAreas] = useState<AreaRow[]>([]);

  const [kindId, setKindId] = useState<string | null>(null);
  const [areaId, setAreaId] = useState<string | null>(null);

  const [startTs, setStartTs] = useState(now);
  const [endTs, setEndTs] = useState(now + 30 * 60 * 1000);

  useEffect(() => {
    Promise.all([getSettings(), listKinds(true), listAreas(true)])
      .then(([s, ks, ars]) => {
        setKinds(ks);
        setAreas(ars);

        setKindId(s.default_kind_id ?? ks[0]?.id ?? null);
        setAreaId(s.default_area_id ?? ars[0]?.id ?? null);

        setStartTs(Date.now());
        setEndTs(Date.now() + s.default_chunk_minutes * 60 * 1000);
      })
      .catch((e) => Alert.alert("Load failed", String(e)));
  }, []);

  const durationMins = useMemo(
    () => Math.max(0, Math.round((endTs - startTs) / 60000)),
    [startTs, endTs],
  );

  function bumpEnd(minutes: number) {
    setEndTs((v) => v + minutes * 60 * 1000);
  }

  async function onSave() {
    const trimmed = title.trim();
    if (!trimmed) {
      Alert.alert(
        "Title required",
        "Add something like “Deep work” or “Workout”.",
      );
      return;
    }
    if (!kindId || !areaId) {
      Alert.alert("Select Kind & Area", "Please choose both Kind and Area.");
      return;
    }
    if (endTs <= startTs) {
      Alert.alert("Time invalid", "End time must be after start time.");
      return;
    }

    // category legacy: store area name if available (nice for older UI)
    const areaName = areas.find((a) => a.id === areaId)?.name ?? "General";

    await insertActivity({
      id: uuid(),
      title: trimmed,
      category: areaName,
      start_ts: startTs,
      end_ts: endTs,
      notes: notes.trim() ? notes.trim() : null,
      created_ts: Date.now(),
      kind_id: kindId,
      area_id: areaId,
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
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
          {kinds.map((k) => {
            const active = k.id === kindId;
            return (
              <Pressable
                key={k.id}
                onPress={() => setKindId(k.id)}
                style={{
                  paddingVertical: 10,
                  paddingHorizontal: 14,
                  borderRadius: 999,
                  backgroundColor: active ? "#22c55e" : "transparent",
                  borderWidth: active ? 0 : 1,
                  borderColor: "#d1d5db",
                }}
              >
                <Text
                  style={{ fontWeight: "700", color: active ? "#fff" : "#111" }}
                >
                  {k.name}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={{ gap: 6 }}>
        <Text style={{ fontWeight: "700" }}>Area</Text>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
          {areas.map((a) => {
            const active = a.id === areaId;
            return (
              <Pressable
                key={a.id}
                onPress={() => setAreaId(a.id)}
                style={{
                  paddingVertical: 10,
                  paddingHorizontal: 14,
                  borderRadius: 999,
                  backgroundColor: active ? "#22c55e" : "transparent",
                  borderWidth: active ? 0 : 1,
                  borderColor: "#d1d5db",
                }}
              >
                <Text
                  style={{ fontWeight: "700", color: active ? "#fff" : "#111" }}
                >
                  {a.name}
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
