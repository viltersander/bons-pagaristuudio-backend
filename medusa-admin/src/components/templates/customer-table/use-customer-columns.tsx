import { format } from 'date-fns'
import { et } from 'date-fns/locale'
import "moment/locale/et"
import { useMemo } from "react"
import { getColor } from "../../../utils/color"
import CustomerAvatarItem from "../../molecules/customer-avatar-item"

export const useCustomerColumns = () => {
  const columns = useMemo(
    () => [
      {
        Header: "Kuupäev lisatud",
        accessor: "created_at", // accessor is the "key" in the data
        Cell: ({ cell: { value } }) =>(
          <div>{format(new Date(value), 'dd MMMM yyyy', { locale: et })}</div>
        ),
      },
      {
        Header: "Nimi",
        accessor: "customer",
        Cell: ({ row }) => (
          <CustomerAvatarItem
            customer={row.original}
            color={getColor(row.index)}
          />
        ),
      },
      {
        Header: "Mail",
        accessor: "email",
      },
      {
        Header: "",
        accessor: "col",
      },
      {
        accessor: "orders",
        Header: () => <div className="text-right">Tellimused</div>,
        Cell: ({ cell: { value } }) => (
          <div className="text-right">{value?.length || 0}</div>
        ),
      },
      {
        Header: "",
        accessor: "col-2",
      },
    ],
    []
  )

  return [columns]
}
