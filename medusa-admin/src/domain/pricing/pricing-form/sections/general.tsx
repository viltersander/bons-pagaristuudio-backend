import { Controller } from "react-hook-form"
import Switch from "../../../../components/atoms/switch"
import FeatureToggle from "../../../../components/fundamentals/feature-toggle"
import InputField from "../../../../components/molecules/input"
import Accordion from "../../../../components/organisms/accordion"
import { usePriceListForm } from "../form/pricing-form-context"

const General = () => {
  const { control, register } = usePriceListForm()

  return (
    <Accordion.Item
      forceMountContent
      required
      title="Üldinfo"
      tooltip="Üldinfo hinnakirja jaoks."
      value="general"
    >
      <div className="gap-y-small group-radix-state-open:mt-5 accordion-margin-transition flex flex-col">
        <InputField
          label="Nimi"
          required
          placeholder="Must reede..."
          {...register("name", { required: "Nimi on nõutud" })}
        />
        <InputField
          label="Kirjeldus"
          required
          placeholder="Meie äripartneritele..."
          {...register("description", { required: "Kirjeldus on nõutav" })}
        />
        <FeatureToggle featureFlag="tax_inclusive_pricing">
          <div className="mt-3">
            <div className="flex justify-between">
              <h2 className="inter-base-semibold">Hinnad koos käibemaksuga</h2>
              <Controller
                control={control}
                name="includes_tax"
                render={({ field: { value, onChange } }) => {
                  return <Switch checked={!!value} onCheckedChange={onChange} />
                }}
              />
            </div>
            <p className="inter-base-regular text-grey-50">
              Valige, kas kõik selles loendis olevad hinnad sisaldavad käibemaksu.
            </p>
          </div>
        </FeatureToggle>
      </div>
    </Accordion.Item>
  )
}

export default General
