import { format } from 'date-fns'
import { et } from 'date-fns/locale'
import { useMemo } from "react"
import ReactCountryFlag from "react-country-flag"
import { getColor } from "../../../utils/color"
import { isoAlpha2Countries } from "../../../utils/countries"
import { formatAmountWithSymbol } from "../../../utils/prices"
import Tooltip from "../../atoms/tooltip"
import StatusDot from "../../fundamentals/status-indicator"
import StatusIndicator from "../../fundamentals/status-indicator";
import CustomerAvatarItem from "../../molecules/customer-avatar-item"

const useOrderTableColums = () => {
  const decidePaymentStatus = (status) => {
    switch (status) {
      case "captured":
        return <StatusDot variant="success" title={"Makstud"} />
      case "awaiting":
        return <StatusDot variant="default" title={"Ootel"} />
      case "requires_action":
        return <StatusDot variant="danger" title={"Nõuab tegutsemist"} />
      case "canceled":
        return <StatusDot variant="warning" title={"Tühistatud"} />
      default:
        return <StatusDot variant="primary" title={"N/A"} />
    }
  }

  const decideFulfillmentStatus = (status) => {
    switch (status) {
      case "fulfilled":
        return <StatusIndicator variant="success" title={"Täidetud"} />;
      case "shipped":
        return <StatusIndicator variant="success" title={"Saadetud"} />;
      case "not_fulfilled":
        return <StatusIndicator variant="default" title={"Täitmata"} />;
      case "partially_fulfilled":
        return <StatusIndicator variant="warning" title={"Osaliselt täidetud"} />;
      case "partially_shipped":
        return <StatusIndicator variant="warning" title={"Osaliselt saadetud"} />;
      case "requires":
        return <StatusIndicator variant="danger" title={"Nõuab tegutsemist"} />;
      case "canceled":
          return <StatusIndicator variant="warning" title={"Tühistatud"} />
      default:
        return <StatusIndicator variant="primary" title={"N/A"} />;
    }
  };

  const columns = useMemo(
    () => [
      {
        Header: <div className="pl-2">Tellimus</div>,
        accessor: "display_id",
        Cell: ({ cell: { value } }) => (
          <p className="text-grey-90 group-hover:text-violet-60 min-w-[100px] pl-2">{`#${value}`}</p>
        ),
      },
      {
        Header: "Kuupäev lisatud",
        accessor: "created_at",
        Cell: ({ cell: { value } }) => (
          <div>
            <Tooltip content={format(new Date(value), 'dd MMMM yyyy hh:mm a', { locale: et })}>
              {format(new Date(value), 'dd MMMM yyyy', { locale: et })}
            </Tooltip>
          </div>
        ),
      },
      {
        Header: "Klient",
        accessor: "customer",
        Cell: ({ row, cell: { value } }) => (
          <div>
            <CustomerAvatarItem
              customer={{
                first_name:
                  value?.first_name ||
                  row.original.shipping_address?.first_name,
                last_name:
                  value?.last_name || row.original.shipping_address?.last_name,
                email: row.original.email,
              }}
              color={getColor(row.index)}
            />
          </div>
        ),
      },
      {
        Header: "Täitmine",
        accessor: "fulfillment_status",
        Cell: ({ cell: { value } }) => decideFulfillmentStatus(value),
      },
      {
        Header: "Makse olek",
        accessor: "payment_status",
        Cell: ({ cell: { value } }) => decidePaymentStatus(value),
      },
      {
        Header: "Müügikanal",
        accessor: "sales_channel",
        Cell: ({ cell: { value } }) => value?.name ?? "N/A",
      },
      {
        Header: () => <div className="text-right">Kokku</div>,
        accessor: "total",
        Cell: ({ row, cell: { value } }) => (
          <div className="text-right">
            {formatAmountWithSymbol({
              amount: value,
              currency: row.original.currency_code,
              digits: 2,
            })}
          </div>
        ),
      },
      {
        Header: "",
        accessor: "currency_code",
        Cell: ({ cell: { value } }) => (
          <div className="text-grey-40 text-right">{value.toUpperCase()}</div>
        ),
      },
      {
        Header: "",
        accessor: "country_code",
        Cell: ({ row }) => (
          <div className="pr-2">
            <div className="rounded-rounded flex w-full justify-end">
              <Tooltip
                content={
                  isoAlpha2Countries[
                    row.original.shipping_address?.country_code?.toUpperCase()
                  ] ||
                  row.original.shipping_address?.country_code?.toUpperCase()
                }
              >
                <ReactCountryFlag
                  className={"rounded"}
                  svg
                  countryCode={row.original.shipping_address?.country_code}
                />
              </Tooltip>
            </div>
          </div>
        ),
      },
    ],
    []
  )

  return [columns]
}

export default useOrderTableColums
