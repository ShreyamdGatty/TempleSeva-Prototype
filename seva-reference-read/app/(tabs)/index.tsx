import HomeContent from "@/src/features/home/HomeContent";
import { ProtectedRoute } from "@/src/framework/auth";

const Home = () => {
  return (
    <ProtectedRoute>
      <HomeContent />
    </ProtectedRoute>
  );
};

export default Home;
