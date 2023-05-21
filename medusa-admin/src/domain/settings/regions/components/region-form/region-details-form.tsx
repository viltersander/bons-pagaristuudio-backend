import { Controller } from "react-hook-form"
import Switch from "../../../../../components/atoms/switch"
import FeatureToggle from "../../../../../components/fundamentals/feature-toggle"
import InputField from "../../../../../components/molecules/input"
import { NextSelect } from "../../../../../components/molecules/select/next-select"
import { Option } from "../../../../../types/shared"
import FormValidator from "../../../../../utils/form-validator"
import { NestedForm } from "../../../../../utils/nested-form"
import { useStoreData } from "./use-store-data"

export type RegionDetailsFormType = {
  name: string
  countries: Option[]
  currency_code: Option
  tax_rate: number | null
  tax_code: string | null
  includes_tax?: boolean
}

type Props = {
  isCreate?: boolean
  form: NestedForm<RegionDetailsFormType>
}

const RegionDetailsForm = ({ form, isCreate = false }: Props) => {
  const {
    control,
    register,
    path,
    formState: { errors },
  } = form
  const { currencyOptions, countryOptions } = useStoreData()

  return (
    <div>
      <div className="gap-large grid grid-cols-2">
        <InputField
          label="Pealkiri"
          placeholder="Euroopa"
          required
          {...register(path("name"), {
            required: "Pealkiri on nõutud",
            minLength: FormValidator.minOneCharRule("Pealkiri"),
            pattern: FormValidator.whiteSpaceRule("Pealkiri"),
          })}
          errors={errors}
        />
        <Controller
          control={control}
          name={path("currency_code")}
          rules={{
            required: "Valuutakood on nõutav",
          }}
          render={({ field }) => {
            return (
              <NextSelect
                label="Valuuta"
                placeholder="Vali valuuta"
                required
                {...field}
                options={currencyOptions}
                name={path("currency_code")}
                errors={errors}
              />
            )
          }}
        />
        {isCreate && (
          <>
            <InputField
              label="Vaikimisi maksumäär"
              required
              placeholder="20"
              prefix="%"
              step={1}
              type={"number"}
              {...register(path("tax_rate"), {
                required: isCreate ? "Maksumäär on nõutav" : undefined,
                max: {
                  value: 100,
                  message: "Maksumäär peab olema 100 või väiksem",
                },
                min: FormValidator.nonNegativeNumberRule("Maksumäär"),
                valueAsNumber: true,
              })}
              errors={errors}
            />
            <InputField
              label="Vaikimisi maksukood"
              placeholder="1000"
              {...register(path("tax_code"))}
              errors={errors}
            />
          </>
        )}
        <Controller
          control={control}
          name={path("countries")}
          render={({ field }) => {
            return (
              <NextSelect
                label="Riigid"
                placeholder="Vali riigid"
                isMulti
                selectAll
                {...field}
                name={path("countries")}
                errors={errors}
                options={countryOptions}
              />
            )
          }}
        />
      </div>
      <FeatureToggle featureFlag="tax_inclusive_pricing">
        <div className="mt-xlarge flex items-start justify-between">
          <div className="gap-y-2xsmall flex flex-col">
            <h3 className="inter-base-semibold">Hinnad koos käibemaksuga</h3>
            <p className="inter-base-regular text-grey-50">
              Kui see on lubatud, on piirkonnahinnad koos maksudega
            </p>
          </div>
          <Controller
            control={control}
            name={path("includes_tax")}
            render={({ field: { value, onChange } }) => {
              return <Switch checked={value} onCheckedChange={onChange} />
            }}
          />
        </div>
      </FeatureToggle>
    </div>
  )
}

export default RegionDetailsForm
