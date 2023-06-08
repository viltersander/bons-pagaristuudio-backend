import React from "react"
import { RefundEvent } from "../../../hooks/use-build-timeline"
import { formatAmountWithSymbol } from "../../../utils/prices"
import RefundIcon from "../../fundamentals/icons/refund"
import EventContainer from "./event-container"

type RefundEventProps = {
  event: RefundEvent
}

const Refund: React.FC<RefundEventProps> = ({ event }) => {
  const args = {
    icon: <RefundIcon size={20} />,
    title: "Tagasimakse",
    time: event.time,
    midNode: (
      <span className="inter-small-regular text-grey-50">
        {formatAmountWithSymbol({
          amount: event.amount,
          currency: event.currencyCode,
        })}
      </span>
    ),
  }

  return <EventContainer {...args} />
}

export default Refund
