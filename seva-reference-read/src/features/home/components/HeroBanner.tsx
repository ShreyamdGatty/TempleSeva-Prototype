import { Button, Text } from "@/src/framework/components";
import { useTheme } from "@/src/framework/theme";
import { useTempleStore } from "@/src/shared/temple/templeStore";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { MapPin } from "lucide-react-native";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { StyleSheet, View } from "react-native";

type Props = {
  onSelectTemple: () => void;
  onContinueBooking: () => void;
};

export default function HeroBanner({
  onSelectTemple,
  onContinueBooking,
}: Props) {
  const { t } = useTranslation();
  const { theme } = useTheme();

  const selected = useTempleStore((state) => state.selected);

  // Tracks whether the backend image failed to load
  const [imageError, setImageError] = useState(false);

  /**
   * Reset image error whenever the selected temple changes.
   *
   * This is important because if Temple A has a broken image,
   * we show the generic image. When Temple B is selected,
   * we need to try Temple B's backend image again.
   */
  useEffect(() => {
    setImageError(false);
  }, [selected?.id, selected?.templeImg]);

  /**
   * Convert the backend image into a valid data URI.
   *
   * Backend can return:
   * 1. Complete data URI:
   *    data:image/webp;base64,...
   *
   * 2. Raw Base64:
   *    UklGR...
   *
   * 3. Empty/null/undefined
   */
  const imageUri = selected?.templeImg
    ? selected.templeImg.startsWith("data:image")
      ? selected.templeImg
      : `data:image/webp;base64,${selected.templeImg}`
    : undefined;

  /**
   * Use backend image when available.
   *
   * If backend image is missing OR fails to load,
   * use the generic temple image.
   */
  const imageSource =
    imageUri && !imageError
      ? { uri: imageUri }
      : require("../../../../assets/images/generic_image.webp");

  return (
    <View style={styles.container}>
      {/* ================================= */}
      {/* Background */}
      {/* ================================= */}

      <Image
        source={imageSource}
        style={styles.image}
        contentFit="cover"
        contentPosition="center"
        transition={300}
        onError={() => {
          // Backend image failed -> use generic image
          setImageError(true);
        }}
      />

      {/* ================================= */}
      {/* Gradient */}
      {/* ================================= */}

      <LinearGradient
        colors={[
          "rgba(0,0,0,0.02)",
          "rgba(0,0,0,0.30)",
          "rgba(0,0,0,0.88)",
        ]}
        start={{
          x: 0.5,
          y: 0,
        }}
        end={{
          x: 0.5,
          y: 1,
        }}
        style={StyleSheet.absoluteFill}
      />

      {/* ================================= */}
      {/* CONTENT */}
      {/* ================================= */}

      <View style={styles.content}>
        {selected ? (
          <>
            {/* ================================= */}
            {/* AFTER TEMPLE SELECTION */}
            {/* ================================= */}

            {/* Selected label */}

            <View style={styles.selectedLabel}>
              <MapPin size={13} color="#FFFFFF" />

              <Text style={styles.selectedLabelText}>
                 {t("heroBanner.selectedTemple")}
              </Text>
            </View>

            {/* Temple name */}

            <View
              style={[
                styles.templeNameContainer,
                {
                  backgroundColor: "rgba(255,255,255,0.14)",
                  borderColor: "rgba(255,255,255,0.30)",
                },
              ]}
            >
              <View
                style={[
                  styles.templeIcon,
                  {
                    backgroundColor: theme.colors.accent,
                  },
                ]}
              >
                <MaterialCommunityIcons
                  name="temple-hindu-outline"
                  size={24}
                  color="white"
                />
              </View>

              <Text numberOfLines={2} style={styles.templeName}>
                {selected.orgName}
              </Text>
            </View>

            {/* Description */}

            <Text style={styles.selectedDescription} numberOfLines={3}>
                {t("heroBanner.selectedDescription")}
            </Text>

            {/* Continue */}

            <Button
             title={t("heroBanner.continueBooking")}
              onPress={onContinueBooking}
              style={[
                styles.button,
                {
                  backgroundColor: theme.colors.accent,
                },
              ]}
            />
          </>
        ) : (
          <>
            {/* ================================= */}
            {/* BEFORE TEMPLE SELECTION */}
            {/* ================================= */}

            {/* Small eyebrow */}

            <Text style={styles.eyebrow}>
              {t("heroBanner.spiritualJourney")}
            </Text>

            {/* Main title */}

            <Text style={styles.title}>
                {t("heroBanner.beginJourney")}
            
            </Text>

            {/* Description */}

            <Text style={styles.description} numberOfLines={3}>
               {t("heroBanner.journeyDescription")}
             
            </Text>

            {/* Select */}

            <Button
            title={t("heroBanner.selectTemple")}
              onPress={onSelectTemple}
              style={[
                styles.button,
                {
                  backgroundColor: theme.colors.accent,
                },
              ]}
            />
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  /* =====================================
     Container
  ===================================== */

  container: {
    width: "100%",
    height: 260,
    marginTop: 16,
    borderRadius: 16,
    overflow: "hidden",
    position: "relative",
  },

  /* =====================================
     Image
  ===================================== */

  image: {
    ...StyleSheet.absoluteFill,
    width: "100%",
    height: "100%",
  },

  /* =====================================
     Content
  ===================================== */

  content: {
    flex: 1,
    justifyContent: "center",
    width: "92%",
    paddingHorizontal: 18,
    paddingBottom: 10,
  },

  /* =====================================
     BEFORE SELECTION
  ===================================== */

  eyebrow: {
    color: "rgba(255,255,255,0.78)",
    fontSize: 10,
    lineHeight: 13,
    letterSpacing: 1.2,
    marginBottom: 4,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 20,
    lineHeight: 31,
    fontFamily: "Roboto_700Bold",
    textShadowColor: "rgba(0,0,0,0.40)",
    textShadowOffset: {
      width: 0,
      height: 1,
    },
    textShadowRadius: 3,
  },

  description: {
    color: "rgba(255,255,255,0.92)",
    fontSize: 13,
    lineHeight: 19,
    marginTop: 7,
    maxWidth: 320,
  },

  /* =====================================
     AFTER SELECTION
  ===================================== */

  selectedLabel: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 7,
  },

  selectedLabelText: {
    color: "rgba(255,255,255,0.82)",
    fontSize: 10,
    lineHeight: 13,
    letterSpacing: 1,
    marginLeft: 5,
  },

  /* =====================================
     Selected temple highlight
  ===================================== */

  templeNameContainer: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    maxWidth: "100%",
    minHeight: 52,
    borderRadius: 14,
    borderWidth: 1,
    paddingVertical: 7,
    paddingHorizontal: 8,
    paddingRight: 14,
  },

  templeIcon: {
    width: 36,
    height: 36,
    borderRadius: 11,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 9,
  },

  templeName: {
    flex: 1,
    color: "#fffefb",
    fontFamily: "Roboto_700Bold",
    fontSize: 17,
    lineHeight: 22,
  },

  selectedDescription: {
    color: "rgba(255,255,255,0.92)",
    fontSize: 12,
    lineHeight: 18,
    marginTop: 8,
    maxWidth: 320,
  },

  /* =====================================
     Button
  ===================================== */

  button: {
    alignSelf: "flex-start",
    minWidth: 135,
    height: 45,
    marginTop: 15,
    paddingHorizontal: 17,
    borderRadius: 9,
  },
});

