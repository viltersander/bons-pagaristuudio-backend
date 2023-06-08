import FormValidator from "../../../../utils/form-validator"
import { NestedForm } from "../../../../utils/nested-form"
import InputField from "../../../molecules/input"
import TextArea from "../../../molecules/textarea"

export type GeneralFormType = {
  title: string
  subtitle: string | null
  handle: string
  material: string | null
  description: string | null
}

type Props = {
  form: NestedForm<GeneralFormType>
  requireHandle?: boolean
  isGiftCard?: boolean
}

const GeneralForm = ({ form, requireHandle = true, isGiftCard }: Props) => {
  const {
    register,
    path,
    formState: { errors },
  } = form

  return (
    <div>
      <div className="gap-x-large mb-small grid grid-cols-2">
        <InputField
          label="Pealkiri"
          placeholder={isGiftCard ? "Kinkekaart" : "Küpsised"}
          required
          {...register(path("title"), {
            required: "Pealkiri on nõutud",
            minLength: {
              value: 1,
              message: "Pealkiri peab olema vähemalt 1 tähemärk",
            },
            pattern: FormValidator.whiteSpaceRule("Pealkiri"),
          })}
          errors={errors}
        />
        <InputField
          label="Alapealkiri"
          placeholder="Maitsvad ja värsked..."
          {...register(path("subtitle"), {
            pattern: FormValidator.whiteSpaceRule("Alapealkiri"),
          })}
          errors={errors}
        />
      </div>
      <p className="inter-base-regular text-grey-50 mb-large">
        Andke oma {isGiftCard ? "gift card" : "product"} lühike ja selge pealkiri.
        <br />
        Otsingumootorite jaoks on soovitatav pikkus 50–60 tähemärki.
      </p>
      <div className="gap-x-large mb-large grid grid-cols-2">
        <InputField
          label="Käepide"
          tooltipContent={
            !requireHandle
              ? `Käepide on URL-i osa, mis tuvastab ${
                  isGiftCard ? "gift card" : "product"
                }. Kui pole määratud, genereeritakse see pealkirjast.`
              : undefined
          }
          placeholder={isGiftCard ? "gift-card" : "winter-jacket"}
          required={requireHandle}
          {...register(path("handle"), {
            required: requireHandle ? "Käepide on nõutud" : undefined,
            minLength: FormValidator.minOneCharRule("Käepide"),
            pattern: FormValidator.whiteSpaceRule("Käepide"),
          })}
          prefix="/"
          errors={errors}
        />
        {/* <InputField
          label="Materjal"
          placeholder={isGiftCard ? "Paber" : "100% puuvill"}
          {...register(path("material"), {
            minLength: FormValidator.minOneCharRule("Materjal"),
            pattern: FormValidator.whiteSpaceRule("Materjal"),
          })}
          errors={errors}
        /> */}
      </div>
      <TextArea
        label="Kirjeldus"
        placeholder={
          isGiftCard ? "Kinkekaart on..." : "Maitsavad küpsised..."
        }
        rows={3}
        className="mb-small"
        {...register(path("description"))}
        errors={errors}
      />
      <p className="inter-base-regular text-grey-50">
        Anna oma {isGiftCard ? "gift card" : "product"} väike ja selge
        kirjeldus.
        <br />
        Otsingumootorite jaoks on soovitatav pikkus 120–160 tähemärki.
      </p>
    </div>
  )
}

export default GeneralForm
