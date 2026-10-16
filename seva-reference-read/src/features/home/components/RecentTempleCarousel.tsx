import { useRef } from "react";
import { Animated, StyleSheet, useWindowDimensions } from "react-native";

import { DigiorgSearchItem } from "@/src/shared/temple-search";

import RecentTempleCard from "./RecentTempleCard";

const SIDE_PADDING = 16;
const CARD_GAP = 8;

type Props = {
  history: DigiorgSearchItem[];
  onSelectTemple?: (item: DigiorgSearchItem) => void;
};

export default function RecentTempleCarousel({
  history,
  onSelectTemple,
}: Props) {
  const { width } = useWindowDimensions();

  // Three cards visible on screen.
  const CARD_WIDTH = (width - SIDE_PADDING * 2 - CARD_GAP * 2) / 3;

  const scrollX = useRef(new Animated.Value(0)).current;

  const ITEM_SIZE = CARD_WIDTH + CARD_GAP;

  return (
    <Animated.FlatList
      horizontal
      data={history}
      keyExtractor={(item) => item.id}
      showsHorizontalScrollIndicator={false}
      snapToInterval={ITEM_SIZE}
      decelerationRate="fast"
      bounces={false}
      contentContainerStyle={styles.content}
      onScroll={Animated.event(
        [
          {
            nativeEvent: {
              contentOffset: {
                x: scrollX,
              },
            },
          },
        ],
        {
          useNativeDriver: true,
        },
      )}
      scrollEventThrottle={16}
      renderItem={({ item, index }) => {
        
        const inputRange = [
          (index - 1) * ITEM_SIZE,
          index * ITEM_SIZE,
          (index + 1) * ITEM_SIZE,
        ];

        const scale = scrollX.interpolate({
          inputRange,
          outputRange: [0.96, 1, 0.96],
          extrapolate: "clamp",
        });

        return (
          <Animated.View
            style={{
              width: CARD_WIDTH,

              marginRight: CARD_GAP,

              transform: [
                {
                  scale,
                },
              ],
            }}
          >
            <RecentTempleCard
              templeName={item.orgName}
              templeImg={item.templeImg}
              shrine={item.shrine}
              onPress={() => onSelectTemple?.(item)}
            />
          </Animated.View>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: SIDE_PADDING,
  },
});
