import type { EventSubscription } from "expo-modules-core";
import { Platform } from "react-native";

import {
  addSmsListener,
  extractOtp,
  getAppSignature,
  startSmsRetriever as nativeStartSmsRetriever,
  removeSmsListener,
} from "@pushpendersingh/react-native-otp-verify";

type SmsListener = (otp: string) => void;

let removeNativeListener: EventSubscription | null = null;

let pendingOtp: string | null = null;

const listeners = new Set<SmsListener>();

// --------------------------------------------------
// GET APP SIGNATURE
// --------------------------------------------------

export async function getSmsAppHash(): Promise<string | null> {
  if (Platform.OS !== "android") {
    return null;
  }

  try {
    const signature = await getAppSignature();

   

    return signature || null;
  } catch (error) {
    console.warn("Unable to get SMS Retriever app signature", error);

    return null;
  }
}

// --------------------------------------------------
// START SMS RETRIEVER
// --------------------------------------------------

export async function startSmsRetriever(): Promise<void> {
  if (Platform.OS !== "android") {
    return;
  }

  try {
    // Remove previous listener.
    removeNativeListener?.remove();
    removeNativeListener = null;

    removeNativeListener = addSmsListener((message) => {
      if (message.status !== "success" || !message.message) {
        return;
      }

     

      const otp = extractOtp(message.message);

      if (!otp) {
        console.warn("SMS received but OTP could not be extracted");

        return;
      }

  

      pendingOtp = otp;

      listeners.forEach((listener) => {
        listener(otp);
      });
    });

    // Start Google SMS Retriever.
    await nativeStartSmsRetriever();

    
  } catch (error) {
    console.warn("Unable to start SMS Retriever", error);
  }
}

// --------------------------------------------------
// SUBSCRIBE TO OTP
// --------------------------------------------------

export function subscribeToOtp(listener: SmsListener): () => void {
  listeners.add(listener);

  if (pendingOtp) {
    const otp = pendingOtp;

    pendingOtp = null;

    listener(otp);
  }

  return () => {
    listeners.delete(listener);
  };
}

// --------------------------------------------------
// STOP SMS RETRIEVER
// --------------------------------------------------

export async function stopSmsRetriever(): Promise<void> {
  if (Platform.OS !== "android") {
    return;
  }

  try {
    // Remove JS/native event listener.
    removeNativeListener?.remove();
    removeNativeListener = null;

    // Stop SMS Retriever.
    await removeSmsListener();

  
  } catch (error) {
    console.warn("Unable to stop SMS Retriever", error);
  }
}

// --------------------------------------------------
// CLEAR PENDING OTP
// --------------------------------------------------

export function clearPendingOtp(): void {
  pendingOtp = null;
}
