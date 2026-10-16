import CartBottomSheet from "@/src/features/cart/components/CartBottomSheet";
import PaymentProcessingShimmer from "@/src/features/checkout/components/PaymentProcessingShimmer";
import { useOrderSubmitting } from "@/src/features/checkout/store/orderStore";
import { PaymentStatusResponse } from "@/src/features/checkout/types/order.types";
import { useMySevasRefreshStore } from "@/src/features/mySevas/store/mySevasRefreshStore";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useMemo,
  useState,
} from "react";
import PaymentResultModal from "../../checkout/components/PaymentResultModal";
import CartSummaryButton from "../components/CartSummaryButton";
type BottomSheetContextType = {
  openCart: () => void;
  closeCart: () => void;
  setFloatingCartVisible: (visible: boolean) => void;
  showPaymentResult: (result: PaymentStatusResponse) => void;
};

const BottomSheetContext = createContext<BottomSheetContextType | undefined>(
  undefined,
);

export function BottomSheetProvider({ children }: PropsWithChildren) {
  const [cartOpen, setCartOpen] = useState(false);

  const [floatingCartVisible, setFloatingCartVisible] = useState(false);
  const [paymentResult, setPaymentResult] =
    useState<PaymentStatusResponse | null>(null);

  const [showPaymentResult, setShowPaymentResult] = useState(false);

  const openCart = () => {
    setCartOpen(true);
  };

  const closeCart = () => {
    setCartOpen(false);
  };
  const requestMySevasRefresh = useMySevasRefreshStore(
    (state) => state.requestRefresh,
  );
  const handlePaymentResult = (result: PaymentStatusResponse) => {
    requestMySevasRefresh();
    setPaymentResult(result);
    setCartOpen(false);
    setShowPaymentResult(true);
  };
  const handlePaymentPending = () => {
    requestMySevasRefresh();
    setCartOpen(false);
  };
  const value = useMemo(
    () => ({
      openCart,
      closeCart,
      setFloatingCartVisible,
      showPaymentResult: handlePaymentResult,
    }),
    [],
  );
  const paymentSubmitting = useOrderSubmitting();
  return (
    <BottomSheetContext.Provider value={value}>
      {children}

      {floatingCartVisible && !cartOpen && (
        <CartSummaryButton variant="floating" onPress={openCart} />
      )}

      <CartBottomSheet
        visible={cartOpen}
        closeCart={closeCart}
        onPaymentResult={handlePaymentResult}
        onPaymentPending={handlePaymentPending}
      />

      <PaymentResultModal
        visible={showPaymentResult}
        result={paymentResult}
        onDone={() => {
          setShowPaymentResult(false);
          setPaymentResult(null);
        }}
        onClose={() => {
          setShowPaymentResult(false);
          setPaymentResult(null);
        }}
      />
      <PaymentProcessingShimmer visible={paymentSubmitting} />
    </BottomSheetContext.Provider>
  );
}

export function useBottomSheet() {
  const context = useContext(BottomSheetContext);

  if (!context) {
    throw new Error("useBottomSheet must be used inside BottomSheetProvider");
  }

  return context;
}
