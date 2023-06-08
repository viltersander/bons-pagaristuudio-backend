import { Controller } from "react-hook-form"
import FormValidator from "../../../../utils/form-validator"
import { NestedForm } from "../../../../utils/nested-form"
import { formatAmountWithSymbol } from "../../../../utils/prices"
import PriceFormInput from "../../general/prices-form/price-form-input"

export type GiftCardBalanceFormType = {
  amount: number
}

export type GiftCardBalanceFormProps = {
  form: NestedForm<GiftCardBalanceFormType>
  currencyCode: string
  originalAmount?: number
}

const GiftCardBalanceForm = ({
  form,
  currencyCode,
  originalAmount,
}: GiftCardBalanceFormProps) => {
  const {
    control,
    path,
    formState: { errors },
  } = form

  return (
    <Controller
      name={path("amount")}
      rules={{
        required: FormValidator.required("Saldo"),
        min: {
          value: 0,
          message: "Saldo peab olema suurem kui 0",
        },
        max: originalAmount
          ? {
              value: originalAmount,
              message: `Värskendatud saldo ei tohi ületada algset väärtust ${formatAmountWithSymbol(
                {
                  amount: originalAmount,
                  currency: currencyCode,
                }
              )}`,
            }
          : undefined,
      }}
      control={control}
      render={({ field: { value, onChange, name } }) => {
        return (
          <PriceFormInput
            label="Summa"
            currencyCode={currencyCode}
            onChange={onChange}
            amount={value}
            name={name}
            errors={errors}
            required
          />
        )
      }}
    />
  )
}

export default GiftCardBalanceForm
