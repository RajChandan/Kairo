import React from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { theme } from "./theme";

export function Screen({ children }: { children: React.ReactNode }) {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.bg,
        padding: theme.space.lg,
      }}
    >
      {children}
    </View>
  );
}

export function Card({ children }: { children: React.ReactNode }) {
  return (
    <View
      style={{
        backgroundColor: theme.colors.card,
        borderRadius: theme.radius.card,
        padding: theme.space.lg,
        borderWidth: 1,
        borderColor: theme.colors.border,
      }}
    >
      {children}
    </View>
  );
}

export function Title({ children }: { children: React.ReactNode }) {
  return (
    <Text style={[theme.text.h1, { color: theme.colors.text }]}>
      {children}
    </Text>
  );
}

export function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <Text style={[theme.text.h2, { color: theme.colors.text }]}>
      {children}
    </Text>
  );
}

export function Muted({ children }: { children: React.ReactNode }) {
  return (
    <Text style={[theme.text.small, { color: theme.colors.muted }]}>
      {children}
    </Text>
  );
}

export function Input(props: React.ComponentProps<typeof TextInput>) {
  return (
    <TextInput
      {...props}
      placeholderTextColor={theme.colors.muted}
      style={[
        {
          backgroundColor: theme.colors.surface,
          borderWidth: 1,
          borderColor: theme.colors.border,
          borderRadius: theme.radius.input,
          paddingVertical: 12,
          paddingHorizontal: 14,
          color: theme.colors.text,
          fontSize: 15,
          fontWeight: "600",
        },
        props.style,
      ]}
    />
  );
}

export function Pill({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderRadius: theme.radius.pill,
        backgroundColor: active ? theme.colors.primary : "transparent",
        borderWidth: 1,
        borderColor: active ? "transparent" : theme.colors.border,
      }}
    >
      <Text
        style={{
          color: active ? theme.colors.white : theme.colors.text,
          fontWeight: "800",
          fontSize: 13,
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}

export function PrimaryButton({
  label,
  onPress,
}: {
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        backgroundColor: theme.colors.primary,
        paddingVertical: 14,
        borderRadius: theme.radius.input,
        alignItems: "center",
      }}
    >
      <Text
        style={{ color: theme.colors.white, fontWeight: "900", fontSize: 15 }}
      >
        {label}
      </Text>
    </Pressable>
  );
}
