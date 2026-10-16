import { SevasScreen } from "@/src/features/sevas";
import { ProtectedRoute } from "@/src/framework/auth";
import { useTempleStore } from "@/src/shared/temple/templeStore";

export default function Sevas() {
  const openTempleSearch = useTempleStore((state) => state.openTempleSearch);

  return (
    <ProtectedRoute>
      <SevasScreen onSelectTemple={openTempleSearch} />
    </ProtectedRoute>
  );
}
