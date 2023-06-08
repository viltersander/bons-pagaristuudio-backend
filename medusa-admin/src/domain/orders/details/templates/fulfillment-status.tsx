import StatusDot from "../../../../components/fundamentals/status-indicator"

export const FulfillmentStatusComponent = ({ status }) => {
  switch (status) {
    case "shipped":
      return <StatusDot title="Saadetud" variant="success" />
    case "fulfilled":
      return <StatusDot title="Täidetud" variant="warning" />
    case "canceled":
      return <StatusDot title="Tühistatud" variant="danger" />
    case "partially_fulfilled":
      return <StatusDot title="Osaliselt täidetud" variant="warning" />
    case "requires_action":
      return <StatusDot title="Nõuab tegevust" variant="danger" />
    case "not_fulfilled":
      return <StatusDot title="Täitmise ootel" variant="danger" />
    case "partially_shipped":
      return <StatusDot title="Osaliselt tarnitud" variant="warning" />
    default:
      return null
  }
}
