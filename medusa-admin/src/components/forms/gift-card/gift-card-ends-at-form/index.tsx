import { Controller } from "react-hook-form"
import { NestedForm } from "../../../../utils/nested-form"
import DatePicker from "../../../atoms/date-picker/date-picker"
import TimePicker from "../../../atoms/date-picker/time-picker"
import SwitchableItem from "../../../molecules/switchable-item"

export type GiftCardEndsAtFormType = {
  ends_at: Date | null
}

type GiftCardEndsAtFormProps = {
  form: NestedForm<GiftCardEndsAtFormType>
}

const GiftCardEndsAtForm = ({ form }: GiftCardEndsAtFormProps) => {
  const { control, path } = form

  return (
    <Controller
      name={path("ends_at")}
      control={control}
      render={({ field: { value, onChange } }) => {
        return (
          <SwitchableItem
            open={!!value}
            onSwitch={() => {
              if (value) {
                onChange(null)
              } else {
                onChange(
                  new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000)
                )
              }
            }}
            title="Kas kinkekaardil on aegumiskuupäev?"
            description="Planeerige kinkekaart tulevikus deaktiveerimiseks."
          >
            <div className="gap-x-xsmall flex items-center">
              <DatePicker
                date={value!}
                label="Aegumiskuupäev"
                onSubmitDate={onChange}
              />
              <TimePicker
                label="Aegumisaeg"
                date={value!}
                onSubmitDate={onChange}
              />
            </div>
          </SwitchableItem>
        )
      }}
    />
  )
}

export default GiftCardEndsAtForm
