import { ReactNode } from "react"

import { ActionType } from "../../../../components/molecules/actionables"
import ClockIcon from "../../../../components/fundamentals/icons/clock-icon"
import { Discount } from "@medusajs/medusa"
import TrashIcon from "../../../../components/fundamentals/icons/trash-icon"
import { getErrorMessage } from "../../../../utils/error-messages"
import moment from "moment"
import 'moment/locale/et';
import { parse } from "iso8601-duration"
import { removeNullish } from "../../../../utils/remove-nullish"
import { useAdminUpdateDiscount } from "medusa-react"
import useNotification from "../../../../hooks/use-notification"

type displaySetting = {
  title: string
  description: ReactNode
  actions?: ActionType[]
}

const DisplaySettingsDateDescription = ({ date }: { date: Date }) => (
  <div className="text-grey-50 inter-small-regular flex ">
    {moment.utc(date).add(3, 'hours').locale('et').format("ddd, DD MMMM YYYY")}
    <span className="ml-3 flex items-center">
      <ClockIcon size={16} />
      <span className="ml-2.5">{moment.utc(date).add(3, 'hours').format("HH:mm")}</span>
    </span>
  </div>
)

const CommonDescription = ({ text }) => (
  <span className="text-grey-50 inter-small-regular">{text}</span>
)

const useDiscountConfigurations = (discount: Discount) => {
  const updateDiscount = useAdminUpdateDiscount(discount.id)
  const notification = useNotification()

  const conditions: displaySetting[] = []

  conditions.push({
    title: "Algus kuupäev",
    description: <DisplaySettingsDateDescription date={discount.starts_at} />,
  })

  if (discount.ends_at) {
    conditions.push({
      title: "Lõppkuupäev",
      description: <DisplaySettingsDateDescription date={discount.ends_at} />,
      actions: [
        {
          label: "Kustuta konfiguratsioon",
          icon: <TrashIcon size={20} />,
          variant: "danger",
          onClick: async () =>
            await updateDiscount.mutateAsync(
              { ends_at: null },
              {
                onSuccess: () => {
                  notification(
                    "Õnnestus",
                    "Allahindluse lõppkuupäev on eemaldatud",
                    "success"
                  )
                },
                onError: (error) => {
                  notification("Viga", getErrorMessage(error), "error")
                },
              }
            ),
        },
      ],
    })
  }
  if (discount.usage_limit) {
    conditions.push({
      title: "Lunastamiste arv",
      description: (
        <CommonDescription text={discount.usage_limit.toLocaleString("en")} />
      ),
      actions: [
        {
          label: "Kustuta konfiguratsioon",
          icon: <TrashIcon size={20} />,
          variant: "danger",
          onClick: async () =>
            await updateDiscount.mutateAsync(
              { usage_limit: null },
              {
                onSuccess: () => {
                  notification("Õnnestus", "Lunastamislimiit eemaldatud", "success")
                },
                onError: (error) => {
                  notification("Viga", getErrorMessage(error), "error")
                },
              }
            ),
        },
      ],
    })
  }
  if (discount.valid_duration) {
    conditions.push({
      title: "Kestus",
      description: (
        <CommonDescription
          text={Object.entries(removeNullish(parse(discount.valid_duration)))
            .map(([key, value]) => `${value} ${key}`)
            .join(", ")}
        />
      ),
      actions: [
        {
          label: "Kustuta seaded",
          icon: <TrashIcon size={20} />,
          variant: "danger",
          onClick: async () =>
            await updateDiscount.mutateAsync(
              { valid_duration: null },
              {
                onSuccess: () => {
                  notification(
                    "Õnnestus",
                    "Allahindluse kestus on eemaldatud",
                    "success"
                  )
                },
                onError: (error) => {
                  notification("Viga", getErrorMessage(error), "error")
                },
              }
            ),
        },
      ],
    })
  }

  return conditions
}

export default useDiscountConfigurations
