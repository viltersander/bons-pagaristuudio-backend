import { Controller } from "react-hook-form"
import { NextSelect } from "../../../../../components/molecules/select/next-select"
import { Option } from "../../../../../types/shared"
import { NestedForm } from "../../../../../utils/nested-form"
import { useStoreData } from "./use-store-data"

export type RegionProvidersFormType = {
  payment_providers: Option[]
  fulfillment_providers: Option[]
}

type Props = {
  form: NestedForm<RegionProvidersFormType>
}

const RegionProvidersForm = ({ form }: Props) => {
  const {
    control,
    path,
    formState: { errors },
  } = form
  const { fulfillmentProviderOptions, paymentProviderOptions } = useStoreData()

  return (
    <div className="gap-large grid grid-cols-2">
      <Controller
        control={control}
        name={path("payment_providers")}
        rules={{
          required: "Vaja on makseteenuse pakkujaid",
          minLength: {
            value: 1,
            message: "Vaja on makseteenuse pakkujaid",
          },
        }}
        render={({ field: { value, onBlur, onChange } }) => {
          return (
            <NextSelect
              label="Makseteenuse pakkujad"
              placeholder="Choose payment providers..."
              options={paymentProviderOptions}
              isMulti
              isClearable
              required
              selectAll
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              name={path("payment_providers")}
              errors={errors}
            />
          )
        }}
      />
      <Controller
        control={control}
        name={path("fulfillment_providers")}
        rules={{
          required: "Täitmise pakkujad on vajalikud",
          minLength: {
            value: 1,
            message: "Täitmise pakkujad on vajalikud",
          },
        }}
        render={({ field: { onBlur, onChange, value } }) => {
          return (
            <NextSelect
              label="Täitmise pakkujad"
              placeholder="Vali täitmise pakkujad..."
              options={fulfillmentProviderOptions}
              required
              isMulti
              isClearable
              selectAll
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              name={path("fulfillment_providers")}
              errors={errors}
            />
          )
        }}
      />
    </div>
  )
}

export default RegionProvidersForm
