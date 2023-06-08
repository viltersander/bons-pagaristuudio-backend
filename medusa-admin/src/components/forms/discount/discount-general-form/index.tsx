import clsx from "clsx"
import { useAdminRegions } from "medusa-react"
import { useMemo } from "react"
import { Controller, useWatch } from "react-hook-form"
import { Option } from "../../../../types/shared"
import FormValidator from "../../../../utils/form-validator"
import { NestedForm } from "../../../../utils/nested-form"
import InputError from "../../../atoms/input-error"
import IconTooltip from "../../../molecules/icon-tooltip"
import IndeterminateCheckbox from "../../../molecules/indeterminate-checkbox"
import InputField from "../../../molecules/input"
import { NextSelect } from "../../../molecules/select/next-select"
import TextArea from "../../../molecules/textarea"
import PriceFormInput from "../../general/prices-form/price-form-input"

type DiscountRegionOption = Option & {
  currency_code: string
}

enum DiscountRuleType {
  FIXED = "fixed",
  PERCENTAGE = "percentage",
  FREE_SHIPPING = "free_shipping",
}

export type DiscountGeneralFormType = {
  region_ids: DiscountRegionOption[]
  code: string
  value?: number
  description: string
  is_dynamic?: boolean
}

type DiscountGeneralFormProps = {
  form: NestedForm<DiscountGeneralFormType>
  type: DiscountRuleType
  isEdit?: boolean
}

const DiscountGeneralForm = ({
  form,
  type,
  isEdit,
}: DiscountGeneralFormProps) => {
  const {
    register,
    path,
    control,
    formState: { errors },
  } = form

  const { regions } = useAdminRegions()

  const regionOptions = useMemo(() => {
    return (
      regions?.map((r) => ({
        value: r.id,
        label: r.name,
        currency_code: r.currency_code,
      })) || []
    )
  }, [regions])

  const selectedRegionCurrency = useWatch({
    control,
    name: path("region_ids.0.currency_code"),
    defaultValue: "eur",
  })

  return (
    <div className="gap-y-large flex flex-col">
      <Controller
        name={path("region_ids")}
        control={control}
        rules={{
          required: FormValidator.required("Piirkonnad"),
        }}
        render={({ field: { value, onChange, name, ref } }) => {
          return (
            <NextSelect
              name={name}
              ref={ref}
              value={value}
              onChange={(value) => {
                onChange(type === DiscountRuleType.FIXED ? [value] : value)
              }}
              label="Valige kehtivad piirkonnad"
              isMulti={type !== DiscountRuleType.FIXED}
              selectAll={type !== DiscountRuleType.FIXED}
              isSearchable
              required
              options={regionOptions}
              errors={errors}
            />
          )
        }}
      />
      <div>
        <div
          className={clsx("gap-small grid", {
            "grid-cols-2":
              type === DiscountRuleType.FIXED ||
              type === DiscountRuleType.PERCENTAGE,
            "grid-cols-1": type === DiscountRuleType.FREE_SHIPPING,
          })}
        >
          <InputField
            label="Kood"
            required
            errors={errors}
            {...register(path("code"), {
              required: FormValidator.required("Kood"),
            })}
          />
          {type === DiscountRuleType.FIXED ? (
            <Controller
              name={path("value")}
              rules={{
                required: FormValidator.required("Summa"),
                shouldUnregister: true,
              }}
              render={({ field: { value, onChange } }) => {
                return (
                  <PriceFormInput
                    label="Summa"
                    amount={value}
                    onChange={onChange}
                    currencyCode={selectedRegionCurrency}
                    errors={errors}
                  />
                )
              }}
            />
          ) : type === DiscountRuleType.PERCENTAGE ? (
            <InputField
              label="Protsent"
              placeholder="Protsent"
              errors={errors}
              prefix="%"
              required
              {...register(path("value"), {
                valueAsNumber: true,
                required: FormValidator.required("Protsent"),
                shouldUnregister: true,
              })}
            />
          ) : null}
        </div>
        <p className="inter-small-regular text-grey-50 mt-small max-w-[60%]">
          Kood, mille teie kliendid kassas tasumisel sisestavad. See ilmub
          oma klientide arvel. Ainult suurtähed ja numbrid.
        </p>
      </div>
      <div>
        <TextArea
          label="Kirjeldus"
          errors={errors}
          required
          {...register(path("description"), {
            required: FormValidator.required("Kirjeldus"),
          })}
        />
      </div>
      {!isEdit && (
        <div>
          <Controller
            name={path("is_dynamic")}
            control={control}
            render={({ field: { value, onChange, ref } }) => {
              return (
                <div>
                  <div className="flex items-center">
                    <IndeterminateCheckbox
                      checked={value}
                      onChange={onChange}
                      ref={ref}
                    />
                    <p className="ml-small mr-xsmall">Allahindluse mall</p>
                    <IconTooltip content="Allahindluste mallid võimaldavad teil määratleda reeglite komplekti, mida saab kasutada allahindluste rühmas. See on kasulik kampaaniates, mis peaksid looma iga kasutaja jaoks kordumatud koodid, kuid kus kõigi unikaalsete koodide reeglid peaksid olema samad." />
                  </div>
                  <InputError errors={errors} name={path("is_dynamic")} />
                </div>
              )
            }}
          />
        </div>
      )}
    </div>
  )
}

export default DiscountGeneralForm
