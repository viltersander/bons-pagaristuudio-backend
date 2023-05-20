import StatusIndicator from "../../fundamentals/status-indicator"

export type SimpleProductType = {
  id: string
  thumbnail?: string
  title: string
  status: string
  created_at: Date
}

export const decideStatus = (status: string) => {
  switch (status) {
    case "published":
      return <StatusIndicator title="Avaldatud" variant="success" />
    case "draft":
      return <StatusIndicator title="Mustand" variant="default" />
    case "proposed":
      return <StatusIndicator title="Pakutud" variant="warning" />
    case "rejected":
      return <StatusIndicator title="
      Tagasi lükatud" variant="danger" />
    default:
      return null
  }
}
