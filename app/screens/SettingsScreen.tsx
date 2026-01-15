import { useEffect, useState } from "react";
import { Alert, Pressable, Text, TextInput, View } from "react-native";
import { getSettings, updateSettings } from "../db/settings";
import { minutesToHhMm } from "../lib/time";

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export default function SettingsScreen() {
  const [dayStart, setDayStart] = useState(390); // minutes
  const [chunk, setChunk] = useState(30);

  useEffect(() => {
    getSettings()
      .then((s) => {
        setDayStart(s.day_start_minutes);
        setChunk(s.default_chunk_minutes);
      })
      .catch((e) => Alert.alert("Settings load failed", String(e)));
  }, []);

  const { hh, mm } = minutesToHhMm(dayStart);

  async function onSave() {
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
        <Text style={{ fontWeight: "700" }}>Day starts at</Text>
        <Text style={{ opacity: 0.75 }}>
          Current: {String(hh).padStart(2, "0")}:{String(mm).padStart(2, "0")}
        </Text>

        <Text style={{ opacity: 0.7, marginTop: 6 }}>
          Enter minutes from midnight (0–1439). Example: 6:30 AM = 390
        </Text>

        <TextInput
          keyboardType="number-pad"
          value={String(dayStart)}
          onChangeText={(v) => setDayStart(Number(v || 0))}
          style={{
            borderWidth: 1,
            borderColor: "#ddd",
            borderRadius: 12,
            padding: 12,
            fontSize: 16,
          }}
        />
      </View>

      <View style={{ gap: 6 }}>
        <Text style={{ fontWeight: "700" }}>Default chunk (minutes)</Text>
        <TextInput
          keyboardType="number-pad"
          value={String(chunk)}
          onChangeText={(v) => setChunk(Number(v || 0))}
          style={{
            borderWidth: 1,
            borderColor: "#ddd",
            borderRadius: 12,
            padding: 12,
            fontSize: 16,
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
        <Text style={{ color: "#fff", fontSize: 16, fontWeight: "800" }}>
          Save
        </Text>
      </Pressable>
    </View>
  );
}
