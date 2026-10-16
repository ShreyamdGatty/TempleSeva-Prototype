import { useDebouncedValue } from "@/src/framework/hooks/useDebouncedValue";
import { useTheme } from "@/src/framework/theme";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useShrineList } from "../hooks/useShrineList";
import { useTemples } from "../hooks/useTemples";
import { DigiorgSearchItem } from "../types/digiorg.types";
import TempleListCard from "./TempleListCard";

import { Divider, Skeleton, Text } from "@/src/framework/components";
import { Ionicons } from "@expo/vector-icons";

import {
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
// import CategoryChip from "./CategoryChip";

// const SEARCH_HINTS = [
//   "Shiva",
//   "Parvathi",
//   "Ganesha",
//   "Hanuman",
//   "Krishna",
//   "Rama",
//   "Murugan",
//   "Lakshmi",
//   "Durga",
//   "Ayyappa",
// ];

interface TempleSearchContentProps {
  visible: boolean;
  onClose: () => void;
  selectedTemple: string;
  onSelectTemple: (temple: DigiorgSearchItem) => void;
}

export default function TempleSearchContent({
  visible,
  onClose,
  selectedTemple,
  onSelectTemple,
}: TempleSearchContentProps) {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const colors = theme.colors;
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchText, setSearchText] = useState("");
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const debouncedSearch = useDebouncedValue(searchText, 400);

  //---------------------------------------------
  // Shrine list (cached via React Query)
  //---------------------------------------------
  const { data: shrines = [] } = useShrineList();
  const categories = ["All", ...shrines];

  //---------------------------------------------
  // Reset search/category when the modal opens
  //---------------------------------------------
  useEffect(() => {
    if (!visible) return;

    const timer = setTimeout(() => {
      setSearchText("");
      setSelectedCategory("All");
    }, 180);

    return () => clearTimeout(timer);
  }, [visible]);

  //---------------------------------------------
  // Temple Query
  //---------------------------------------------
  const {
    data: temples = [],
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useTemples(debouncedSearch, selectedCategory, visible);

  //---------------------------------------------
  // Placeholder rotation + autofocus
  //---------------------------------------------
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (!visible) return;

    const timer = setInterval(() => {
      // setPlaceholderIndex((prev) => (prev + 1) % SEARCH_HINTS.length);
    }, 1000);

    return () => clearInterval(timer);
  }, [visible]);

  useEffect(() => {
    if (!visible) return;

    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 300);

    return () => clearTimeout(timer);
  }, [visible]);

  //---------------------------------------------
  // Render Temple Card
  //---------------------------------------------
  const renderTempleCard = ({ item }: any) => (
    <TempleListCard
      templeImg={item.templeImg}
      templeName={item.orgName}
      shrine={item.shrine}
      add1={item.add1}
      add2={item.add2}
      add3={item.add3}
      post={item.post}
      isActive={selectedTemple === item.orgName}
      onSelect={() => {
        onClose();

        setTimeout(() => {
          onSelectTemple(item);
        }, 220);
      }}
    />
  );

  return (
    <View
      style={[
        styles.modalCard,
        {
          backgroundColor: colors.page,
        },
      ]}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.leftSection}>
          <View
            style={[
              styles.locationIconBox,
              {
                backgroundColor: colors.accentMuted,
              },
            ]}
          >
            <Ionicons name="location" size={22} color={colors.accent} />
          </View>

          <View style={styles.textSection}>
            <Text style={styles.title}>{t("templeSearch.selectShrine")}</Text>

            <Text
              style={styles.subtitle}
              numberOfLines={1}
              ellipsizeMode="clip"
            >
              {t("templeSearch.chooseTemple")}
            </Text>
          </View>
        </View>

        <View style={styles.rightSection}>
          {/* <View style={styles.locationBadge}>
            <Ionicons name="location" size={13} color="#B7791F" />

            <Text style={styles.locationText}>Mangaluru</Text>
          </View> */}

          <TouchableOpacity
            style={[
              styles.closeButton,
              {
                backgroundColor: colors.accentMuted,
              },
            ]}
            onPress={onClose}
          >
            <Ionicons name="close" size={23} color={colors.accent} />
          </TouchableOpacity>
        </View>
      </View>

      <Divider />

      {/* Search */}
      {/* <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#6B7280" />

        <TextInput
          style={styles.searchInput}
          placeholder={`Try "${SEARCH_HINTS[placeholderIndex]}"`}
          placeholderTextColor="#8A8A8A"
          value={searchText}
          onChangeText={setSearchText}
          ref={inputRef}
          returnKeyType="search"
        />
      </View> */}

      {/* Categories */}
      {/* <View style={styles.categoryWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryContainer}
        >
          {categories.map((category) => (
            <CategoryChip
              key={category}
              title={category}
              selected={selectedCategory === category}
              onPress={() => setSelectedCategory(category)}
            />
          ))}
        </ScrollView>
      </View> */}

      {/* Temple List */}
      <View style={styles.listContainer}>
        {isLoading ? (
          <View style={{ paddingHorizontal: 18 }}>
            <Skeleton width="100%" height={180} />
            <Skeleton width="100%" height={180} style={{ marginTop: 16 }} />
            <Skeleton width="100%" height={180} style={{ marginTop: 16 }} />
          </View>
        ) : (
          <FlatList
            style={styles.flatList}
            data={temples}
            renderItem={renderTempleCard}
            keyExtractor={(item, index) => `${item.id}_${index}`}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            nestedScrollEnabled
            onEndReached={() => {
              if (hasNextPage && !isFetchingNextPage) {
                fetchNextPage();
              }
            }}
            onEndReachedThreshold={0.5}
            ListFooterComponent={
              isFetchingNextPage ? (
                <View style={{ paddingHorizontal: 18, paddingVertical: 12 }}>
                  <Skeleton width="100%" height={120} />
                </View>
              ) : null
            }
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  modalCard: {
    flex: 1,
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 22,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingTop: 20,
    paddingBottom: 8,
  },
  leftSection: {
    flexDirection: "row",
    flex: 1,
    marginRight: 4,
  },
  locationIconBox: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  textSection: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontFamily: "Roboto_700Bold",
    color: "#26352A",
  },
  subtitle: {
    fontSize: 9,
    color: "#777",
    marginTop: 4,
  },
  rightSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF4DD",
    borderRadius: 16,
    paddingHorizontal: 8,
    paddingVertical: 7,
    marginRight: 6,
  },
  locationText: {
    color: "#B7791F",
    fontSize: 8,
    marginLeft: 3,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F3F4F3",
    justifyContent: "center",
    alignItems: "center",
  },
  searchContainer: {
    height: 52,
    marginHorizontal: 18,
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F9F8",
    borderWidth: 1,
    borderColor: "#D9DEDA",
    borderRadius: 14,
    paddingHorizontal: 15,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: "#26352A",
    marginLeft: 10,
  },
  categoryWrapper: {
    height: 42,
    marginTop: 12,
  },
  categoryContainer: {
    paddingHorizontal: 18,
    alignItems: "center",
  },
  listContainer: {
    flex: 1,
    minHeight: 0,
  },
  flatList: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 18,
    paddingTop: 6,
    paddingBottom: 18,
  },
});
