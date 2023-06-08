import { format } from 'date-fns'
import { et } from 'date-fns/locale'
import { useMemo } from "react"
import { formatAmountWithSymbol } from "../../../utils/prices"
import StatusIndicator from "../../fundamentals/status-indicator"
import IconTooltip from "../../molecules/icon-tooltip"
import Table from "../../molecules/table"

const useGiftCardTableColums = () => {
  const columns = useMemo(
    () => [
      {
        Header: <div className="pl-2">Kood</div>,
        accessor: "code",
        Cell: ({ cell: { value }, index }) => (
          <Table.Cell
            key={index}
            className="text-grey-90 group-hover:text-violet-60 w-[20%] pl-2"
          >
            {value}
          </Table.Cell>
        ),
      },
      {
        Header: "Tellimus",
        accessor: "order",
        Cell: ({ cell: { value }, index }) => (
          <Table.Cell
            key={index}
            className="text-grey-90 group-hover:text-violet-60 w-[10%] pl-2"
          >
            {value && value?.display_id ? (
              `#${value.display_id}`
            ) : (
              <span className="text-grey-90">-</span>
            )}
          </Table.Cell>
        ),
      },
      {
        Header: "Algne summa",
        accessor: "value",
        Cell: ({ row, cell: { value }, index }) => (
          <Table.Cell key={index}>
            {row.original.region ? (
              formatAmountWithSymbol({
                amount: value,
                currency: row.original.region.currency_code,
              })
            ) : (
              <div className="flex items-center space-x-2">
                <span>N / A</span>
                <IconTooltip content={"Piirkond on kustutatud"} />
              </div>
            )}
          </Table.Cell>
        ),
      },
      {
        Header: "Saldo",
        accessor: "balance",
        Cell: ({ row, cell: { value }, index }) => (
          <Table.Cell key={index}>
            {value ? (
              row.original.region ? (
                formatAmountWithSymbol({
                  amount: value,
                  currency: row.original.region.currency_code,
                })
              ) : (
                <div className="flex items-center space-x-2">
                  <span>N / A</span>
                  <IconTooltip content={"Piirkond on kustutatud"} />
                </div>
              )
            ) : (
              <StatusIndicator title="None" variant="danger" />
            )}
          </Table.Cell>
        ),
      },
      {
        Header: () => (
          <div className="rounded-rounded flex w-full justify-end pr-2">
            Loodud
          </div>
        ),
        accessor: "created_at",
        Cell: ({ cell: { value }, index }) => (
          <Table.Cell className="pr-2" key={index}>
            <div className="rounded-rounded flex w-full justify-end">
            {format(new Date(value), 'do MMM yyyy', { locale: et })}
            </div>
          </Table.Cell>
        ),
      },
    ],
    []
  )

  return [columns]
}

export default useGiftCardTableColums
