import { Text } from "@/src/framework/components";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";

import { useTheme } from "@/src/framework/theme";

type Props = {
  onSearch: (text: string) => void;
};

function SevaSearchBar({ onSearch }: Props) {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const [text, setText] = useState("");

  const firstRender = useRef(true);

  useEffect(() => {
    // Skip first render
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }

    const timer = setTimeout(() => {
      onSearch(text);
    }, 500);

    return () => clearTimeout(timer);
  }, [text, onSearch]);

  return (
    <View
      style={[
        styles.container,
        {
          borderColor: theme.colors.border,
          backgroundColor: theme.colors.card,
        },
      ]}
    >
      <Ionicons name="search" size={20} color={theme.colors.textSecondary} />

      <View style={styles.inputWrapper}>
  {!text && (
    <Text
      variant="body"
      color="textMuted"
      style={styles.placeholder}
    >
      {t("sevaSearch.searchSevas")}
    </Text>
  )}

  <TextInput
    style={[
      styles.input,
      {
        color: theme.colors.textPrimary,
      },
    ]}
    value={text}
    onChangeText={setText}
    autoCorrect={false}
    autoCapitalize="none"
    returnKeyType="search"
  />
</View>

      {text.length > 0 && (
        <TouchableOpacity
          onPress={() => {
            setText("");
            onSearch("");
          }}
        >
          <Ionicons
            name="close-circle"
            size={20}
            color={theme.colors.textSecondary}
          />
        </TouchableOpacity>
      )}
    </View>
  );
}

export default React.memo(SevaSearchBar);

const styles = StyleSheet.create({
  container: {
    height: 48,

    marginHorizontal: 16,
    marginTop: 10,
    marginBottom: 6,

    borderWidth: 1,
    borderRadius: 14,

    paddingHorizontal: 14,

    flexDirection: "row",
    alignItems: "center",
  },

 inputWrapper: {
  flex: 1,
  marginLeft: 10,
  position: "relative",
  justifyContent: "center",
},

input: {
  flex: 1,
  fontSize: 15,
  paddingVertical: 0,
},

placeholder: {
  position: "absolute",
  left: 0,
  zIndex: 1,
},
});
