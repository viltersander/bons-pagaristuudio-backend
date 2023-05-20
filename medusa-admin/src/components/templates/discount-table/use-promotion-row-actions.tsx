import { useAdminDeleteDiscount, useAdminUpdateDiscount } from "medusa-react"
import useImperativeDialog from "../../../hooks/use-imperative-dialog"
import useNotification from "../../../hooks/use-notification"
import { getErrorMessage } from "../../../utils/error-messages"
import DuplicateIcon from "../../fundamentals/icons/duplicate-icon"
import PublishIcon from "../../fundamentals/icons/publish-icon"
import TrashIcon from "../../fundamentals/icons/trash-icon"
import UnpublishIcon from "../../fundamentals/icons/unpublish-icon"
import EditIcon from "../../fundamentals/icons/edit-icon"
import useCopyPromotion from "./use-copy-promotion"
import { useNavigate } from "react-router-dom"

const usePromotionActions = (promotion) => {
  const navigate = useNavigate()
  const notification = useNotification()
  const dialog = useImperativeDialog()

  const copyPromotion = useCopyPromotion()

  const updatePromotion = useAdminUpdateDiscount(promotion.id)
  const deletePromotion = useAdminDeleteDiscount(promotion?.id)

  const handleDelete = async () => {
    const shouldDelete = await dialog({
      heading: "Kustuta allahindlus",
      text: "Kas olete kindel, et soovite selle allahindluse kustutada?",
    })

    if (shouldDelete) {
      deletePromotion.mutate()
    }
  }

  const getRowActions = () => {
    return [
      {
        label: "Muuda",
        icon: <EditIcon size={20} />,
        onClick: () => navigate(`/a/discounts/${promotion.id}`),
      },
      {
        label: promotion.is_disabled ? "Avalda" : "Tühista avaldamine",
        icon: promotion.is_disabled ? (
          <PublishIcon size={20} />
        ) : (
          <UnpublishIcon size={20} />
        ),
        onClick: () => {
          updatePromotion.mutate(
            {
              is_disabled: !promotion.is_disabled,
            },
            {
              onSuccess: () => {
                notification(
                  "Õnnestus",
                  `Edukalt ${
                    promotion.is_disabled ? "avaldatud" : "avaldamata"
                  } soodustuse`,
                  "success"
                )
              },
              onError: (err) =>
                notification("Error", getErrorMessage(err), "error"),
            }
          )
        },
      },
      {
        label: "Duplikaat",
        icon: <DuplicateIcon size={20} />,
        onClick: () => copyPromotion(promotion),
      },
      {
        label: "Kustuta",
        icon: <TrashIcon size={20} />,
        variant: "danger",
        onClick: handleDelete,
      },
    ]
  }

  return { getRowActions }
}

export default usePromotionActions
