import { NestedForm } from "../../../../../utils/nested-form"
import PricesForm, { PricesFormType } from "../../../general/prices-form"

type Props = {
  form: NestedForm<PricesFormType>
}

const VariantPricesForm = ({ form }: Props) => {
  return (
    <div>
      <p className="inter-base-regular text-grey-50">
        Seadistage selle variandi hinnakujundus.
      </p>
      <div className="pt-large">
        <PricesForm form={form} />
      </div>
    </div>
  )
}

export default VariantPricesForm
