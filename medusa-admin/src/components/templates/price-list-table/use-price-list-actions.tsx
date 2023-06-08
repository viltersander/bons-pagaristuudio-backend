import { useAdminDeletePriceList, useAdminUpdatePriceList } from "medusa-react"
import useImperativeDialog from "../../../hooks/use-imperative-dialog"
import useNotification from "../../../hooks/use-notification"
import { getErrorMessage } from "../../../utils/error-messages"
import TrashIcon from "../../fundamentals/icons/trash-icon"
import UnpublishIcon from "../../fundamentals/icons/unpublish-icon"
import { ActionType } from "../../molecules/actionables"
import { isActive } from "./utils"
import PublishIcon from "../../fundamentals/icons/publish-icon"

const usePriceListActions = (priceList) => {
  const dialog = useImperativeDialog()
  const notification = useNotification()
  const updatePrice = useAdminUpdatePriceList(priceList?.id)
  const deletePrice = useAdminDeletePriceList(priceList?.id)

  const onDelete = async () => {
    const shouldDelete = await dialog({
      heading: "Kustuta hinnakiri",
      text: "Kas soovite kindlasti selle hinnakirja kustutada?",
    })
    if (shouldDelete) {
      deletePrice.mutate(undefined, {
        onSuccess: () => {
          notification(
            "Õnnestus",
            "Hinnakirja kustutamine õnnestus",
            "success"
          )
        },
        onError: (err) => notification("Error", getErrorMessage(err), "error"),
      })
    }
  }

  const onUpdate = () => {
    updatePrice.mutate(
      {
        status: isActive(priceList) ? "mustand" : "aktiivne",
      },
      {
        onSuccess: () => {
          notification(
            "Õnnestus",
            `Edukalt ${
              isActive(priceList) ? "ei avaldanud" : "avaldasite"
            } hinnakirja`,
            "success"
          )
        },
      }
    )
  }

  const getActions = (): ActionType[] => [
    {
      label: isActive(priceList) ? "Tühista avaldamine" : "Avalda",
      onClick: onUpdate,
      icon: isActive(priceList) ? (
        <UnpublishIcon size={20} />
      ) : (
        <PublishIcon size={20} />
      ),
    },
    {
      label: "Kustuta",
      onClick: onDelete,
      icon: <TrashIcon size={20} />,
      variant: "danger",
    },
  ]

  return {
    getActions,
  }
}

export default usePriceListActions
