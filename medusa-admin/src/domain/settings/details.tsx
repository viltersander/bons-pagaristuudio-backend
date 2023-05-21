import { Store } from "@medusajs/medusa"
import { useAdminStore, useAdminUpdateStore } from "medusa-react"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import BackButton from "../../components/atoms/back-button"
import Input from "../../components/molecules/input"
import BodyCard from "../../components/organisms/body-card"
import useNotification from "../../hooks/use-notification"
import { getErrorMessage } from "../../utils/error-messages"

type AccountDetailsFormData = {
  name: string
  swap_link_template: string | undefined
  payment_link_template: string | undefined
  invite_link_template: string | undefined
}

const AccountDetails = () => {
  const { register, reset, handleSubmit } = useForm<AccountDetailsFormData>()
  const { store } = useAdminStore()
  const { mutate } = useAdminUpdateStore()
  const notification = useNotification()

  const handleCancel = () => {
    if (store) {
      reset(mapStoreDetails(store))
    }
  }

  useEffect(() => {
    handleCancel()
  }, [store])

  const onSubmit = (data: AccountDetailsFormData) => {
    const validateSwapLinkTemplate = validateUrl(data.swap_link_template)
    const validatePaymentLinkTemplate = validateUrl(data.payment_link_template)
    const validateInviteLinkTemplate = validateUrl(data.invite_link_template)

    if (!validateSwapLinkTemplate) {
      notification("Viga", "Viga vaheta URL", "error")
      return
    }

    if (!validatePaymentLinkTemplate) {
      notification("Viga", "Valesti vormindatud makse URL", "error")
      return
    }

    if (!validateInviteLinkTemplate) {
      notification("Viga", "Vigane kutse URL", "error")
      return
    }

    mutate(data, {
      onSuccess: () => {
        notification("Õnnestus", "Poe värskendamine õnnestus", "success")
      },
      onError: (error) => {
        notification("Viga", getErrorMessage(error), "error")
      },
    })
  }

  return (
    <form className="flex-col py-5">
      <div className="max-w-[632px]">
        <BackButton
          path="/a/settings/"
          label="Tagasi seadete juurde"
          className="mb-xsmall"
        />
        <BodyCard
          events={[
            {
              label: "Salvesta",
              type: "button",
              onClick: handleSubmit(onSubmit),
            },
            { label: "Tühista", type: "button", onClick: handleCancel },
          ]}
          title="Poe üksikasjad"
          subtitle="Hallake oma ettevõtte üksikasju"
        >
          <div className="gap-y-xlarge mb-large flex flex-col">
            <div>
              <h2 className="inter-base-semibold mb-base">Üldine</h2>
              <Input
                label="Poe nimi"
                {...register("name")}
                placeholder="Medusa Store"
              />
            </div>
            <div>
              <h2 className="inter-base-semibold mb-base">Täpsemad seaded</h2>
              <Input
                label="Vahetage lingi mall"
                {...register("swap_link_template")}
                placeholder="https://acme.inc/swap={swap_id}"
              />
              <Input
                className="mt-base"
                label="Tellimuse mustandi lingi mall"
                {...register("payment_link_template")}
                placeholder="https://acme.inc/payment={payment_id}"
              />
              <Input
                className="mt-base"
                label="Kutse lingi mall"
                {...register("invite_link_template")}
                placeholder="https://acme-admin.inc/invite?token={invite_token}"
              />
            </div>
          </div>
        </BodyCard>
      </div>
    </form>
  )
}

const validateUrl = (address: string | undefined) => {
  if (!address || address === "") {
    return true
  }

  try {
    const url = new URL(address)
    return url.protocol === "http:" || url.protocol === "https:"
  } catch (_) {
    return false
  }
}

const mapStoreDetails = (store: Store): AccountDetailsFormData => {
  return {
    name: store.name,
    swap_link_template: store.swap_link_template,
    payment_link_template: store.payment_link_template,
    invite_link_template: store.invite_link_template,
  }
}

export default AccountDetails
