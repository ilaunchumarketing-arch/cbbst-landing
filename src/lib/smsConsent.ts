/**
 * Single source of truth for the CBBST SMS (A2P 10DLC) consent language.
 *
 * The carrier registration and every consent record we store must reference the
 * EXACT disclosure the visitor saw. If the wording below ever changes, bump
 * SMS_CONSENT_DISCLOSURE_VERSION in the same commit — old records keep pointing
 * at the version they actually agreed to.
 */
export const SMS_CONSENT_DISCLOSURE_VERSION = "2026-08-22-v1";

export const SMS_CONSENT_DISCLOSURE =
  "By checking this box, I agree to receive recurring automated promotional and " +
  "personalized marketing text messages from Comic Book Buy Sell Trade (CBBST) at " +
  "the number provided. Consent is not a condition of purchase. Message frequency " +
  "varies. Msg & data rates may apply. Reply STOP to opt out and HELP for help.";

/** Form/page identifiers recorded as consent evidence. */
export const SMS_CONSENT_SOURCES = {
  contact: "cbbst.com /contact — Send a Message form",
} as const;

export type SmsConsentSource = keyof typeof SMS_CONSENT_SOURCES;
