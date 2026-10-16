import MySevasScreen from "@/src/features/mySevas/screens/MySevasScreen";
import { ProtectedRoute } from "@/src/framework/auth";
import { StyleSheet } from "react-native";

const MySevas = () => {
  return (
    <ProtectedRoute>
      <MySevasScreen />
    </ProtectedRoute>
  );
};

export default MySevas;

const styles = StyleSheet.create({});
