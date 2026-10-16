import { Text } from "@/src/framework/components";
import { useTheme } from "@/src/framework/theme";
import { router } from "expo-router";
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Cookie,
  FileText,
  Info,
  Share2,
  ShieldCheck
} from "lucide-react-native";
import { ReactNode, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type SectionProps = {
  title: string;
  icon: ReactNode;
  children: ReactNode;
  colors: ReturnType<typeof useTheme>["theme"]["colors"];
};

function AccordionSection({
  title,
  icon,
  children,
  colors,
}: SectionProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <View
      style={[
        styles.section,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
        },
      ]}
    >
      <Pressable
        onPress={() => setExpanded((value) => !value)}
        style={({ pressed }) => [
          styles.sectionHeader,
          pressed && { opacity: 0.7 },
        ]}
      >
        <View
          style={[
            styles.titleIcon,
            { backgroundColor: colors.accentMuted },
          ]}
        >
          {icon}
        </View>

        <Text
          style={[
            styles.sectionTitle,
            { color: colors.textPrimary },
          ]}
        >
          {title}
        </Text>

        {expanded ? (
          <ChevronUp
            size={22}
            color={colors.accent}
            strokeWidth={2.4}
          />
        ) : (
          <ChevronDown
            size={22}
            color={colors.accent}
            strokeWidth={2.4}
          />
        )}
      </Pressable>

      {expanded && (
        <View
          style={[
            styles.expandedContent,
            { borderTopColor: colors.border },
          ]}
        >
          {children}
        </View>
      )}
    </View>
  );
}

export default function PrivacyPolicyScreen() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const colors = theme.colors;

  const icon = (Icon: any) => (
    <Icon
      size={21}
      color={colors.accent}
      strokeWidth={2.2}
    />
  );

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.page },
      ]}
    >
      {/* HEADER */}
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
              pressed && { opacity: 0.7 },
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
            <Text>{t("privacyPolicy.title")}</Text>
          </Text>

          <View style={styles.brandContainer}>
            <View style={styles.brandRow}>
              <ShieldCheck
                size={17}
                color={colors.accent}
                strokeWidth={2.2}
              />

              <Text
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.8}
                style={[
                  styles.brandTitle,
                  { color: colors.accent },
                ]}
              >
                Temple Seva
              </Text>
            </View>

            {/* <Text
              style={[
                styles.brandTagline,
                { color: colors.textSecondary },
              ]}
            >
              <Text>{t("privacyPolicy.brandTagline")}</Text>
            </Text> */}
          </View>
        </View>
      </View>

      {/* CONTENT */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingBottom: insets.bottom + 25,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* INTRO */}
        <View style={styles.heroSection}>
          <Text
            style={[
              styles.heroTitle,
              { color: colors.textPrimary },
            ]}
          >
            <Text>{t("privacyPolicy.heroTitle")}</Text>
          </Text>

          <View style={styles.heroDivider}>
            <View
              style={[
                styles.dividerLine,
                { backgroundColor: colors.accent },
              ]}
            />

            <Text
              style={[
                styles.dividerSymbol,
                { color: colors.accent },
              ]}
            >
              ✿
            </Text>

            <View
              style={[
                styles.dividerLine,
                { backgroundColor: colors.accent },
              ]}
            />
          </View>

          <Text
            style={[
              styles.heroDescription,
              { color: colors.textSecondary },
            ]}
          >
            <Text>{t("privacyPolicy.heroDescription")}</Text>
          </Text>
        </View>

        {/* INFORMATION WE COLLECT */}
        <AccordionSection
         title={t("privacyPolicy.informationWeCollect")}
          icon={icon(Info)}
          colors={colors}
        >
          <Text
            style={[
              styles.sectionText,
              { color: colors.textSecondary },
            ]}
          >
            <Text>{t("privacyPolicy.informationWeCollectText")}</Text>
          </Text>

          <Text
            style={[
              styles.subTitle,
              { color: colors.textPrimary },
            ]}
          >
            <Text>{t("privacyPolicy.personalInformation")}</Text>
          </Text>

          <Text
            style={[
              styles.sectionText,
              { color: colors.textSecondary },
            ]}
          >
            <Text>{t("privacyPolicy.personalInformationText")}</Text>
          </Text>

          <Text
            style={[
              styles.subTitle,
              { color: colors.textPrimary },
            ]}
          >
            <Text>{t("privacyPolicy.bookingAndSevaInformation")}</Text>
          </Text>

          <Text
            style={[
              styles.sectionText,
              { color: colors.textSecondary },
            ]}
          >
            <Text>{t("privacyPolicy.bookingAndSevaInformationText")}</Text>
          </Text>

          <Text
            style={[
              styles.subTitle,
              { color: colors.textPrimary },
            ]}
          >
            <Text>{t("privacyPolicy.deviceAndUsageInformation")}</Text>
          </Text>

          <Text
            style={[
              styles.sectionText,
              { color: colors.textSecondary },
            ]}
          >
            <Text>{t("privacyPolicy.deviceAndUsageInformationText")}</Text>
          </Text>
        </AccordionSection>

        {/* HOW WE USE */}
        <AccordionSection
          title={t("privacyPolicy.howWeUse")}
          icon={icon(FileText)}
          colors={colors}
        >
          <Text
            style={[
              styles.sectionText,
              { color: colors.textSecondary },
            ]}
          >
            <Text>{t("privacyPolicy.howWeUseIntro")}</Text>
          </Text>

          {(t("privacyPolicy.howWeUseItems", {
               returnObjects: true,
           }) as string[]).map((item, index) => (
            <View
              style={styles.bulletContainer}
              key={index} 
            >
              <Text
                style={[
                  styles.bullet,
                  { color: colors.accent },
                ]}
              >
                •
              </Text>

              <Text
                style={[
                  styles.bulletText,
                  { color: colors.textSecondary },
                ]}
              >
                {item}
              </Text>
            </View>
          ))}
        </AccordionSection>

        {/* INFORMATION SHARING */}
        <AccordionSection
        title={t("privacyPolicy.informationSharing")}
          icon={icon(Share2)}
          colors={colors}
        >
          <Text
            style={[
              styles.sectionText,
              { color: colors.textSecondary },
            ]}
          >
            <Text>{t("privacyPolicy.informationSharingText1")}</Text>
          </Text>

          <Text
            style={[
              styles.sectionText,
              { color: colors.textSecondary },
            ]}
          >
            <Text>{t("privacyPolicy.informationSharingText2")}</Text>
          </Text>
        </AccordionSection>

        {/* DATA SECURITY */}
        <AccordionSection
          title={t("privacyPolicy.dataSecurity")}
          icon={icon(ShieldCheck)}
          colors={colors}
        >
          <Text
            style={[
              styles.sectionText,
              { color: colors.textSecondary },
            ]}
          >
            <Text>{t("privacyPolicy.dataSecurityText1")}</Text>
          </Text>

          <Text
            style={[
              styles.sectionText,
              { color: colors.textSecondary },
            ]}
          >
            <Text>{t("privacyPolicy.dataSecurityText2")}</Text>
          </Text>
        </AccordionSection>

        {/* DATA RETENTION */}
        {/* <AccordionSection
          title={t("privacyPolicy.dataRetention")}
          icon={icon(KeyRound)}
          colors={colors}
        >
          <Text
            style={[
              styles.sectionText,
              { color: colors.textSecondary },
            ]}
          >
            <Text>{t("privacyPolicy.dataRetentionText")}</Text>
          </Text>
        </AccordionSection> */}

        {/* YOUR RIGHTS */}
        {/* <AccordionSection
          title={t("privacyPolicy.yourRights")}
          icon={icon(Users)}
          colors={colors}
        >
          <Text
            style={[
              styles.sectionText,
              { color: colors.textSecondary },
            ]}
          >
            <Text>{t("privacyPolicy.yourRightsText1")}</Text>
          </Text>

          <Text
            style={[
              styles.sectionText,
              { color: colors.textSecondary },
            ]}
          >
            <Text>{t("privacyPolicy.yourRightsText2")}</Text>
          </Text>
        </AccordionSection> */}

        {/* CHILDREN'S PRIVACY */}
        {/* <AccordionSection
         title={t("privacyPolicy.childrenPrivacy")}
          icon={icon(Users)}
          colors={colors}
        >
          <Text
            style={[
              styles.sectionText,
              { color: colors.textSecondary },
            ]}
          >
            <Text>{t("privacyPolicy.childrenPrivacyText")}</Text>
          </Text>
        </AccordionSection> */}

        {/* THIRD PARTY */}
        <AccordionSection
         title={t("privacyPolicy.thirdPartyServices")}
          icon={icon(Share2)}
          colors={colors}
        >
          <Text
            style={[
              styles.sectionText,
              { color: colors.textSecondary },
            ]}
          >
            <Text>{t("privacyPolicy.thirdPartyServicesText1")}</Text>
          </Text>

          <Text
            style={[
              styles.sectionText,
              { color: colors.textSecondary },
            ]}
          >
            <Text>{t("privacyPolicy.thirdPartyServicesText2")}</Text>
          </Text>
        </AccordionSection>

        {/* COOKIES */}
        <AccordionSection
            title={t("privacyPolicy.cookies")}
          icon={icon(Cookie)}
          colors={colors}
        >
          <Text
            style={[
              styles.sectionText,
              { color: colors.textSecondary },
            ]}
          >
            <Text>{t("privacyPolicy.cookiesText")}</Text>
          </Text>
        </AccordionSection>

        {/* POLICY CHANGES */}
        <AccordionSection
          title={t("privacyPolicy.policyChanges")}
          icon={icon(FileText)}
          colors={colors}
        >
          <Text 
            style={[
              styles.sectionText,
              { color: colors.textSecondary },
            ]}
          >
            <Text>{t("privacyPolicy.policyChangesText1")}</Text>
          </Text>

          <Text
            style={[
              styles.sectionText,
              { color: colors.textSecondary },
            ]}
          >
            <Text>{t("privacyPolicy.policyChangesText2")}</Text>
          </Text>
        </AccordionSection>

        {/* CONTACT US */}
        {/* <AccordionSection
          title={t("privacyPolicy.contactUs")}
          icon={icon(Mail)}
          colors={colors}
        >
          <Text
            style={[
              styles.sectionText,
              { color: colors.textSecondary },
            ]}
          >
            <Text>{t("privacyPolicy.contactUsText1")}</Text>
            
          </Text>

          <Text
            style={[
              styles.sectionText,
              { color: colors.textSecondary },
            ]}
          >
            <Text>{t("privacyPolicy.contactUsText2")}</Text>
          
          </Text>
        </AccordionSection> */}

        {/* FOOTER */}
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
            Temple Seva
          </Text>

          <Text
            style={[
              styles.footerTagline,
              { color: colors.textSecondary },
            ]}
          >
            <Text>{t("privacyPolicy.brandTagline")}</Text>
            
          </Text>

          {/* <Text
            style={[
              styles.footerText,
              { color: colors.textMuted },
            ]}
          >
            <Text>{t("privacyPolicy.footerText")}</Text>
          </Text> */}

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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  /* HEADER */
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

  brandContainer: {
    width: 120,
    alignItems: "flex-end",
    justifyContent: "center",
  },

  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },

  brandTitle: {
    fontSize: 8,
    lineHeight: 20,
    includeFontPadding: false,
  },

  brandTagline: {
  marginTop: 1,
  fontSize: 3,
  letterSpacing: 0.1,
  includeFontPadding: false,
},

  /* CONTENT */
  scrollView: {
    flex: 1,
  },

  scrollContent: {
    paddingTop: 0,
  },

  /* HERO */
  heroSection: {
    alignItems: "center",
    paddingHorizontal: 28,
    paddingTop: 8,
    paddingBottom: 24,
  },

  heroTitle: {
    fontSize: 18,
    fontFamily: "Roboto_700Bold",
    lineHeight: 27,
    textAlign: "center",
  },

  heroDivider: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
    marginBottom: 12,
  },

  dividerLine: {
    width: 65,
    height: 1.5,
  },

  dividerSymbol: {
    fontSize: 18,
    marginHorizontal: 10,
    lineHeight: 21,
  },

  heroDescription: {
    width: "100%",
    maxWidth: 360,
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
  },

  /* ACCORDION */
  section: {
    marginHorizontal: 20,
    marginBottom: 14,
    padding: 17,
    borderRadius: 16,
    borderWidth: 1,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 34,
  },

  titleIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },

  sectionTitle: {
    flex: 1,
    fontSize: 16,
   
    lineHeight: 23,
  },

  expandedContent: {
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: 1,
  },

  subTitle: {
    fontSize: 14,
    lineHeight: 21,
    marginTop: 8,
    marginBottom: 5,
  },

  sectionText: {
    fontSize: 13,
    lineHeight: 21,
    marginBottom: 9,
  },

  /* BULLETS */
  bulletContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
  },

  bullet: {
    width: 18,
    fontSize: 16,
    lineHeight: 21,
    
  },

  bulletText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 21,
  },

  /* FOOTER */
  footer: {
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 8,
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
  },

  /* OM */
  omSymbol: {
    marginTop: 14,
    fontSize: 28,
    fontFamily: "Roboto_700Bold",
  },
});