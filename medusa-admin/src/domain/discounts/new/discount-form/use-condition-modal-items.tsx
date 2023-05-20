import { useContext, useMemo } from "react"
import { LayeredModalContext } from "../../../../components/molecules/modal/layered-modal"
import { DiscountConditionType } from "../../types"
import AddCollectionConditionSelector from "./condition-tables/add-condition-tables/collections"
import AddCustomerGroupConditionSelector from "./condition-tables/add-condition-tables/customer-groups"
import AddProductConditionSelector from "./condition-tables/add-condition-tables/products"
import AddTagConditionSelector from "./condition-tables/add-condition-tables/tags"
import AddTypeConditionSelector from "./condition-tables/add-condition-tables/types"
import DetailsCollectionConditionSelector from "./condition-tables/details-condition-tables/collections"
import DetailsCustomerGroupConditionSelector from "./condition-tables/details-condition-tables/customer-groups"
import DetailsProductConditionSelector from "./condition-tables/details-condition-tables/products"
import DetailsTagConditionSelector from "./condition-tables/details-condition-tables/tags"
import DetailsTypeConditionSelector from "./condition-tables/details-condition-tables/types"

export type ConditionItem = {
  label: string
  value: DiscountConditionType
  description: string
  onClick: () => void
}

type UseConditionModalItemsProps = {
  onClose: () => void
  isDetails?: boolean
}

const useConditionModalItems = ({
  isDetails,
  onClose,
}: UseConditionModalItemsProps) => {
  const layeredModalContext = useContext(LayeredModalContext)

  const items: ConditionItem[] = useMemo(
    () => [
      {
        label: "Toode",
        value: DiscountConditionType.PRODUCTS,
        description: "Ainult konkreetsete toodete jaoks",
        onClick: () =>
          layeredModalContext.push({
            title: "Valige tooted",
            onBack: () => layeredModalContext.pop(),
            view: isDetails ? (
              <DetailsProductConditionSelector onClose={onClose} />
            ) : (
              <AddProductConditionSelector onClose={onClose} />
            ),
          }),
      },
      {
        label: "Kliendirühm",
        value: DiscountConditionType.CUSTOMER_GROUPS,
        description: "Ainult konkreetsetele kliendirühmadele",
        onClick: () => {
          layeredModalContext.push({
            title: "Vali rühmad",
            onBack: () => layeredModalContext.pop(),
            view: isDetails ? (
              <DetailsCustomerGroupConditionSelector onClose={onClose} />
            ) : (
              <AddCustomerGroupConditionSelector onClose={onClose} />
            ),
          })
        },
      },
      {
        label: "Silt",
        value: DiscountConditionType.PRODUCT_TAGS,
        description: "Ainult konkreetsete siltide jaoks",
        onClick: () =>
          layeredModalContext.push({
            title: "Vali silt",
            onBack: () => layeredModalContext.pop(),
            view: isDetails ? (
              <DetailsTagConditionSelector onClose={onClose} />
            ) : (
              <AddTagConditionSelector onClose={onClose} />
            ),
          }),
      },
      {
        label: "Kollektsioon",
        value: DiscountConditionType.PRODUCT_COLLECTIONS,
        description: "Ainult konkreetsete tootekollektsioonide jaoks",
        onClick: () =>
          layeredModalContext.push({
            title: "Valige kollektsioonid",
            onBack: () => layeredModalContext.pop(),
            view: isDetails ? (
              <DetailsCollectionConditionSelector onClose={onClose} />
            ) : (
              <AddCollectionConditionSelector onClose={onClose} />
            ),
          }),
      },
      {
        label: "Tüüp",
        value: DiscountConditionType.PRODUCT_TYPES,
        description: "Ainult teatud tootetüüpide jaoks",
        onClick: () =>
          layeredModalContext.push({
            title: "Valige tüübid",
            onBack: () => layeredModalContext.pop(),
            view: isDetails ? (
              <DetailsTypeConditionSelector onClose={onClose} />
            ) : (
              <AddTypeConditionSelector onClose={onClose} />
            ),
          }),
      },
    ],
    [isDetails]
  )

  return items
}

export default useConditionModalItems
