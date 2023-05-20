import { useAdminDeleteDiscount, useAdminDiscount } from "medusa-react"
import { useState } from "react"
import { useParams } from "react-router-dom"
import BackButton from "../../../components/atoms/back-button"
import Spinner from "../../../components/atoms/spinner"
import DeletePrompt from "../../../components/organisms/delete-prompt"
import RawJSON from "../../../components/organisms/raw-json"
import useNotification from "../../../hooks/use-notification"
import { getErrorMessage } from "../../../utils/error-messages"
import { DiscountFormProvider } from "../new/discount-form/form/discount-form-context"
import DiscountDetailsConditions from "./conditions"
import Configurations from "./configurations"
import General from "./general"

const Edit = () => {
  const { id } = useParams()

  const { discount, isLoading } = useAdminDiscount(
    id!,
    { expand: "rule,rule.conditions" },
    {
      enabled: !!id,
    }
  )
  const [showDelete, setShowDelete] = useState(false)
  const deleteDiscount = useAdminDeleteDiscount(id!)
  const notification = useNotification()

  const handleDelete = () => {
    deleteDiscount.mutate(undefined, {
      onSuccess: () => {
        notification("Õnnestus", "Allahindlus kustutatud", "success")
      },
      onError: (error) => {
        notification("Viga", getErrorMessage(error), "error")
      },
    })
  }

  return (
    <div className="pb-xlarge">
      {showDelete && (
        <DeletePrompt
          handleClose={() => setShowDelete(!showDelete)}
          onDelete={async () => handleDelete()}
          successText="Allahindlus kustutatud"
          confirmText="Jah, kustuta"
          text="Kas olete kindel, et soovite selle allahindluse kustutada?"
          heading="Kustuta allahindlus"
        />
      )}

      <BackButton
        label="Tagasi allahindluste juurde"
        path="/a/discounts"
        className="mb-xsmall"
      />
      {isLoading || !discount ? (
        <div className="flex h-full items-center justify-center">
          <Spinner variant="secondary" />
        </div>
      ) : (
        <div className="gap-y-xsmall flex flex-col">
          <DiscountFormProvider>
            <General discount={discount} />
            <Configurations discount={discount} />
            <DiscountDetailsConditions discount={discount} />
            <RawJSON data={discount} title="Töötlemata allahindlus" />
          </DiscountFormProvider>
        </div>
      )}
    </div>
  )
}

export default Edit
