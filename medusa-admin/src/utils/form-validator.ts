import { ValidationRule } from "react-hook-form"
import { normalizeAmount } from "./prices"

/**
 * Utility functions for validating form inputs.
 */
const FormValidator = {
  whiteSpaceRule: (name: string) =>
    ({
      value: /^[^\s]+(?:$|.*[^\s]+$)/,
      message: `${name} ei tohi sisaldada ees- ega lõpus tühikuid ega olla tühi string.`,
    } as ValidationRule<RegExp>),
  nonNegativeNumberRule: (name: string) => ({
    value: 0,
    message: `${name} ei saa olla negatiivne.`,
  }),
  minOneCharRule: (name: string) => ({
    value: 1,
    message: `${name} peab olema vähemalt 1 tähemärk.`,
  }),
  min: (name: string, min: number) => ({
    value: min,
    message: `${name} peab olema suurem või võrdne ${min}.`,
  }),
  max: (name: string, max: number) => ({
    value: max,
    message: `${name} peab olema väiksem või võrdne ${max}.`,
  }),
  required: (name: string) => ({
    value: true,
    message: `${name} on nõutud.`,
  }),
  minLength: (name: string, min: number) => ({
    value: min,
    message: `${name} peab olema vähemalt ${min} tähemärki.`,
  }),
  maxInteger: (name: string, currency?: string) => {
    return {
      value: MAX_INTEGER,
      message: `${name} peab olema väiksem või võrdne ${getNormalizedAmount(
        currency
      )}.`,
    }
  },
  validateMaxInteger: (name: string, amount: number, currency?: string) => {
    return (
      amount <= MAX_INTEGER ||
      `${name} peab olema väiksem või võrdne ${getNormalizedAmount(currency)}.`
    )
  },
  email: (name: string) => ({
    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
    message: `${name} peab olema kehtiv e-posti aadress.`,
  }),
}

/**
 * The maximum integer value that can be stored in the database.
 */
const MAX_INTEGER = 2147483647

/**
 * Gets the normalized amount for the given currency, and if not provided then returns the MAX_INTEGER.
 */
const getNormalizedAmount = (currency?: string) => {
  const amount = currency ? normalizeAmount(currency, MAX_INTEGER) : MAX_INTEGER

  return amount.toLocaleString()
}

export default FormValidator
