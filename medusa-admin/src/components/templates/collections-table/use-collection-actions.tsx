import { useAdminDeleteCollection } from "medusa-react"
import { useNavigate } from "react-router-dom"
import useImperativeDialog from "../../../hooks/use-imperative-dialog"
import EditIcon from "../../fundamentals/icons/edit-icon"
import TrashIcon from "../../fundamentals/icons/trash-icon"
import { ActionType } from "../../molecules/actionables"

const useCollectionActions = (collection) => {
  const navigate = useNavigate()
  const dialog = useImperativeDialog()
  const deleteCollection = useAdminDeleteCollection(collection?.id)

  const handleDelete = async () => {
    const shouldDelete = await dialog({
      heading: "Kustuta kõik kollektsioonid",
      text: "Kas olete kindel, et soovite selle kollektsiooni kustutada?",
    })

    if (shouldDelete) {
      deleteCollection.mutate()
    }
  }

  const getActions = (coll): ActionType[] => [
    {
      label: "Muuda",
      onClick: () => navigate(`/a/collections/${coll.id}`),
      icon: <EditIcon size={20} />,
    },
    {
      label: "Kustuta",
      variant: "danger",
      onClick: handleDelete,
      icon: <TrashIcon size={20} />,
    },
  ]

  return {
    getActions,
  }
}

export default useCollectionActions
