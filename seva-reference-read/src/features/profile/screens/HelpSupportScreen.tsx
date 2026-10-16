import { Text } from "@/src/framework/components";
import { useTheme } from "@/src/framework/theme";
import { router } from "expo-router";
import {
  ArrowLeft,
  CalendarDays,
  ChevronDown,
  ChevronRight,
  Compass,
  CreditCard,
  UserRound,
  X
} from "lucide-react-native";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ImageBackground,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { HelpModal } from "./HelpModal";

const topics = [
  {
    icon: Compass,
    helpKey: "navigation" as const,
  },
  {
    icon: UserRound,
    helpKey: "account" as const,
  },
  {
    icon: CalendarDays,
    helpKey: "booking" as const,
  },
  {
    icon: CreditCard,
    helpKey: "payments" as const,
  },
];

const faqs = [
  {
    key: "bookSeva",
  },
  {
    key: "cancelBooking",
  },
  {
    key: "paymentFailed",
  },
] as const;

export default function HelpSupportScreen() {
 const { t } = useTranslation();
  const { theme } = useTheme();
  const { colors } = theme;
  const insets = useSafeAreaInsets();

  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // Controls which help topic modal is open
  const [activeHelp, setActiveHelp] = useState<
    keyof typeof HelpModal | null
  >(null);

  const selectedHelp = activeHelp ? HelpModal[activeHelp] : null;

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.page },
      ]}
    >
      {/* Header */}
      <View
        style={[
          styles.header,
          {
            paddingTop: insets.top,
            backgroundColor: colors.page,
            borderBottomColor: colors.border,
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
              pressed && styles.pressed,
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
              { color: colors.textPrimary },
            ]}
          >
            {t("helpSupport.title")}
          </Text>
        </View>
      </View>

      {/* Main Content */}
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 30 },
        ]}
      >
        {/* Hero */}
        <ImageBackground
          source={require("@/assets/images/help-support.webp")}
          style={styles.heroBanner}
          imageStyle={styles.heroImage}
        />

        {/* Help Topics */}
        <Text
          style={[
            styles.sectionTitle,
            { color: colors.textPrimary },
          ]}
        >
            {t("helpSupport.exploreTopics")}
        </Text>

        <View style={styles.grid}>
          {topics.map(
            ({  icon: Icon, helpKey }) => (
              <Pressable
                key={helpKey}
                onPress={() => {
                  if (helpKey) {
                    setActiveHelp(helpKey);
                  }
                }}
                style={({ pressed }) => [
                  styles.card,
                  {
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                  },
                  pressed && styles.pressed,
                ]}
              >
                <View
                  style={[
                    styles.cardIcon,
                    {
                      backgroundColor:
                        colors.accentMuted,
                    },
                  ]}
                >
                  <Icon
                    size={25}
                    color={colors.accent}
                    strokeWidth={2.2}
                  />
                </View>

                <Text
                  style={[
                    styles.cardTitle,
                    { color: colors.textPrimary },
                  ]}
                >
                  {t(`helpSupport.topics.${helpKey}.title`)}
                  
                </Text>

                <Text
                  style={[
                    styles.cardDesc,
                    { color: colors.textSecondary },
                  ]}
                >
                  {t(`helpSupport.topics.${helpKey}.description`)}
                </Text>

                <View style={styles.cardArrow}>
                  <ChevronRight
                    size={18}
                    color={colors.textMuted}
                    strokeWidth={2.2}
                  />
                </View>
              </Pressable>
            ),
          )}
        </View>

        {/* FAQs */}
        <Text
          style={[
            styles.sectionTitle,
            { color: colors.textPrimary },
          ]}
        >
          Frequently Asked Questions
        </Text>

        <View
          style={[
            styles.faqBox,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          {faqs.map((item, index) => {
            const isOpen = activeIndex === index;

            return (
              <Pressable
                key={item.key}
                onPress={() =>
                  setActiveIndex(
                    isOpen ? null : index,
                  )
                }
                style={[
                  styles.faqItem,
                  {
                    borderBottomColor: colors.border,
                  },
                  index === faqs.length - 1 &&
                    styles.lastFaqItem,
                ]}
              >
                <View style={styles.faqHeader}>
                  <Text
                    style={[
                      styles.faqQ,
                      { color: colors.textPrimary },
                    ]}
                  >
                    {t(`helpSupport.faqs.${item.key}.question`)}

                  </Text>

                  <View
                    style={[
                      styles.faqIcon,
                      {
                        backgroundColor: isOpen
                          ? colors.accentMuted
                          : "transparent",
                      },
                    ]}
                  >
                    <ChevronDown
                      size={18}
                      color={
                        isOpen
                          ? colors.accent
                          : colors.textSecondary
                      }
                      strokeWidth={2.3}
                      style={{
                        transform: [
                          {
                            rotate: isOpen
                              ? "180deg"
                              : "0deg",
                          },
                        ],
                      }}
                    />
                  </View>
                </View>

                {isOpen && (
                  <Text
                    style={[
                      styles.faqA,
                      { color: colors.textSecondary },
                    ]}
                  >
                    {t(`helpSupport.faqs.${item.key}.answer`)}
                  </Text>
                )}
              </Pressable>
            );
          })}
        </View>

        {/* Contact Support */}
        {/* <Text
          style={[
            styles.sectionTitle,
            { color: colors.textPrimary },
          ]}
        >
          {t("helpSupport.contactTitle")}
        </Text> */}

        <View
          style={[
            styles.contactBox,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          {/* <ContactRow
            icon={Mail}
              title={t("helpSupport.contact.email.title")}
             subtitle={t("helpSupport.contact.email.value")}
            colors={colors}
          /> */}

          {/* <ContactRow
            icon={Phone}
             title={t("helpSupport.contact.phone.title")}
              subtitle={t("helpSupport.contact.phone.value")}
            colors={colors}
          /> */}

          {/* <ContactRow
            icon={Clock}
            title={t("helpSupport.contact.hours.title")}
            subtitle={t("helpSupport.contact.hours.value")}
            colors={colors}
            isLast
          /> */}
        </View>

        {/* Feedback */}
        {/* <Pressable
          style={({ pressed }) => [
            styles.feedbackBtn,
            { backgroundColor: colors.accent },
            pressed && styles.pressed,
          ]}
        >
          <Text
            style={[
              styles.feedbackTitle,
              { color: colors.page },
            ]}
          >
            {t("helpSupport.feedback.title")}
          </Text>

          <Text
            style={[
              styles.feedbackSub,
              { color: colors.page },
            ]}
          >
            {t("helpSupport.feedback.description")}
          </Text>
        </Pressable> */}

        {/* Footer */}
        <View style={styles.footer}>
          <View
            style={[
              styles.footerDivider,
              { backgroundColor: colors.accent },
            ]}
          />

          <Text
            style={[
              styles.footerBrand,
              { color: colors.accent },
            ]}
          >
             {t("helpSupport.footer.brand")}
          </Text>

          <Text
            style={[
              styles.footerTagline,
              { color: colors.textSecondary },
            ]}
          >
            {t("helpSupport.footer.tagline")}
          </Text>

          <Text
            style={[
              styles.footerText,
              { color: colors.textMuted },
            ]}
          >
              {t("helpSupport.footer.description")}

          </Text>

          <Text
            style={[
              styles.omSymbol,
              { color: colors.accent },
            ]}
          >
            ॐ
          </Text>
        </View>
      </ScrollView>

      {/* Help Topic Modal */}
      <Modal
        visible={activeHelp !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setActiveHelp(null)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.bookingModal,
              { backgroundColor: colors.card },
            ]}
          >
            {selectedHelp && (
              <>
                {/* Modal Header */}
                <View style={styles.modalHeader}>
                  <View style={styles.modalTitleContainer}>
                    <View
                      style={[
                        styles.modalIcon,
                        {
                          backgroundColor:
                            colors.accentMuted,
                        },
                      ]}
                    >
                      {activeHelp === "booking" ? (
                        <CalendarDays
                          size={22}
                          color={colors.accent}
                          strokeWidth={2.2}
                        />
                      ) : activeHelp === "account" ? (
                        <UserRound
                          size={22}
                          color={colors.accent}
                          strokeWidth={2.2}
                        />
                      ) : activeHelp === "navigation" ? (
                        <Compass
                          size={22}
                          color={colors.accent}
                          strokeWidth={2.2}
                        />
                      ) : (
                        <CreditCard
                          size={22}
                          color={colors.accent}
                          strokeWidth={2.2}
                        />
                      )}
                    </View>

                    <View style={styles.modalTitleText}>
                      <Text
                        style={[
                          styles.modalTitle,
                          { color: colors.textPrimary },
                        ]}
                      >
                        {t(selectedHelp.titleKey)}
                      </Text>

                      <Text
                        style={[
                          styles.modalSubtitle,
                          {
                            color:
                              colors.textSecondary,
                          },
                        ]}
                      >
                        {t(selectedHelp.subtitleKey)}
                      </Text>
                    </View>
                  </View>

                  <Pressable
                    onPress={() => setActiveHelp(null)}
                    style={({ pressed }) => [
                      styles.closeButton,
                      {
                        backgroundColor:
                          colors.accentMuted,
                      },
                      pressed && styles.pressed,
                    ]}
                  >
                    <X
                      size={19}
                      color={colors.accent}
                      strokeWidth={2.3}
                    />
                  </Pressable>
                </View>

                {/* Steps */}
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={
                    styles.modalContent
                  }
                >
                  {selectedHelp.steps.map(
                    (step, index) => (
                      <View
                        key={step.titleKey}
                        style={styles.stepRow}
                      >
                        <View
                          style={[
                            styles.stepNumber,
                            {
                              backgroundColor:
                                colors.accent,
                            },
                          ]}
                        >
                          <Text
                            style={[
                              styles.stepNumberText,
                              {
                                color:
                                  colors.page,
                              },
                            ]}
                          >
                            {index + 1}
                          </Text>
                        </View>

                        <View
                          style={styles.stepContent}
                        >
                          <Text
                            style={[
                              styles.stepTitle,
                              {
                                color:
                                  colors.textPrimary,
                              },
                            ]}
                          >
                            {t(step.titleKey)}
                          </Text>

                          <Text
                            style={[
                              styles.stepDescription,
                              {
                                color:
                                  colors.textSecondary,
                              },
                            ]}
                          >
                            {t(step.descriptionKey)}
                          </Text>
                        </View>
                      </View>
                    ),
                  )}

                  {/* Note */}
                  <View
                    style={[
                      styles.modalNote,
                      {
                        backgroundColor:
                          colors.accentMuted,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.modalNoteTitle,
                        { color: colors.accent },
                      ]}
                    >
                      {t(selectedHelp.note.titleKey)}
                    </Text>

                    <Text
                      style={[
                        styles.modalNoteText,
                        {
                          color:
                            colors.textSecondary,
                        },
                      ]}
                    >
                      {t(selectedHelp.note.descriptionKey)}
                    </Text>
                  </View>
                </ScrollView>

                {/* Done Button */}
                <Pressable
                  onPress={() => setActiveHelp(null)}
                  style={({ pressed }) => [
                    styles.modalDoneButton,
                    {
                      backgroundColor:
                        colors.accent,
                    },
                    pressed && styles.pressed,
                  ]}
                >
                  <Text
                    style={[
                      styles.modalDoneText,
                      { color: colors.page },
                    ]}
                  >
                      {t("helpSupport.gotIt")}
                  </Text>
                </Pressable>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

function ContactRow({
  icon: Icon,
  title,
  subtitle,
  colors,
  isLast = false,
}: any) {
  return (
    <View
      style={[
        styles.contactRow,
        !isLast && {
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        },
      ]}
    >
      <View
        style={[
          styles.contactIcon,
          {
            backgroundColor: colors.accentMuted,
          },
        ]}
      >
        <Icon
          size={21}
          color={colors.accent}
          strokeWidth={2.2}
        />
      </View>

      <View style={styles.contactText}>
        <Text
          style={[
            styles.contactTitle,
            { color: colors.textPrimary },
          ]}
        >
          {title}
        </Text>

        <Text
          style={[
            styles.contactSub,
            { color: colors.textSecondary },
          ]}
        >
          {subtitle}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

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

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    paddingTop: 0,
  },

  heroBanner: {
    height: 170,
    margin: 16,
    borderRadius: 18,
    overflow: "hidden",
  },

  heroImage: {
    borderRadius: 18,
  },

  sectionTitle: {
    fontSize: 16,
    fontFamily: "Roboto_700Bold",
    marginHorizontal: 16,
    marginTop: 10,
    marginBottom: 10,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },

  card: {
    width: "48%",
    minHeight: 140,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    marginBottom: 12,
  },

  cardIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
  },

  cardTitle: {
    fontSize: 14,
    fontFamily: "Roboto_700Bold",
    marginTop: 9,
  },

  cardDesc: {
    fontSize: 12,
    lineHeight: 17,
    marginTop: 4,
    paddingRight: 4,
  },

  cardArrow: {
    position: "absolute",
    right: 10,
    bottom: 10,
  },

  faqBox: {
    marginHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 14,
  },

  faqItem: {
    paddingVertical: 14,
    borderBottomWidth: 0.7,
  },

  lastFaqItem: {
    borderBottomWidth: 0,
  },

  faqHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  faqQ: {
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
    paddingRight: 10,
  },

  faqIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },

  faqA: {
    fontSize: 13,
    lineHeight: 20,
    marginTop: 9,
    paddingRight: 8,
  },

  contactBox: {
    marginHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
  },

  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 14,
  },

  contactIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },

  contactText: {
    marginLeft: 12,
    flex: 1,
  },

  contactTitle: {
    fontSize: 14,
  },

  contactSub: {
    fontSize: 12,
    lineHeight: 18,
    marginTop: 2,
  },

  feedbackBtn: {
    marginHorizontal: 16,
    marginTop: 18,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 15,
  },

  feedbackTitle: {
    fontSize: 15,
    fontWeight: "800",
  },

  feedbackSub: {
    fontSize: 12,
    marginTop: 4,
    opacity: 0.9,
  },

  footer: {
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 25,
    paddingBottom: 15,
  },

  footerDivider: {
    width: 80,
    height: 1.5,
    marginBottom: 12,
  },

  footerBrand: {
    fontSize: 12,
  },

  footerTagline: {
    marginTop: 2,
    fontSize: 9,
    letterSpacing: 0.3,
  },

  footerText: {
    marginTop: 9,
    fontSize: 12,
    textAlign: "center",
    lineHeight: 18,
  },

  omSymbol: {
    marginTop: 14,
    fontSize: 28,
    fontFamily: "Roboto_700Bold",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.45)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },

  bookingModal: {
    width: "100%",
    maxWidth: 420,
    maxHeight: "78%",
    borderRadius: 22,
    overflow: "hidden",
  },

  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 14,
  },

  modalTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  modalIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },

  modalTitleText: {
    flex: 1,
    marginLeft: 12,
  },

  modalTitle: {
    fontSize: 17,
    fontFamily: "Roboto_700Bold",
  },

  modalSubtitle: {
    fontSize: 11,
    marginTop: 3,
    fontFamily: "Roboto_500Medium",
  },

  closeButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
  },

  modalContent: {
    paddingHorizontal: 18,
    paddingBottom: 10,
  },

  stepRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 20,
  },

  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },

  stepNumberText: {
    fontSize: 12,
  },

  stepContent: {
    flex: 1,
    marginLeft: 12,
    paddingTop: 1,
  },

  stepTitle: {
    fontSize: 14,
  },

  stepDescription: {
    fontSize: 12,
    lineHeight: 18,
    marginTop: 4,
  },

  modalNote: {
    borderRadius: 14,
    padding: 13,
    marginTop: 2,
    marginBottom: 8,
  },

  modalNoteTitle: {
    fontSize: 12,
  },

  modalNoteText: {
    fontSize: 11,
    lineHeight: 17,
    marginTop: 4,
  },

  modalDoneButton: {
    marginHorizontal: 18,
    marginBottom: 18,
    borderRadius: 13,
    paddingVertical: 13,
    alignItems: "center",
    justifyContent: "center",
  },

  modalDoneText: {
    fontSize: 14,
    fontFamily: "Roboto_700Bold",
  },

  pressed: {
    opacity: 0.75,
  },
});

