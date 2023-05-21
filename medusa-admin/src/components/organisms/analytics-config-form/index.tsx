import clsx from "clsx"
import { useEffect } from "react"
import { Controller, useWatch } from "react-hook-form"
import { NestedForm } from "../../../utils/nested-form"
import Switch from "../../atoms/switch"

export type AnalyticsConfigFormType = {
  anonymize: boolean
  opt_out: boolean
}

type Props = {
  form: NestedForm<AnalyticsConfigFormType>
}

const AnalyticsConfigForm = ({ form }: Props) => {
  const { control, setValue, path } = form

  const watchOptOut = useWatch({
    control,
    name: path("opt_out"),
  })

  useEffect(() => {
    if (watchOptOut) {
      setValue(path("anonymize"), false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchOptOut])

  return (
    <div className="gap-y-xlarge flex flex-col">
      <div
        className={clsx("flex items-start transition-opacity", {
          "opacity-50": watchOptOut,
        })}
      >
        <div className="gap-y-2xsmall flex flex-1 flex-col">
          <h2 className="inter-base-semibold">Muuda minu kasutusandmed anonüümseks</h2>
          <p className="inter-base-regular text-grey-50">
          Saate oma kasutusandmed anonüümseks muuta. Kui see valik on valitud, ei kogu me teie isikuandmeid, nagu teie nimi ja e-posti aadress.
          </p>
        </div>
        <Controller
          name={path("anonymize")}
          control={control}
          render={({ field: { value, onChange } }) => {
            return (
              <Switch
                checked={value}
                onCheckedChange={onChange}
                disabled={watchOptOut}
              />
            )
          }}
        />
      </div>
      <div className="flex items-start">
        <div className="gap-y-2xsmall flex flex-1 flex-col">
          <h2 className="inter-base-semibold">
            Loobu minu kasutusandmete jagamisest
          </h2>
          <p className="inter-base-regular text-grey-50">
            Saate alati oma kasutusandmete jagamisest igal ajal loobuda.
          </p>
        </div>
        <Controller
          name={path("opt_out")}
          control={control}
          render={({ field: { value, onChange } }) => {
            return <Switch checked={value} onCheckedChange={onChange} />
          }}
        />
      </div>
    </div>
  )
}

export default AnalyticsConfigForm
