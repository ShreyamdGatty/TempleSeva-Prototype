import { useRef, useState } from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import PagerView from "react-native-pager-view";
import slides from "./slides";

const { width } = Dimensions.get("window");

type Props = {
  onFinish: () => void;
};

export default function OnboardingScreen({ onFinish }: Props) {
  const pagerRef = useRef<PagerView>(null);
  const [currentPage, setCurrentPage] = useState(0);

  const nextPage = () => {
    if (currentPage === slides.length - 1) {
      onFinish();
    } else {
      pagerRef.current?.setPage(currentPage + 1);
    }
  };

  return (
    <View style={styles.container}>
      <PagerView
        ref={pagerRef}
        style={styles.pager}
        initialPage={0}
        onPageSelected={(e) => setCurrentPage(e.nativeEvent.position)}
      >
        {slides.map((item) => (
          <View key={item.id} style={styles.page}>
            <Image source={item.image} style={styles.image} />

            <Text style={styles.title}>{item.title}</Text>

            <Text style={styles.description}>{item.description}</Text>
          </View>
        ))}
      </PagerView>

      <View style={styles.footer}>
        <View style={styles.dots}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={[styles.dot, currentPage === index && styles.activeDot]}
            />
          ))}
        </View>

        <TouchableOpacity style={styles.button} onPress={nextPage}>
          <Text style={styles.buttonText}>
            {currentPage === slides.length - 1 ? "Get Started" : "Next"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  pager: {
    flex: 1,
  },

  page: {
    width,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },

  image: {
    width: 250,
    height: 250,
    resizeMode: "contain",
    marginBottom: 40,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
  },

  description: {
    fontSize: 17,
    textAlign: "center",
    color: "#666",
    marginTop: 15,
    lineHeight: 24,
  },

  footer: {
    paddingHorizontal: 30,
    paddingBottom: 40,
  },

  dots: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 25,
  },

  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#ccc",
    marginHorizontal: 5,
  },

  activeDot: {
    width: 25,
    backgroundColor: "#FF9800",
  },

  button: {
    backgroundColor: "#FF9800",
    borderRadius: 10,
    paddingVertical: 15,
  },

  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "600",
  },
});
