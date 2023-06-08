import FormValidator from "../../../../utils/form-validator"
import { NestedForm } from "../../../../utils/nested-form"
import InputField from "../../../molecules/input"

export type AddressContactFormType = {
  first_name: string
  last_name: string
  company: string | null
  phone: string | null
}

type AddressContactFormProps = {
  requireFields?: Partial<Record<keyof AddressContactFormType, boolean>>
  form: NestedForm<AddressContactFormType>
}

/**
 * Re-usable form for address contact information, used to create and edit addresses.
 * Fields are optional, but can be required by passing in a requireFields object.
 */
const AddressContactForm = ({
  form,
  requireFields,
}: AddressContactFormProps) => {
  const {
    path,
    register,
    formState: { errors },
  } = form

  return (
    <div>
      <div className="gap-large grid grid-cols-2">
        <InputField
          {...register(path("first_name"), {
            required: requireFields?.first_name
              ? FormValidator.required("Eesnimi")
              : false,
            pattern: FormValidator.whiteSpaceRule("Eesnimi"),
          })}
          placeholder="Eesnimi"
          label="Eesnimi"
          required={requireFields?.first_name}
          errors={errors}
        />
        <InputField
          {...form.register(path("last_name"), {
            required: requireFields?.last_name
              ? FormValidator.required("Perekonnanimi")
              : false,
            pattern: FormValidator.whiteSpaceRule("Perekonnanimi"),
          })}
          placeholder="Perekonnanimi"
          label="Perekonnanimi"
          required={requireFields?.last_name}
          errors={errors}
        />
        <InputField
          {...form.register(path("company"), {
            pattern: FormValidator.whiteSpaceRule("Firma"),
            required: requireFields?.company
              ? FormValidator.required("Firma")
              : false,
          })}
          placeholder="Firma"
          required={requireFields?.company}
          label="Firma"
          errors={errors}
        />
        <InputField
          {...form.register(path("phone"), {
            pattern: FormValidator.whiteSpaceRule("Telefon"),
            required: requireFields?.phone
              ? FormValidator.required("Telefon")
              : false,
          })}
          required={requireFields?.phone}
          placeholder="Telefon"
          label="Telefon"
          errors={errors}
        />
      </div>
    </div>
  )
}

export default AddressContactForm
