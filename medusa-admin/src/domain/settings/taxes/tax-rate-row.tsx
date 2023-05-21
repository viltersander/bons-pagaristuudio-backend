import { useAdminDeleteTaxRate } from "medusa-react"
import EditIcon from "../../../components/fundamentals/icons/edit-icon"
import TrashIcon from "../../../components/fundamentals/icons/trash-icon"
import { ActionType } from "../../../components/molecules/actionables"
import Table from "../../../components/molecules/table"
import useImperativeDialog from "../../../hooks/use-imperative-dialog"
import useNotification from "../../../hooks/use-notification"
import { TaxRateType } from "../../../types/shared"
import { getErrorMessage } from "../../../utils/error-messages"

type TaxRate = {
  id: string
  name?: string
  rate: number | null
  code: string | null
  type: TaxRateType
}

export const TaxRateRow = ({ row, onEdit }) => {
  const dialog = useImperativeDialog()
  const notification = useNotification()
  const deleteTaxRate = useAdminDeleteTaxRate(row.original.id)

  const handleDelete = async (rate: TaxRate) => {
    if (!rate || rate.type !== TaxRateType.RATE) {
      return Promise.resolve()
    }

    const shouldDelete = await dialog({
      heading: "Kustuta maksumäär",
      text: "Kas olete kindel, et soovite selle maksumäära kustutada?",
    })

    if (!shouldDelete) {
      return
    }

    return deleteTaxRate
      .mutateAsync()
      .then(() => {
        notification("Õnnestus", "Maksumäär kustutati.", "success")
      })
      .catch((err) => {
        notification("Viga", getErrorMessage(err), "error")
      })
  }

  const actions: ActionType[] = [
    {
      label: "Muuda",
      onClick: () => onEdit(row.original),
      icon: <EditIcon size={20} />,
    },
  ]

  if (row.original.type === TaxRateType.RATE) {
    actions.push({
      label: "Kustuta maksumäär",
      variant: "danger",
      onClick: () => handleDelete(row.original),
      icon: <TrashIcon size={20} />,
    })
  }

  return (
    <Table.Row
      color={"inherit"}
      forceDropdown
      actions={actions}
      {...row.getRowProps()}
      className="group"
    >
      {row.cells.map((cell) => {
        return <Table.Cell>{cell.render("Cell")}</Table.Cell>
      })}
    </Table.Row>
  )
}
