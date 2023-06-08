import FormValidator from "../../../../utils/form-validator"
import { NestedForm } from "../../../../utils/nested-form"
import InputField from "../../../molecules/input"

export type CustomerGroupGeneralFormType = {
  name: string
}

type CustomerGroupGeneralFormProps = {
  form: NestedForm<CustomerGroupGeneralFormType>
}

export const CustomerGroupGeneralForm = ({
  form,
}: CustomerGroupGeneralFormProps) => {
  const {
    register,
    path,
    formState: { errors },
  } = form

  return (
    <div>
      <InputField
        label="Nimi"
        required
        {...register(path("name"), {
          required: FormValidator.required("Nimi"),
        })}
        errors={errors}
      />
    </div>
  )
}
