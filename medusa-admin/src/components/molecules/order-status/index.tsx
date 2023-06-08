import React from "react"
import StatusIndicator from "../../fundamentals/status-indicator"

type PaymentStatusProps = {
  paymentStatus: string
}

type FulfillmentStatusProps = {
  fulfillmentStatus: string
}

type OrderStatusProps = {
  orderStatus: string
}

type ReturnStatusProps = {
  returnStatus: string
}

type RefundStatusProps = {
  refundStatus: string
}

const PaymentStatus: React.FC<PaymentStatusProps> = ({ paymentStatus }) => {
  switch (paymentStatus) {
    case "captured":
      return <StatusIndicator title="Makstud" variant="success" />
    case "awaiting":
      return <StatusIndicator title="Ootel" variant="default" />
    case "not_paid":
      return <StatusIndicator title="Pole makstud" variant="default" />
    case "canceled":
      return <StatusIndicator title="Tühistatud" variant="danger" />
    case "requires_action":
      return <StatusIndicator title="Nõuab tegevust" variant="danger" />
    default:
      return null
  }
}

const OrderStatus: React.FC<OrderStatusProps> = ({ orderStatus }) => {
  switch (orderStatus) {
    case "completed":
      return <StatusIndicator title="Lõpetatud" variant="success" />
    case "pending":
      return <StatusIndicator title="Töötlemisel" variant="default" />
    case "canceled":
      return <StatusIndicator title="Tühistatud" variant="danger" />
    case "requires_action":
      return <StatusIndicator title="Tagasi lükatud" variant="danger" />
    default:
      return null
  }
}

const FulfillmentStatus: React.FC<FulfillmentStatusProps> = ({
  fulfillmentStatus,
}) => {
  switch (fulfillmentStatus) {
    case "shipped":
      return <StatusIndicator title="Saadetud" variant="success" />
    case "fulfilled":
      return <StatusIndicator title="Täidetud" variant="warning" />
    case "canceled":
      return <StatusIndicator title="Tühistatud" variant="danger" />
    case "partially_fulfilled":
      return <StatusIndicator title="Osaliselt täidetud" variant="warning" />
    case "not_fulfilled":
      return <StatusIndicator title="Pole täidetud" variant="default" />
    case "requires_action":
      return <StatusIndicator title="Nõuab Tegevust" variant="danger" />
    default:
      return null
  }
}

const ReturnStatus: React.FC<ReturnStatusProps> = ({ returnStatus }) => {
  switch (returnStatus) {
    case "received":
      return <StatusIndicator title="Vastu võetud" variant="success" />
    case "requested":
      return <StatusIndicator title="Taotletud" variant="default" />
    case "canceled":
      return <StatusIndicator title="Tühistatud" variant="danger" />
    case "requires_action":
      return <StatusIndicator title="Nõuab tegevust" variant="danger" />
    default:
      return null
  }
}

const RefundStatus: React.FC<RefundStatusProps> = ({ refundStatus }) => {
  switch (refundStatus) {
    case "na":
      return <StatusIndicator title="N/A" variant="default" />
    case "not_refunded":
      return <StatusIndicator title="Tagastatud" variant="default" />
    case "refunded":
      return <StatusIndicator title="Tagastatud" variant="success" />
    case "canceled":
      return <StatusIndicator title="Tühistatud" variant="danger" />
    default:
      return null
  }
}

export {
  PaymentStatus,
  OrderStatus,
  FulfillmentStatus,
  ReturnStatus,
  RefundStatus,
}
