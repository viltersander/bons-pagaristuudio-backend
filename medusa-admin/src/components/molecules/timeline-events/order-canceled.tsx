import React from "react"
import { TimelineEvent } from "../../../hooks/use-build-timeline"
import CancelIcon from "../../fundamentals/icons/cancel-icon"
import EventContainer, { EventIconColor } from "./event-container"

type OrderCanceledProps = {
  event: TimelineEvent
}

const OrderCanceled: React.FC<OrderCanceledProps> = ({ event }) => {
  const args = {
    icon: <CancelIcon size={20} />,
    iconColor: EventIconColor.RED,
    time: event.time,
    title: "Tellimus tühistatud",
  }
  return <EventContainer {...args} />
}

export default OrderCanceled
