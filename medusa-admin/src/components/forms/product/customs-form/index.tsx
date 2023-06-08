import { Controller } from "react-hook-form"
import { Option } from "../../../../types/shared"
import { countries } from "../../../../utils/countries"
import FormValidator from "../../../../utils/form-validator"
import { NestedForm } from "../../../../utils/nested-form"
import InputField from "../../../molecules/input"
import { NextSelect } from "../../../molecules/select/next-select"

export type CustomsFormType = {
  mid_code: string | null
  hs_code: string | null
  origin_country: Option | null
}

type CustomsFormProps = {
  form: NestedForm<CustomsFormType>
}

/**
 * Re-usable nested form used to submit customs information for products and their variants.
 * @example
 * <CustomsForm form={nestedForm(form, "customs")} />
 */
const CustomsForm = ({ form }: CustomsFormProps) => {
  const {
    register,
    path,
    control,
    formState: { errors },
  } = form

  const countryOptions = countries.map((c) => ({
    label: c.name,
    value: c.alpha2,
  }))

  return (
    <div className="gap-large pb-2xsmall grid grid-cols-2">
      <InputField
        label="MID kood"
        placeholder="XDSKLAD9999..."
        {...register(path("mid_code"), {
          pattern: FormValidator.whiteSpaceRule("MID kood"),
        })}
        errors={errors}
      />
      <InputField
        label="HS kood"
        placeholder="BDJSK39277W..."
        {...register(path("hs_code"), {
          pattern: FormValidator.whiteSpaceRule("HS kood"),
        })}
        errors={errors}
      />
      <Controller
        name={path("origin_country")}
        control={control}
        render={({ field }) => {
          return (
            <NextSelect
              label="Päritoluriik"
              placeholder="Vali riik"
              options={countryOptions}
              isSearchable
              isClearable
              {...field}
            />
          )
        }}
      />
    </div>
  )
}

export default CustomsForm
