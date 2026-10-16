import { Text } from "@/src/framework/components";
import { useTheme } from "@/src/framework/theme";
import { router } from "expo-router";
import {
  ArrowLeft,
  Bell,
  CalendarDays,
  Heart,
  MapPin,
} from "lucide-react-native";
import { useTranslation } from "react-i18next";
import {
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function AboutTempleSevaScreen() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const colors = theme.colors;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.page,
        },
      ]}
    >
      {/* =====================================================
          HEADER
      ===================================================== */}

      <View
        style={[
          styles.header,
          {
            paddingTop: insets.top,
            backgroundColor: "#FFFDFC",
            borderBottomColor: "#F1E3D5",
          },
        ]}
      >
        <View style={styles.headerContent}>
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [
              styles.backButton,
              {
                backgroundColor: colors.accentMuted,
                borderColor: colors.border,
              },
              pressed && {
                opacity: 0.7,
              },
            ]}
          >
            <ArrowLeft
              size={22}
              color={colors.accent}
              strokeWidth={2.3}
            />
          </Pressable>

          <Text
            style={[
              styles.headerTitle,
              {
                color: colors.textPrimary,
              },
            ]}
          >
            {t("aboutTempleSeva.title")}
          </Text>
        </View>
      </View>

      {/* =====================================================
          HERO
      ===================================================== */}

      <ImageBackground
        source={require("@/assets/images/AboutTempleSeva.webp")}
        style={styles.heroImage}
        resizeMode="cover"
      />

      {/* =====================================================
          CONTENT
      ===================================================== */}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingBottom: insets.bottom + 30,
          },
        ]}
      >
        {/* =====================================================
            INTRO
        ===================================================== */}

        <View
          style={[
            styles.introCard,
            {
              backgroundColor: colors.accentMuted,
              borderColor: colors.border,
            },
          ]}
        >
          <Text
            style={[
              styles.introHeading,
              {
                color: colors.accent,
              },
            ]}
          >
            {t("aboutTempleSeva.introHeading")}
          </Text>

          <Text
            style={[
              styles.introText,
              {
                color: colors.textPrimary,
              },
            ]}
          >
            {t("aboutTempleSeva.introText")}
          </Text>
        </View>

        {/* =====================================================
            SECTION TITLE
        ===================================================== */}

        <Text
          style={[
            styles.sectionTitle,
            {
              color: colors.accent,
            },
          ]}
        >
          {t("aboutTempleSeva.whatWeOffer")}
        </Text>

        {/* =====================================================
            OFFER GRID
        ===================================================== */}

        <View style={styles.grid}>
          <OfferCard
            icon={<MapPin size={20} color={colors.accent} />}
            title={t(
              "aboutTempleSeva.offers.templeDiscovery.title",
            )}
            desc={t(
              "aboutTempleSeva.offers.templeDiscovery.description",
            )}
          />

          <OfferCard
            icon={<CalendarDays size={20} color={colors.accent} />}
            title={t(
              "aboutTempleSeva.offers.sevaBooking.title",
            )}
            desc={t(
              "aboutTempleSeva.offers.sevaBooking.description",
            )}
          />

          <OfferCard
            icon={<Heart size={20} color={colors.accent} />}
            title={t(
              "aboutTempleSeva.offers.mySevas.title",
            )}
            desc={t(
              "aboutTempleSeva.offers.mySevas.description",
            )}
          />

          <OfferCard
            icon={<Bell size={20} color={colors.accent} />}
            title={t(
              "aboutTempleSeva.offers.notifications.title",
            )}
            desc={t(
              "aboutTempleSeva.offers.notifications.description",
            )}
          />
        </View>

        {/* =====================================================
            WHY + VISION
        ===================================================== */}

        <View
          style={[
            styles.whyVisionWrapper,
            {
              backgroundColor: colors.accentMuted,
              borderColor: colors.border,
            },
          ]}
        >
          {/* =====================================================
              WHY CHOOSE
          ===================================================== */}

          <View style={styles.sideSection}>
            <View
              style={[
                styles.ribbon,
                {
                  backgroundColor: colors.accent,
                },
              ]}
            >
              <Text
                style={[
                  styles.ribbonText,
                  {
                    color: colors.onAccent,
                  },
                ]}
              >
                {t("aboutTempleSeva.whyChoose")}
              </Text>
            </View>

            <View style={styles.contentBox}>
              <Feature
                text={t(
                  "aboutTempleSeva.features.convenience.title",
                )}
                sub={t(
                  "aboutTempleSeva.features.convenience.description",
                )}
              />

              <Feature
                text={t(
                  "aboutTempleSeva.features.clarity.title",
                )}
                sub={t(
                  "aboutTempleSeva.features.clarity.description",
                )}
              />

              <Feature
                text={t(
                  "aboutTempleSeva.features.timeSaving.title",
                )}
                sub={t(
                  "aboutTempleSeva.features.timeSaving.description",
                )}
              />

              <Feature
                text={t(
                  "aboutTempleSeva.features.spiritualConnection.title",
                )}
                sub={t(
                  "aboutTempleSeva.features.spiritualConnection.description",
                )}
              />
            </View>
          </View>

          {/* =====================================================
              CENTER IMAGE
          ===================================================== */}

          <View style={styles.centerSection}>
            <ImageBackground
              source={require("@/assets/images/AboutTempleSeva1.webp")}
              style={styles.centerImage}
              imageStyle={[
                styles.centerImageStyle,
                {
                  borderRadius: theme.radii.control,
                },
              ]}
              resizeMode="cover"
            />
          </View>

          {/* =====================================================
              VISION
          ===================================================== */}

          <View style={styles.sideSection}>
            <View
              style={[
                styles.ribbon,
                {
                  backgroundColor: colors.accent,
                },
              ]}
            >
              <Text
                style={[
                  styles.ribbonText,
                  {
                    color: colors.onAccent,
                  },
                ]}
              >
                {t("aboutTempleSeva.ourVision")}
              </Text>
            </View>

            <View style={styles.contentBoxCenter}>
              <Text
                style={[
                  styles.visionText,
                  {
                    color: colors.textPrimary,
                  },
                ]}
              >
                {t("aboutTempleSeva.visionText")}
              </Text>

              <Text style={styles.lotus}>🌸</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

/* ============================================================
   FEATURE
============================================================ */

function Feature({
  text,
  sub,
}: {
  text: string;
  sub: string;
}) {
  const { theme } = useTheme();
  const colors = theme.colors;

  return (
    <View style={styles.featureRow}>
      <Text
        style={[
          styles.dot,
          {
            color: colors.accent,
          },
        ]}
      >
        •
      </Text>

      <View style={styles.featureContent}>
        <Text
          style={[
            styles.featureTitle,
            {
              color: colors.textPrimary,
            },
          ]}
        >
          {text}
        </Text>

        <Text
          style={[
            styles.featureDesc,
            {
              color: colors.textSecondary,
            },
          ]}
        >
          {sub}
        </Text>
      </View>
    </View>
  );
}

/* ============================================================
   OFFER CARD
============================================================ */

function OfferCard({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  const { theme } = useTheme();
  const colors = theme.colors;

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          borderRadius: theme.radii.control,
        },
      ]}
    >
      <View
        style={[
          styles.iconCircle,
          {
            borderColor: colors.accent,
            backgroundColor: colors.accentMuted,
          },
        ]}
      >
        {icon}
      </View>

      <Text
        style={[
          styles.cardTitle,
          {
            color: colors.accent,
          },
        ]}
        numberOfLines={2}
      >
        {title}
      </Text>

      <Text
        numberOfLines={4}
        style={[
          styles.cardDesc,
          {
            color: colors.textSecondary,
          },
        ]}
      >
        {desc}
      </Text>
    </View>
  );
}

/* ============================================================
   STYLES
============================================================ */

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  /* ==========================================================
     HEADER
  ========================================================== */

  header: {
    width: "100%",
    height: 92,
    borderBottomWidth: 1,
  },

  headerContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  headerTitle: {
    flex: 1,
    marginLeft: 14,
    fontSize: 18,
    fontFamily: "Roboto_700Bold",
  },

  /* ==========================================================
     HERO
  ========================================================== */

  heroImage: {
    width: "100%",
    height: 220,
  },

  /* ==========================================================
     SCROLL
  ========================================================== */

  scrollContent: {
    paddingHorizontal: 16,
  },

  /* ==========================================================
     INTRO
  ========================================================== */

  introCard: {
    paddingHorizontal: 16,
    paddingVertical: 18,
    borderRadius: 12,
    marginTop: 16,
    borderWidth: 1,
    alignItems: "center",
  },

  introHeading: {
    fontFamily: "Roboto_700Bold",
    fontSize: 13,
    lineHeight: 18,
    textAlign: "center",
  },

  introText: {
    marginTop: 7,
    textAlign: "center",
    fontSize: 12,
    lineHeight: 18,
  },

  /* ==========================================================
     SECTION
  ========================================================== */

  sectionTitle: {
    textAlign: "center",
    marginTop: 22,
    fontSize: 12,
    lineHeight: 18,
    fontFamily: "Roboto_700Bold",
  },

  /* ==========================================================
     GRID
  ========================================================== */

  grid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
    gap: 6,
  },

  card: {
    flex: 1,
    paddingHorizontal: 7,
    paddingVertical: 10,
    alignItems: "center",
    borderWidth: 1,
    minHeight: 132,
  },

  iconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  cardTitle: {
    fontSize: 9,
    lineHeight: 12,
    marginTop: 6,
    textAlign: "center",
    fontFamily: "Roboto_700Bold",
  },

  cardDesc: {
    flex: 1,
    fontSize: 9,
    lineHeight: 13,
    textAlign: "center",
    marginTop: 4,
  },

  /* ==========================================================
     WHY + VISION
  ========================================================== */

  whyVisionWrapper: {
    flexDirection: "row",
    marginTop: 32,
    borderRadius: 18,
    borderWidth: 1,
    overflow: "hidden",
    minHeight: 250,
  },

  sideSection: {
    flex: 1,
    minWidth: 0,
    paddingTop: 48,
    paddingBottom: 14,
    paddingHorizontal: 10,
    justifyContent: "flex-start",
  },

  centerSection: {
    flex: 1,
    minWidth: 0,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 5,
    paddingVertical: 20,
  },

  centerImage: {
    width: "100%",
    height: 160,
  },

  centerImageStyle: {
    width: "100%",
    height: "100%",
  },

  /* ==========================================================
     RIBBON
  ========================================================== */

  ribbon: {
    position: "absolute",
    top: 14,
    left: 8,
    right: 8,
    minHeight: 32,
    paddingHorizontal: 5,
    paddingVertical: 6,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },

  ribbonText: {
    fontSize: 8,
    lineHeight: 11,
    textAlign: "center",
    fontFamily: "Roboto_700Bold",
  },

  /* ==========================================================
     CONTENT
  ========================================================== */

  contentBox: {
    width: "100%",
  },

  contentBoxCenter: {
    width: "100%",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 2,
  },

  /* ==========================================================
     FEATURES
  ========================================================== */

  featureRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 11,
  },

  dot: {
    width: 10,
    marginRight: 5,
    fontSize: 13,
    lineHeight: 14,
    textAlign: "center",
  },

  featureContent: {
    flex: 1,
    minWidth: 0,
  },

  featureTitle: {
    fontSize: 9,
    lineHeight: 12,
    fontFamily: "Roboto_700Bold",
  },

  featureDesc: {
    marginTop: 1,
    fontSize: 8.5,
    lineHeight: 12,
  },

  /* ==========================================================
     VISION
  ========================================================== */

  visionText: {
    fontSize: 9.5,
    lineHeight: 14,
    textAlign: "center",
  },

  lotus: {
    fontSize: 16,
    marginTop: 10,
  },
});