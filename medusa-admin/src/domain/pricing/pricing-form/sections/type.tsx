import { Controller } from "react-hook-form"
import Accordion from "../../../../components/organisms/accordion"
import RadioGroup from "../../../../components/organisms/radio-group"
import { usePriceListForm } from "../form/pricing-form-context"
import { PriceListType } from "../types"

const Type = () => {
  const { control } = usePriceListForm()

  return (
    <Accordion.Item
      forceMountContent
      required
      value="type"
      title="Hinnakirja tüüp"
      description="Valige hinnakirja tüüp"
      tooltip="Erinevalt müügihindadest ei anna hinna soodustused kliendile teada, et hind on osa müügist."
    >
      <Controller
        name="type"
        control={control}
        rules={{ required: true }}
        render={({ field: { onChange, value } }) => {
          return (
            <RadioGroup.Root
              value={value ?? undefined}
              onValueChange={onChange}
              className="gap-base group-radix-state-open:mt-5 accordion-margin-transition flex items-center"
            >
              <RadioGroup.Item
                value={PriceListType.SALE}
                className="flex-1"
                label="Soodustused"
                description="Kasutage seda, kui loote müügihindadele soodustusi."
              />
              <RadioGroup.Item
                value={PriceListType.OVERRIDE}
                className="flex-1"
                label="Ülekirjutamine"
                description="Kasutage seda hindade ülekirjutamiseks."
              />
            </RadioGroup.Root>
          )
        }}
      />
    </Accordion.Item>
  )
}

export default Type
