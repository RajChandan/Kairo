import { useEffect, useState } from "react";
import { Platform, Alert } from "react-native";

import { Pressable, Text, TextInput, View } from "react-native";
import { getSettings, updateSettings } from "../db/settings";
import { minutesToHhMm } from "../lib/time";

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

const CHUNK_OPTIONS = [15, 30, 45, 60] as const;
type ChunkOption = (typeof CHUNK_OPTIONS)[number];

export default function SettingsScreen() {
  const [dayStart, setDayStart] = useState(390); // minutes
  const [chunk, setChunk] = useState(30);

  useEffect(() => {
    if (Platform.OS === "web") return;
    getSettings()
      .then((s) => {
        setDayStart(s.day_start_minutes);
        setChunk(s.default_chunk_minutes);
      })
      .catch((e) => Alert.alert("Settings load failed", String(e)));
  }, []);

  const { hh, mm } = minutesToHhMm(dayStart);

  async function onSave() {
    if (Platform.OS === "web") {
      Alert.alert("Web preview", "Settings saving is disabled on web.");
      return;
    }
    try {
      await updateSettings({
        day_start_minutes: clamp(dayStart, 0, 1439),
        default_chunk_minutes: clamp(chunk, 1, 240),
      });
      Alert.alert("Saved", "Settings updated.");
    } catch (e) {
      Alert.alert("Save failed", String(e));
    }
  }

  return (
    <View style={{ flex: 1, padding: 16, gap: 14 }}>
      <Text style={{ fontSize: 28, fontWeight: "700" }}>Settings</Text>

      <View style={{ gap: 6 }}>
        <Text style={{ fontWeight: "700" }}>Default chunk length</Text>

        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
          {CHUNK_OPTIONS.map((m) => {
            const active = chunk === m;
            return (
              <Pressable
                key={m}
                onPress={() => setChunk(m)}
                style={{
                  paddingVertical: 10,
                  paddingHorizontal: 14,
                  borderRadius: 999,
                  borderWidth: 1,
                  borderColor: active ? "#111" : "#ddd",
                  backgroundColor: active ? "#111" : "#fff",
                }}
              >
                <Text
                  style={{
                    fontWeight: "700",
                    color: active ? "#fff" : "#111",
                  }}
                >
                  {m} min
                </Text>
              </Pressable>
            );
          })}
        </View>
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
        <Text style={{ color: "#fff", fontSize: 16, fontWeight: "800" }}>
          Save
        </Text>
      </Pressable>
    </View>
  );
}
