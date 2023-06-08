import { Controller } from "react-hook-form"
import { Option } from "../../../../types/shared"
import FormValidator from "../../../../utils/form-validator"
import { NestedForm } from "../../../../utils/nested-form"
import InputField from "../../../molecules/input"
import { NextSelect } from "../../../molecules/select/next-select"

export type AddressLocationFormType = {
  address_1: string
  address_2: string | null
  city: string
  province: string | null
  country_code: Option
  postal_code: string
}

type AddressLocationFormProps = {
  requireFields?: Partial<Record<keyof AddressLocationFormType, boolean>>
  countryOptions?: Option[]
  form: NestedForm<AddressLocationFormType>
}

/**
 * Re-usable form for address location information, used to create and edit addresses.
 * Fields are optional, but can be required by passing in a requireFields object.
 */
const AddressLocationForm = ({
  form,
  countryOptions,
  requireFields,
}: AddressLocationFormProps) => {
  const {
    register,
    path,
    formState: { errors },
    control,
  } = form

  return (
    <div className="gap-large grid grid-cols-2">
      <InputField
        {...register(path("address_1"), {
          required: requireFields?.address_1
            ? FormValidator.required("Aadress 1")
            : false,
          pattern: FormValidator.whiteSpaceRule("Aadress 1"),
        })}
        placeholder="Aadress 1"
        label="Aadress 1"
        required={requireFields?.address_1}
        errors={errors}
      />
      <InputField
        {...register(path("address_2"), {
          pattern: FormValidator.whiteSpaceRule("Aadress 2"),
          required: requireFields?.address_2
            ? FormValidator.required("Aadress 2")
            : false,
        })}
        placeholder="Aadress 2"
        required={requireFields?.address_2}
        label="Aadress 2"
        errors={errors}
      />
      <InputField
        {...register(path("postal_code"), {
          required: requireFields?.postal_code
            ? FormValidator.required("Postiindeks")
            : false,
          pattern: FormValidator.whiteSpaceRule("Postiindeks"),
        })}
        placeholder="Postiindeks"
        label="Postiindeks"
        required={requireFields?.postal_code}
        autoComplete="off"
        errors={errors}
      />
      <InputField
        placeholder="Linn"
        label="Linn"
        {...register(path("city"), {
          required: requireFields?.city
            ? FormValidator.required("Linn")
            : false,
          pattern: FormValidator.whiteSpaceRule("Linn"),
        })}
        required={requireFields?.city}
        errors={errors}
      />
      <InputField
        {...register(path("province"), {
          pattern: FormValidator.whiteSpaceRule("Provints"),
          required: requireFields?.province
            ? FormValidator.required("Provints")
            : false,
        })}
        placeholder="Provints"
        label="Provints"
        required={requireFields?.province}
        errors={errors}
      />
      <Controller
        control={control}
        name={path("country_code")}
        rules={{
          required: requireFields?.country_code
            ? FormValidator.required("Riik")
            : false,
        }}
        render={({ field: { value, onChange } }) => {
          return (
            <NextSelect
              label="Riik"
              required={requireFields?.country_code}
              value={value}
              options={countryOptions}
              onChange={onChange}
              name={path("country_code")}
              errors={errors}
              isClearable={!requireFields?.country_code}
            />
          )
        }}
      />
    </div>
  )
}

export default AddressLocationForm
