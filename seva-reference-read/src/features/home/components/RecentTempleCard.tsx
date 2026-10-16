import { Text } from "@/src/framework/components";
import { useTheme } from "@/src/framework/theme";
import { Image } from "expo-image";
import { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

type Props = {
  templeName: string;
  templeImg?: string | null;
  shrine?: string | null;
  onPress?: () => void;
};

export default function RecentTempleCard({
  templeName,
  templeImg,
  onPress,
}: Props) {
  const { theme } = useTheme();
  const [imageError, setImageError] = useState(false);

 const imageUri =
  templeImg &&
  typeof templeImg === "string" &&
  templeImg.trim().length > 0
    ? templeImg.startsWith("data:image")
      ? templeImg
      : `data:image/webp;base64,${templeImg}`
    : undefined;

    const imageSource =
  imageUri && !imageError
    ? { uri: imageUri }
    : require("../../../../assets/images/generic_image.webp");

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={styles.container}
    >
      {/* Temple Image */}

      <View
        style={[
          styles.imageContainer,
          {
            backgroundColor: theme.colors.border,
          },
        ]}
      >
        <Image
  source={imageSource}
  style={styles.image}
  contentFit="cover"
  contentPosition="center"
  transition={300}
  onError={() => {
    setImageError(true);
  }}
/>
      </View>

      {/* Temple Name */}

      <Text variant="label" numberOfLines={2} style={styles.title}>
        {templeName}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },

  imageContainer: {
    width: "100%",

    height: 105,

    borderRadius: 10,

    overflow: "hidden",
  },

  image: {
    width: "100%",
    height: "100%",
  },

  title: {
    marginTop: 6,

    fontSize: 10,

    lineHeight: 13,

    fontWeight: "600",

    color: "#333333",

    textAlign: "center",
  },
});
