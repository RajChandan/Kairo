import { useEffect, useState } from "react";
import { Alert, Pressable, Text, TextInput, View } from "react-native";

import { getSettings, updateSettings } from "../db/settings";
import { listKinds, addKind, deactivateKind, type KindRow } from "../db/kinds";
import { listAreas, addArea, deactivateArea, type AreaRow } from "../db/areas";
import { minutesToHhMm } from "../lib/time";
import {
  Screen,
  Card,
  Title,
  SectionTitle,
  Muted,
  Input,
  Pill,
  PrimaryButton,
} from "../ui/components";
import { theme } from "../ui/theme";

const CHUNK_OPTIONS = [15, 30, 45, 60] as const;

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export default function SettingsScreen() {
  const [dayStart, setDayStart] = useState(390);
  const [chunk, setChunk] = useState<(typeof CHUNK_OPTIONS)[number]>(30);

  const [kinds, setKinds] = useState<KindRow[]>([]);
  const [areas, setAreas] = useState<AreaRow[]>([]);

  const [defaultKindId, setDefaultKindId] = useState<string | null>(null);
  const [defaultAreaId, setDefaultAreaId] = useState<string | null>(null);

  const [newKind, setNewKind] = useState("");
  const [newArea, setNewArea] = useState("");

  async function refreshLists() {
    const [ks, ars] = await Promise.all([listKinds(true), listAreas(true)]);
    setKinds(ks);
    setAreas(ars);
  }

  useEffect(() => {
    getSettings()
      .then(async (s) => {
        setDayStart(s.day_start_minutes);
        setChunk(
          CHUNK_OPTIONS.includes(s.default_chunk_minutes as any)
            ? (s.default_chunk_minutes as any)
            : 30,
        );
        setDefaultKindId(s.default_kind_id ?? "kind_productive");
        setDefaultAreaId(s.default_area_id ?? "area_startup");
        await refreshLists();
      })
      .catch((e) => Alert.alert("Settings load failed", String(e)));
  }, []);

  const { hh, mm } = minutesToHhMm(dayStart);

  async function onSave() {
    try {
      await updateSettings({
        day_start_minutes: clamp(dayStart, 0, 1439),
        default_chunk_minutes: chunk,
        default_kind_id: defaultKindId,
        default_area_id: defaultAreaId,
      });
      Alert.alert("Saved", "Settings updated.");
    } catch (e) {
      Alert.alert("Save failed", String(e));
    }
  }

  async function onAddKind() {
    try {
      await addKind(newKind);
      setNewKind("");
      await refreshLists();
    } catch (e) {
      Alert.alert("Add Kind failed", String(e));
    }
  }

  async function onAddArea() {
    try {
      await addArea(newArea);
      setNewArea("");
      await refreshLists();
    } catch (e) {
      Alert.alert("Add Area failed", String(e));
    }
  }

  return (
    <Screen>
      <Title>Settings</Title>
      <Muted>Make Kairo fit your day.</Muted>

      <View style={{ height: theme.space.lg }} />

      <Card>
        <SectionTitle>Default chunk length</SectionTitle>
        <View style={{ height: theme.space.sm }} />

        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
          {CHUNK_OPTIONS.map((m) => (
            <Pill
              key={m}
              label={`${m} min`}
              active={chunk === m}
              onPress={() => setChunk(m)}
              activeColor="#22C55E" // green selected
            />
          ))}
        </View>
      </Card>

      <View style={{ height: theme.space.md }} />

      <PrimaryButton label="Save" onPress={onSave} />
    </Screen>
  );
}
