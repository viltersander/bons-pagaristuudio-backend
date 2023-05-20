import { Discount } from "@medusajs/medusa"
import {
  useAdminDiscount,
  useAdminDiscountRemoveCondition,
  useAdminGetDiscountCondition,
} from "medusa-react"
import { useState } from "react"
import EditIcon from "../../../../components/fundamentals/icons/edit-icon"
import TrashIcon from "../../../../components/fundamentals/icons/trash-icon"
import { ActionType } from "../../../../components/molecules/actionables"
import useNotification from "../../../../hooks/use-notification"
import { getErrorMessage } from "../../../../utils/error-messages"
import { DiscountConditionType } from "../../types"

export const useDiscountConditions = (discount: Discount) => {
  const [selectedCondition, setSelectedCondition] = useState<string | null>(
    null
  )

  const { refetch } = useAdminDiscount(discount.id)
  const { discount_condition } = useAdminGetDiscountCondition(
    discount.id,
    selectedCondition!,
    {
      expand:
        "product_collections,product_tags,product_types,customer_groups,products",
    },
    { enabled: !!selectedCondition, cacheTime: 0 }
  )
  const { mutate } = useAdminDiscountRemoveCondition(discount.id)

  const notification = useNotification()

  const removeCondition = (conditionId: string) => {
    mutate(conditionId, {
      onSuccess: () => {
        notification("Õnnestus", "Tingimus eemaldatud", "success")
        refetch()
      },
      onError: (error) => {
        notification("Viga", getErrorMessage(error), "error")
      },
    })
  }

  const itemized = discount.rule.conditions.map((condition) => ({
    type: condition.type,
    title: getTitle(condition.type),
    description: getDescription(condition.type),
    actions: [
      {
        label: "Muuda tingimust",
        icon: <EditIcon size={16} />,
        variant: "ghost",
        onClick: () => setSelectedCondition(condition.id),
      },
      {
        label: "Kustuta tingimus",
        icon: <TrashIcon size={16} />,
        variant: "danger",
        onClick: () => removeCondition(condition.id),
      },
    ] as ActionType[],
  }))

  function deSelectCondition() {
    setSelectedCondition(null)
  }

  return {
    conditions: itemized,
    selectedCondition: discount_condition,
    deSelectCondition,
  }
}

const getTitle = (type: DiscountConditionType) => {
  switch (type) {
    case DiscountConditionType.PRODUCTS:
      return "Toode"
    case DiscountConditionType.PRODUCT_COLLECTIONS:
      return "Kollektsioon"
    case DiscountConditionType.PRODUCT_TAGS:
      return "Silt"
    case DiscountConditionType.PRODUCT_TYPES:
      return "Tüüp"
    case DiscountConditionType.CUSTOMER_GROUPS:
      return "Kliendirühm"
  }
}

const getDescription = (type: DiscountConditionType) => {
  switch (type) {
    case DiscountConditionType.PRODUCTS:
      return "Soodustus kehtib konkreetsetele toodetele"
    case DiscountConditionType.PRODUCT_COLLECTIONS:
      return "Soodustus kehtib konkreetsetele kollektsioonidele"
    case DiscountConditionType.PRODUCT_TAGS:
      return "Soodustus kehtib konkreetsetele tootesiltidele"
    case DiscountConditionType.PRODUCT_TYPES:
      return "Soodustus kehtib kindlatele tootetüüpidele"
    case DiscountConditionType.CUSTOMER_GROUPS:
      return "Soodustus kehtib kindlatele kliendigruppidele"
  }
}
