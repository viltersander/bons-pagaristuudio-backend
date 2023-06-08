import StatusDot from "../../../../components/fundamentals/status-indicator"

export const OrderStatusComponent = ({ status }) => {
  switch (status) {
    case "completed":
      return <StatusDot title="Täidetud" variant="success" />
    case "pending":
      return <StatusDot title="Töötlemine" variant="default" />
    case "canceled":
      return <StatusDot title="Tühistatud" variant="danger" />
    case "requires_action":
      return <StatusDot title="Nõuab tegutsemist" variant="danger" />
    default:
      return null
  }
}
