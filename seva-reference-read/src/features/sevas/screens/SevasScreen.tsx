import { useTheme } from "@/src/framework/theme";
import { useTempleStore } from "@/src/shared/temple/templeStore";

import SelectTempleState from "../components/SelectTempleState";
import SevaContent from "../components/SevaContent";

type SevasScreenProps = {
  onSelectTemple: () => void;
};

export default function SevasScreen({ onSelectTemple }: SevasScreenProps) {
  const { theme } = useTheme();

  const selectedTemple = useTempleStore((state) => state.selected);

  if (!selectedTemple) {
    return <SelectTempleState onSelectTemple={onSelectTemple} />;
  }

  return <SevaContent />;
}
