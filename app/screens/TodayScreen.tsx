import { useCallback, useState } from "react";
import { Alert, Pressable, Text, View, ScrollView } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { getSettings } from "../db/settings";
import { dayRangeForNow } from "../lib/time";

import type { RootStackParamList } from "../types/navigation";

import {
  deleteActivity,
  listActivitiesBetween,
  type Activity,
} from "../db/activities";
import {
  formatTime,
  minutesBetween,
  startOfTodayMs,
  startOfTomorrowMs,
} from "../lib/time";

type Props = NativeStackScreenProps<RootStackParamList, "Today">;

export default function TodayScreen({ navigation }: Props) {
  const [items, setItems] = useState<Activity[]>([]);

  const load = useCallback(() => {
    getSettings()
      .then((s) => {
        const { startMs, endMs } = dayRangeForNow(s.day_start_minutes);
        return listActivitiesBetween(startMs, endMs);
      })
      .then(setItems)
      .catch((e) => Alert.alert("Load failed", String(e)));
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  async function onDelete(id: string) {
    await deleteActivity(id);
    load();
  }

  return (
    <View style={{ flex: 1, padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 28, fontWeight: "700" }}>Today</Text>

      <View style={{ flexDirection: "row", gap: 10, flexWrap: "wrap" }}>
        <Pressable
          onPress={() => navigation.navigate("Settings")}
          style={{
            paddingVertical: 12,
            paddingHorizontal: 14,
            borderRadius: 12,
            backgroundColor: "#eee",
          }}
        >
          <Text style={{ fontWeight: "700" }}>Settings</Text>
        </Pressable>

        <Pressable
          onPress={() => navigation.navigate("AddActivity")}
          style={{
            paddingVertical: 12,
            paddingHorizontal: 14,
            borderRadius: 12,
            backgroundColor: "#111",
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "700" }}>+ Log</Text>
        </Pressable>

        <Pressable
          onPress={() => navigation.navigate("Week")}
          style={{
            paddingVertical: 12,
            paddingHorizontal: 14,
            borderRadius: 12,
            backgroundColor: "#eee",
          }}
        >
          <Text style={{ fontWeight: "700" }}>Week</Text>
        </Pressable>

        <Pressable
          onPress={() => navigation.navigate("Habits")}
          style={{
            paddingVertical: 12,
            paddingHorizontal: 14,
            borderRadius: 12,
            backgroundColor: "#eee",
          }}
        >
          <Text style={{ fontWeight: "700" }}>Habits</Text>
        </Pressable>

        <Pressable
          onPress={() => navigation.navigate("Review")}
          style={{
            paddingVertical: 12,
            paddingHorizontal: 14,
            borderRadius: 12,
            backgroundColor: "#eee",
          }}
        >
          <Text style={{ fontWeight: "700" }}>Review</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={{ gap: 10, paddingBottom: 40 }}>
        {items.length === 0 ? (
          <Text style={{ opacity: 0.7, marginTop: 10 }}>
            No activities yet. Tap “+ Log”.
          </Text>
        ) : (
          items.map((a) => (
            <View
              key={a.id}
              style={{
                borderWidth: 1,
                borderColor: "#eee",
                borderRadius: 14,
                padding: 12,
                gap: 6,
              }}
            >
              <Text style={{ fontSize: 16, fontWeight: "800" }}>{a.title}</Text>
              <Text style={{ opacity: 0.8 }}>
                {a.category} • {formatTime(a.start_ts)} – {formatTime(a.end_ts)}{" "}
                • {minutesBetween(a.start_ts, a.end_ts)}m
              </Text>

              <View style={{ flexDirection: "row", gap: 10, marginTop: 6 }}>
                <Pressable
                  onPress={() =>
                    Alert.alert("Delete?", "Remove this activity?", [
                      { text: "Cancel", style: "cancel" },
                      {
                        text: "Delete",
                        style: "destructive",
                        onPress: () => onDelete(a.id),
                      },
                    ])
                  }
                  style={{
                    paddingVertical: 10,
                    paddingHorizontal: 12,
                    borderRadius: 12,
                    backgroundColor: "#ffecec",
                  }}
                >
                  <Text style={{ fontWeight: "700" }}>Delete</Text>
                </Pressable>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}
