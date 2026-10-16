import { http } from "@/src/framework/network";
import { useEffect } from "react";
import { useTempleStore } from "./templeStore";

/**
 * Wires the http client's tenant headers to the selected temple.
 * App-level: connects framework (http) to app state (templeStore).
 */
export function useTenantSync() {
  useEffect(() => {
    http.setTenantGetter(() => {
      const temple = useTempleStore.getState().selected;
      if (!temple) return null;
      return {
        tenantid: temple.id,
        digiorgid: temple.id,
        sdid: temple.sdId,
      };
    });
  }, []);
}