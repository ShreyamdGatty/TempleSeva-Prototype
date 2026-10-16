import {
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";

import { DigiorgSearchItem } from "../types/digiorg.types";
import TempleSearchContent from "./TempleSearchContent";

interface TempleSearchModalProps {
  visible: boolean;
  onClose: () => void;
  selectedTemple: string;
  onSelectTemple: (temple: DigiorgSearchItem) => void;
}

export default function TempleSearchModal({
  visible,
  onClose,
  selectedTemple,
  onSelectTemple,
}: TempleSearchModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.overlayTouchable} />
        </TouchableWithoutFeedback>

        <TempleSearchContent
          selectedTemple={selectedTemple}
          onSelectTemple={onSelectTemple}
          onClose={onClose}
          visible={visible}
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
  },

  overlayTouchable: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
});
