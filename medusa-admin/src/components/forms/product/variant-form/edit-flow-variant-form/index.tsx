import { useFieldArray, UseFormReturn } from "react-hook-form"
import CustomsForm, { CustomsFormType } from "../../customs-form"
import DimensionsForm, { DimensionsFormType } from "../../dimensions-form"
import VariantGeneralForm, {
  VariantGeneralFormType,
} from "../variant-general-form"
import VariantStockForm, { VariantStockFormType } from "../variant-stock-form"

import { useFeatureFlag } from "../../../../../providers/feature-flag-provider"
import { nestedForm } from "../../../../../utils/nested-form"
import IconTooltip from "../../../../molecules/icon-tooltip"
import InputField from "../../../../molecules/input"
import Accordion from "../../../../organisms/accordion"
import MetadataForm, { MetadataFormType } from "../../../general/metadata-form"
import { PricesFormType } from "../../../general/prices-form"
import VariantPricesForm from "../variant-prices-form"

export type EditFlowVariantFormType = {
  /**
   * Used to identify the variant during product create flow. Will not be submitted to the backend.
   */
  _internal_id?: string
  general: VariantGeneralFormType
  prices: PricesFormType
  stock: VariantStockFormType
  options: {
    title: string
    value: string
    id: string
  }[]
  customs: CustomsFormType
  dimensions: DimensionsFormType
  metadata: MetadataFormType
}

type Props = {
  form: UseFormReturn<EditFlowVariantFormType, any>
  isEdit?: boolean
}

/**
 * Re-usable Product Variant form used to add and edit product variants.
 * @example
 * const MyForm = () => {
 *   const form = useForm<VariantFormType>()
 *   const { handleSubmit } = form
 *
 *   const onSubmit = handleSubmit((data) => {
 *     // do something with data
 *   })
 *
 *   return (
 *     <form onSubmit={onSubmit}>
 *       <VariantForm form={form} />
 *       <Button type="submit">Submit</Button>
 *     </form>
 *   )
 * }
 */
const EditFlowVariantForm = ({ form, isEdit }: Props) => {
  const { isFeatureEnabled } = useFeatureFlag()
  const { fields } = useFieldArray({
    control: form.control,
    name: "options",
  })

  const showStockAndInventory = !isEdit || !isFeatureEnabled("inventoryService")

  return (
    <Accordion type="multiple" defaultValue={["general"]}>
      <Accordion.Item title="Ülevaade" value="general" required>
        <div>
          <VariantGeneralForm form={nestedForm(form, "general")} />
          <div className="mt-xlarge">
            <div className="mb-base gap-x-2xsmall flex items-center">
              <h3 className="inter-base-semibold">Valikud</h3>
              <IconTooltip
                type="info"
                content="Suvandeid kasutatakse variandi värvi, suuruse jms määratlemiseks."
              />
            </div>
            <div className="gap-large pb-2xsmall grid grid-cols-2">
              {fields.map((field, index) => {
                return (
                  <InputField
                    required
                    key={field.id}
                    label={field.title}
                    {...form.register(`options.${index}.value`, {
                      required: `Suvandi väärtus ${field.title} on nõutud`,
                    })}
                    errors={form.formState.errors}
                  />
                )
              })}
            </div>
          </div>
        </div>
      </Accordion.Item>
      <Accordion.Item title="Hinnakujundus" value="pricing">
        <VariantPricesForm form={nestedForm(form, "prices")} />
      </Accordion.Item>
      {showStockAndInventory && (
        <Accordion.Item title="Varud ja laoseisud" value="stock">
          <VariantStockForm form={nestedForm(form, "stock")} />
        </Accordion.Item>
      )}
      <Accordion.Item title="Tarne" value="shipping">
        <p className="inter-base-regular text-grey-50">
          Tarneteavet võidakse nõuda sõltuvalt teie saatmisteenuse pakkujast ja sellest, kas tarnite rahvusvaheliselt või mitte.
        </p>
        <div className="mt-large">
          <h3 className="inter-base-semibold mb-2xsmall">Mõõtmed</h3>
          <p className="inter-base-regular text-grey-50 mb-large">
            Seadistage kõige täpsemate saatmishindade arvutamiseks.
          </p>
          <DimensionsForm form={nestedForm(form, "dimensions")} />
        </div>
        {showStockAndInventory && (
          <div className="mt-xlarge">
            <h3 className="inter-base-semibold mb-2xsmall">Toll</h3>
            <p className="inter-base-regular text-grey-50 mb-large">
              Seadistage, kui tarnite rahvusvaheliselt.
            </p>
            <CustomsForm form={nestedForm(form, "customs")} />
          </div>
        )}
      </Accordion.Item>
      <Accordion.Item title="Metaandmed" value="metadata">
        <p className="inter-base-regular text-grey-50 mb-base">
          Metaandmeid saab kasutada täiendava teabe salvestamiseks
          variant.
        </p>
        <MetadataForm form={nestedForm(form, "metadata")} />
      </Accordion.Item>
    </Accordion>
  )
}

export default EditFlowVariantForm
