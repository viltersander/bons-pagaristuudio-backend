import LockIcon from "../../../components/fundamentals/icons/lock-icon"
import Input from "../../../components/molecules/input"
import FormValidator from "../../../utils/form-validator"
import { NestedForm } from "../../../utils/nested-form"

export type EditTaxRateFormType = {
  name: string
  rate: number
  code: string
}

type EditTaxRateProps = {
  form: NestedForm<EditTaxRateFormType>
  lockName?: boolean
}

export const EditTaxRateDetails = ({
  lockName = false,
  form,
}: EditTaxRateProps) => {
  const {
    register,
    path,
    formState: { errors },
  } = form

  return (
    <div>
      <p className="inter-base-semibold mb-base">Üksikasjad</p>
      <Input
        disabled={lockName}
        label="Nimi"
        prefix={
          lockName ? <LockIcon size={16} className="text-grey-40" /> : undefined
        }
        placeholder={lockName ? "Vaikimisi" : "Hinda nime"}
        {...register(path("name"), {
          required: !lockName ? FormValidator.required("Nimi") : undefined,
        })}
        required={!lockName}
        className="mb-base w-full min-w-[335px]"
        errors={errors}
      />
      <Input
        type="number"
        min={0}
        max={100}
        step={0.01}
        formNoValidate
        label="Maksumäär"
        prefix="%"
        placeholder="12"
        {...register(path("rate"), {
          min: FormValidator.min("Maksumäär", 0),
          max: FormValidator.max("Maksumäär", 100),
          required: FormValidator.required("Maksumäär"),
          valueAsNumber: true,
        })}
        required
        className="mb-base w-full min-w-[335px]"
        errors={errors}
      />
      <Input
        placeholder="1000"
        label="Maksukood"
        {...register(path("code"), {
          required: FormValidator.required("Maksukood"),
        })}
        required
        className="mb-base w-full min-w-[335px]"
        errors={errors}
      />
    </div>
  )
}
