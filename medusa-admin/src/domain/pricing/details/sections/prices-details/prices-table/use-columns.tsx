import { Product } from "@medusajs/medusa"
import * as React from "react"
import { Column } from "react-table"
import ImagePlaceholder from "../../../../../../components/fundamentals/image-placeholder"
import Table from "../../../../../../components/molecules/table"

const usePricesColumns = () => {
  const columns = React.useMemo<Column<Product>[]>(
    () => [
      {
        Header: <div className="pl-4">Nimi</div>,
        accessor: "title",
        Cell: ({ row: { original } }) => (
          <div className="flex items-center pl-4">
            <div className="my-1.5 mr-4 flex h-[40px] w-[30px] items-center">
              {original.thumbnail ? (
                <img
                  src={original.thumbnail}
                  className="rounded-soft h-full object-cover"
                />
              ) : (
                <ImagePlaceholder />
              )}
            </div>
            <div className="flex flex-col">
              <span>{original.title}</span>
            </div>
          </div>
        ),
      },
      {
        Header: <div className="w-[400px]">Kollektsioon</div>,
        accessor: "collection",
        Cell: ({ cell: { value } }) => (
          <Table.Cell>
            {value?.title ? (
              value.title
            ) : (
              <span className="text-grey-40">Kollektsioon puudub</span>
            )}
          </Table.Cell>
        ),
      },
      {
        Header: "Variandid",
        Cell: ({ row: { original } }) => (
          <Table.Cell>{original.variants.length}</Table.Cell>
        ),
      },
    ],
    []
  )

  return columns
}
export default usePricesColumns
