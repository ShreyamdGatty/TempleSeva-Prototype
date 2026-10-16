import {
  CalendarCheck,
  CheckCircle2,
  Compass,
  Flower2,
  Landmark,
  MapPin,
  Search,
  ShieldCheck,
  TicketCheck,
} from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { Card, Text } from "@/src/framework/components";

import { useTheme } from "@/src/framework/theme";

export default function BeforeTempleSection() {
  const { t } = useTranslation();
  const { theme } = useTheme();

  const benefits = [
    {
      icon: MapPin,
      title: t("beforeTempleSelection.findTemple"),
      description: t("beforeTempleSelection.findTempleDescription"),
    },

    {
      icon: Search,
      title: t("beforeTempleSelection.exploreSevas"),
      description: t("beforeTempleSelection.exploreSevasDescription"),
    },

    {
      icon: ShieldCheck,
      title:  t("beforeTempleSelection.simpleSecure"),
       description: t("beforeTempleSelection.simpleSecureDescription"),
    },

    {
      icon: TicketCheck,
      title: t("beforeTempleSelection.easyBooking"),
      description: t("beforeTempleSelection.easyBookingDescription"),
    },
  ];

  const steps = [
    {
      number: "1",
      icon: Landmark,
      title: t("beforeTempleSelection.select"),
      subtitle:  t("beforeTempleSelection.temple"),
      description:  t("beforeTempleSelection.selectDescription"),
      iconBackground: "#F1EAF8",
      iconColor: "#7651A8",
      numberBackground: "#7651A8",
    },

    {
      number: "2",
      icon: Flower2,
      title: t("beforeTempleSelection.explore"),
      subtitle: t("beforeTempleSelection.sevas"),
      description: t("beforeTempleSelection.exploreDescription"),
      iconBackground: "#FFF2DA",
      iconColor: "#D88932",
      numberBackground: "#D88932",
    },

    {
      number: "3",
      icon: CalendarCheck,
      title: t("beforeTempleSelection.book"),
      subtitle: t("beforeTempleSelection.seva"),
      description: t("beforeTempleSelection.bookDescription"),
      iconBackground: "#EDF5E9",
      iconColor: "#4E8A50",
      numberBackground: "#4E8A50",
    },
  ];

  return (
    <View style={styles.container}>
      {/* ================================================= */}
      {/* INTRODUCTION */}
      {/* ================================================= */}

      <Card
        style={[
          styles.introCard,
          {
            backgroundColor: theme.colors.card,
            borderColor: theme.colors.border,
          },
        ]}
      >
        {/* Decorative icon */}

        <View
          style={[
            styles.introIcon,
            {
              backgroundColor: theme.colors.accentMuted,
            },
          ]}
        >
          <Compass size={34} color={theme.colors.accent} />
        </View>

        <View style={styles.introContent}>
          <View style={styles.introTitleRow}>
            <Text variant="title" style={styles.introTitle}>
               {t("beforeTempleSelection.introTitle")}
            </Text>
          </View>

          <Text
            variant="body"
            style={[
              styles.introDescription,
              {
                color: theme.colors.textSecondary,
              },
            ]}
          >
               {t("beforeTempleSelection.introDescription")}
            
          </Text>
        </View>
      </Card>

      {/* ================================================= */}
      {/* WHAT YOU CAN DO */}
      {/* ================================================= */}

      <View style={styles.sectionHeader}>
        <View
          style={[
            styles.sectionLine,
            {
              backgroundColor: theme.colors.accent,
            },
          ]}
        />

        <Text variant="title" style={styles.sectionTitle}>
           {t("beforeTempleSelection.everythingInOnePlace")}
          
        </Text>

        <View
          style={[
            styles.sectionLine,
            {
              backgroundColor: theme.colors.accent,
            },
          ]}
        />
      </View>

      <View style={styles.benefitsGrid}>
        {benefits.map((item) => {
          const Icon = item.icon;

          return (
            <View
              key={item.title}
              style={[
                styles.benefitCard,
                {
                  backgroundColor: theme.colors.card,

                  borderColor: theme.colors.border,
                },
              ]}
            >
              <View
                style={[
                  styles.benefitIcon,
                  {
                    backgroundColor: theme.colors.accentMuted,
                  },
                ]}
              >
                <Icon size={21} color={theme.colors.accent} />
              </View>

              <View style={styles.benefitContent}>
                <Text
                  variant="label"
                  style={styles.benefitTitle}
                  numberOfLines={1}
                >
                  {item.title}
                </Text>

                <Text
                  variant="body"
                  style={[
                    styles.benefitDescription,
                    {
                      color: theme.colors.textSecondary,
                    },
                  ]}
                  numberOfLines={2}
                >
                  {item.description}
                </Text>
              </View>
            </View>
          );
        })}
      </View>

      {/* ================================================= */}
      {/* HOW TEMPLESEVA WORKS */}
      {/* ================================================= */}

      <View style={styles.worksHeader}>
        <View
          style={[
            styles.sectionLine,
            {
              backgroundColor: theme.colors.accent,
            },
          ]}
        />

        <Text variant="title" style={styles.sectionTitle}>
           {t("beforeTempleSelection.howTempleSevaWorks")}
        </Text>

        <View
          style={[
            styles.sectionLine,
            {
              backgroundColor: theme.colors.accent,
            },
          ]}
        />
      </View>

      {/* Steps */}

      <View style={styles.stepsContainer}>
        {steps.map((step, index) => {
          const Icon = step.icon;

          return (
            <View key={step.number} style={styles.stepWrapper}>
              {/* Step */}

              <View style={styles.step}>
                {/* Number */}

                <View
                  style={[
                    styles.number,
                    {
                      backgroundColor: step.numberBackground,
                    },
                  ]}
                >
                  <Text style={styles.numberText}>{step.number}</Text>
                </View>

                {/* Icon */}

                <View
                  style={[
                    styles.stepIcon,
                    {
                      backgroundColor: step.iconBackground,
                    },
                  ]}
                >
                  <Icon size={28} color={step.iconColor} />
                </View>

                {/* Title */}

                <Text variant="label" style={styles.stepTitle}>
                  {step.title}
                </Text>

                <Text variant="label" style={styles.stepSubtitle}>
                  {step.subtitle}
                </Text>

                {/* Explanation */}

                <Text
                  variant="body"
                  style={[
                    styles.stepDescription,
                    {
                      color: theme.colors.textSecondary,
                    },
                  ]}
                >
                  {step.description}
                </Text>
              </View>

              {/* Connector */}

              {index < steps.length - 1 && (
                <View
                  style={[
                    styles.connector,
                    {
                      borderColor: theme.colors.border,
                    },
                  ]}
                />
              )}
            </View>
          );
        })}
      </View>

      {/* ================================================= */}
      {/* START PROMPT */}
      {/* ================================================= */}

      <View
        style={[
          styles.startPrompt,
          {
            backgroundColor: theme.colors.accentMuted,
            borderColor: theme.colors.border,
          },
        ]}
      >
        <View style={styles.startIcon}>
          <CheckCircle2 size={20} color={theme.colors.accent} />
        </View>

        <View style={styles.startContent}>
          <Text variant="label" style={styles.startTitle}>
             {t("beforeTempleSelection.readyToBegin")}
           
          </Text>

          <Text
            variant="body"
            style={[
              styles.startDescription,
              {
                color: theme.colors.textSecondary,
              },
            ]}
          >
            {t("beforeTempleSelection.readyToBeginDescription")}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingBottom: 20,
    marginBottom: 80,
  },

  // =====================================================
  // Introduction
  // =====================================================

  introCard: {
    marginTop: 22,

    borderRadius: 16,

    borderWidth: 1,

    padding: 16,

    flexDirection: "row",

    alignItems: "center",

    minHeight: 125,

    elevation: 0,

    shadowOpacity: 0,
  },

  introIcon: {
    width: 68,

    height: 68,

    borderRadius: 34,

    justifyContent: "center",

    alignItems: "center",

    marginRight: 14,
  },

  introContent: {
    flex: 1,

    minWidth: 0,
  },

  introTitleRow: {
    marginBottom: 7,
  },

  introTitle: {
    fontSize: 14,

    lineHeight: 15,
    

   
  },

  introDescription: {
    fontSize: 12,

    lineHeight: 18,
  },

  // =====================================================
  // Section header
  // =====================================================

  sectionHeader: {
    marginTop: 22,

    marginBottom: 14,

    flexDirection: "row",

    alignItems: "center",
  },

  sectionLine: {
    flex: 1,

    height: 1,

    opacity: 0.45,
  },

  sectionTitle: {
    fontSize: 14,

    lineHeight: 19,

    fontFamily: "Roboto_700Bold",

    marginHorizontal: 10,

    textAlign: "center",
  },

  // =====================================================
  // Benefits
  // =====================================================

  benefitsGrid: {
    flexDirection: "row",

    flexWrap: "wrap",

    justifyContent: "space-between",

    rowGap: 10,
  },

  benefitCard: {
    width: "48.5%",

    minHeight: 92,

    borderRadius: 14,

    borderWidth: 1,

    padding: 12,

    flexDirection: "row",

    alignItems: "center",
  },

  benefitIcon: {
    width: 40,

    height: 40,

    borderRadius: 12,

    justifyContent: "center",

    alignItems: "center",

    marginRight: 9,
  },

  benefitContent: {
    flex: 1,

    minWidth: 0,
  },

  benefitTitle: {
    fontSize: 10,

    lineHeight: 15,

    fontFamily: "Roboto_500Medium",

    marginBottom: 3,
  },

  benefitDescription: {
    fontSize: 9,

    lineHeight: 13,
  },

  // =====================================================
  // How it works
  // =====================================================

  worksHeader: {
    marginTop: 24,

    marginBottom: 15,

    flexDirection: "row",

    alignItems: "center",
  },

  // =====================================================
  // Steps
  // =====================================================

  stepsContainer: {
    flexDirection: "row",

    alignItems: "flex-start",

    paddingHorizontal: 2,
  },

  stepWrapper: {
    flex: 1,

    flexDirection: "row",

    alignItems: "flex-start",
  },

  step: {
    flex: 1,

    alignItems: "center",

    position: "relative",

    minWidth: 0,
  },

  number: {
    position: "absolute",

    top: -4,

    left: "50%",

    marginLeft: -31,

    width: 18,

    height: 18,

    borderRadius: 9,

    justifyContent: "center",

    alignItems: "center",

    zIndex: 2,
  },

  numberText: {
    color: "#FFFFFF",

    fontSize: 10,

    lineHeight: 11,

   fontFamily: "Roboto_700Bold",
  },

  stepIcon: {
    width: 56,

    height: 56,

    borderRadius: 28,

    justifyContent: "center",

    alignItems: "center",

    marginBottom: 7,
  },

  stepTitle: {
    fontSize: 10,

    lineHeight: 13,

    textAlign: "center",

    fontFamily: "Roboto_700Bold",
  },

  stepSubtitle: {
    fontSize: 10,

    lineHeight: 13,

    textAlign: "center",

    fontFamily: "Roboto_700Bold",
  },

  stepDescription: {
    fontSize: 9,

    lineHeight: 13,

    textAlign: "center",

    marginTop: 5,

    paddingHorizontal: 3,
  },

  connector: {
    width: 22,

    borderTopWidth: 1,

    borderStyle: "dashed",

    marginTop: 27,
  },

  // =====================================================
  // Start prompt
  // =====================================================

  startPrompt: {
    marginTop: 22,

    borderRadius: 14,

    borderWidth: 1,

    padding: 13,

    flexDirection: "row",

    alignItems: "center",
  },

  startIcon: {
    width: 36,

    height: 36,

    borderRadius: 18,

    justifyContent: "center",

    alignItems: "center",

    marginRight: 10,
  },

  startContent: {
    flex: 1,

    minWidth: 0,
  },

  startTitle: {
    fontSize: 12,

    lineHeight: 16,

    fontFamily: "Roboto_700Bold",

    marginBottom: 2,
  },

  startDescription: {
    fontSize: 10,

    lineHeight: 14,
  },
});
