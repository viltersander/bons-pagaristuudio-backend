import { Option } from "../types/shared"

export default function (provider: string): Option {
  switch (provider) {
    case "primecargo":
      return {
        label: "Peamine last",
        value: "primecargo",
      }
    case "manual":
      return {
        label: "Manuaalne",
        value: "manual",
      }
    case "webshipper":
      return {
        label: "Veebisaatja",
        value: "webshipper",
      }
    default:
      return {
        label: provider,
        value: provider,
      }
  }
}
