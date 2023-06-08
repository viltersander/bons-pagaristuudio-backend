import StatusDot from "../../../../components/fundamentals/status-indicator"

export const PaymentStatusComponent = ({ status }) => {
  switch (status) {
    case "captured":
      return <StatusDot title="Makstud" variant="success" />
    case "awaiting":
      return <StatusDot title="Makse ootamine" variant="danger" />
    case "canceled":
      return <StatusDot title="Tühistatud" variant="danger" />
    case "requires_action":
      return <StatusDot title="Nõuab tegutsemist" variant="danger" />
    default:
      return null
  }
}
