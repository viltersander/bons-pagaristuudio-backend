import {
  Address,
  ClaimOrder,
  Fulfillment,
  LineItem,
  Swap,
} from "@medusajs/medusa"
import {
  useAdminCancelOrder,
  useAdminCapturePayment,
  useAdminOrder,
  useAdminRegion,
  useAdminReservations,
  useAdminUpdateOrder,
} from "medusa-react"
import { useNavigate, useParams } from "react-router-dom"
import OrderEditProvider, { OrderEditContext } from "../edit/context"
import {
  DisplayTotal,
  FormattedAddress,
  FormattedFulfillment,
  FulfillmentStatusComponent,
  OrderStatusComponent,
  PaymentActionables,
  PaymentStatusComponent,
} from "./templates"

import { capitalize } from "lodash"
import moment from "moment"
import 'moment/locale/et';
import { useEffect, useMemo, useState } from "react"
import { useHotkeys } from "react-hotkeys-hook"
import Avatar from "../../../components/atoms/avatar"
import BackButton from "../../../components/atoms/back-button"
import Spinner from "../../../components/atoms/spinner"
import Tooltip from "../../../components/atoms/tooltip"
import Button from "../../../components/fundamentals/button"
import DetailsIcon from "../../../components/fundamentals/details-icon"
import CancelIcon from "../../../components/fundamentals/icons/cancel-icon"
import ClipboardCopyIcon from "../../../components/fundamentals/icons/clipboard-copy-icon"
import CornerDownRightIcon from "../../../components/fundamentals/icons/corner-down-right-icon"
import DollarSignIcon from "../../../components/fundamentals/icons/dollar-sign-icon"
import MailIcon from "../../../components/fundamentals/icons/mail-icon"
import RefreshIcon from "../../../components/fundamentals/icons/refresh-icon"
import TruckIcon from "../../../components/fundamentals/icons/truck-icon"
import { ActionType } from "../../../components/molecules/actionables"
import JSONView from "../../../components/molecules/json-view"
import BodyCard from "../../../components/organisms/body-card"
import RawJSON from "../../../components/organisms/raw-json"
import Timeline from "../../../components/organisms/timeline"
import { AddressType } from "../../../components/templates/address-form"
import TransferOrdersModal from "../../../components/templates/transfer-orders-modal"
import useClipboard from "../../../hooks/use-clipboard"
import useImperativeDialog from "../../../hooks/use-imperative-dialog"
import useNotification from "../../../hooks/use-notification"
import useToggleState from "../../../hooks/use-toggle-state"
import { useFeatureFlag } from "../../../providers/feature-flag-provider"
import { isoAlpha2Countries } from "../../../utils/countries"
import { getErrorMessage } from "../../../utils/error-messages"
import extractCustomerName from "../../../utils/extract-customer-name"
import { formatAmountWithSymbol } from "../../../utils/prices"
import OrderEditModal from "../edit/modal"
import AddressModal from "./address-modal"
import CreateFulfillmentModal from "./create-fulfillment"
import SummaryCard from "./detail-cards/summary"
import EmailModal from "./email-modal"
import MarkShippedModal from "./mark-shipped"
import CreateRefundModal from "./refund"
import { format } from 'date-fns';
import et from 'date-fns/locale/et'; 


type OrderDetailFulfillment = {
  title: string
  type: string
  fulfillment: Fulfillment
  swap?: Swap
  claim?: ClaimOrder
}

const gatherAllFulfillments = (order) => {
  if (!order) {
    return []
  }

  const all: OrderDetailFulfillment[] = []

  order.fulfillments.forEach((f, index) => {
    all.push({
      title: `Täitmine #${index + 1}`,
      type: "default",
      fulfillment: f,
    })
  })

  if (order.claims?.length) {
    order.claims.forEach((claim) => {
      if (claim.fulfillment_status !== "not_fulfilled") {
        claim.fulfillments.forEach((fulfillment, index) => {
          all.push({
            title: `Kinnita täitmine #${index + 1}`,
            type: "claim",
            fulfillment,
            claim,
          })
        })
      }
    })
  }

  if (order.swaps?.length) {
    order.swaps.forEach((swap) => {
      if (swap.fulfillment_status !== "not_fulfilled") {
        swap.fulfillments.forEach((fulfillment, index) => {
          all.push({
            title: `Vahetuse täitmine #${index + 1}`,
            type: "swap",
            fulfillment,
            swap,
          })
        })
      }
    })
  }

  return all
}

const OrderDetails = () => {
  const { id } = useParams()

  const dialog = useImperativeDialog()

  const [addressModal, setAddressModal] = useState<null | {
    address?: Address | null
    type: AddressType
  }>(null)

  const [emailModal, setEmailModal] = useState<null | {
    email: string
  }>(null)

  const { state: showTransferOrderModal, toggle: toggleTransferOrderModal } =
    useToggleState()

  const [showFulfillment, setShowFulfillment] = useState(false)
  const [showRefund, setShowRefund] = useState(false)
  const [fullfilmentToShip, setFullfilmentToShip] = useState(null)

  const { order, isLoading } = useAdminOrder(id!)

  const capturePayment = useAdminCapturePayment(id!)
  const cancelOrder = useAdminCancelOrder(id!)

  const {
    state: addressModalState,
    close: closeAddressModal,
    open: openAddressModal,
  } = useToggleState()

  const { mutate: updateOrder } = useAdminUpdateOrder(id!)

  const { region } = useAdminRegion(order?.region_id!, {
    enabled: !!order?.region_id,
  })
  const { isFeatureEnabled } = useFeatureFlag()
  const inventoryEnabled = useMemo(() => {
    return isFeatureEnabled("inventoryService")
  }, [isFeatureEnabled])

  const { reservations, refetch: refetchReservations } = useAdminReservations(
    {
      line_item_id: order?.items.map((item) => item.id),
    },
    {
      enabled: inventoryEnabled,
    }
  )

  useEffect(() => {
    if (inventoryEnabled) {
      refetchReservations()
    }
  }, [inventoryEnabled, refetchReservations])

  const navigate = useNavigate()
  const notification = useNotification()

  const [, handleCopy] = useClipboard(`${order?.display_id!}`, {
    successDuration: 5500,
    onCopied: () => notification("Õnnestus", "Toote ID kopeeritud", "success"),
  })

  const [, handleCopyEmail] = useClipboard(order?.email!, {
    successDuration: 5500,
    onCopied: () => notification("Õnnestus", "Mail kopeeritud", "success"),
  })

  // @ts-ignore
  useHotkeys("esc", () => navigate("/a/orders"))
  useHotkeys("command+i", handleCopy)

  const handleDeleteOrder = async () => {
    const shouldDelete = await dialog({
      heading: "Tühista tellimus",
      text: "Kas olete kindel, et soovite tellimuse tühistada?",
      extraConfirmation: true,
      entityName: `tellimus #${order?.display_id}`,
    })

    if (!shouldDelete) {
      return
    }

    return cancelOrder.mutate(undefined, {
      onSuccess: () =>
        notification("Õnnestus", "Tellimuse tühistamine õnnestus", "success"),
      onError: (err) => notification("Viga", getErrorMessage(err), "error"),
    })
  }

  const allFulfillments = gatherAllFulfillments(order)

  const customerActionables: ActionType[] = [
    {
      label: "Minge kliendi juurde",
      icon: <DetailsIcon size={"20"} />,
      onClick: () => navigate(`/a/customers/${order?.customer.id}`),
    },
    {
      label: "Omandiõigus üle anda",
      icon: <RefreshIcon size={"20"} />,
      onClick: () => toggleTransferOrderModal(),
    },
  ]

  customerActionables.push({
    label: "Redigeeri tarneaadressi",
    icon: <TruckIcon size={"20"} />,
    onClick: () => {
      setAddressModal({
        address: order?.shipping_address,
        type: AddressType.SHIPPING,
      })
      openAddressModal()
    },
  })

  customerActionables.push({
    label: "Muuda arveldusaadressi",
    icon: <DollarSignIcon size={"20"} />,
    onClick: () => {
      setAddressModal({
        address: order?.billing_address,
        type: AddressType.BILLING,
      })
      openAddressModal()
    },
  })

  if (order?.email) {
    customerActionables.push({
      label: "Muuda meiliaadressi",
      icon: <MailIcon size={"20"} />,
      onClick: () => {
        setEmailModal({
          email: order?.email,
        })
      },
    })
  }

  if (!order && isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Spinner size="small" variant="secondary" />
      </div>
    )
  }

  if (!order && !isLoading) {
    navigate("/404")
  }

  const anyItemsToFulfil = order.items.some(
    (item: LineItem) => item.quantity > (item.fulfilled_quantity ?? 0)
  )

  return (
    <div>
      <OrderEditProvider orderId={id!}>
        <BackButton
          path="/a/orders"
          label="Tagasi tellimuste juurde"
          className="mb-xsmall"
        />
        {isLoading || !order ? (
          <BodyCard className="pt-2xlarge flex w-full items-center justify-center">
            <Spinner size={"large"} variant={"secondary"} />
          </BodyCard>
        ) : (
          <>
            <div className="flex space-x-4">
              <div className="flex h-full w-7/12 flex-col">
                <BodyCard
                  className={"mb-4 min-h-[200px] w-full"}
                  customHeader={
                    <Tooltip side="top" content={"Kopeeri ID"}>
                      <button
                        className="inter-xlarge-semibold text-grey-90 active:text-violet-90 flex cursor-pointer items-center gap-x-2"
                        onClick={handleCopy}
                      >
                        #{order.display_id} <ClipboardCopyIcon size={16} />
                      </button>
                    </Tooltip>
                  }
                  subtitle={format(new Date(order.created_at), "d MMMM yyyy hh:mm a", { locale: et })}
                  status={<OrderStatusComponent status={order.status} />}
                  forceDropdown={true}
                  actionables={[
                    {
                      label: "Tühista tellimus",
                      icon: <CancelIcon size={"20"} />,
                      variant: "danger",
                      onClick: () => handleDeleteOrder(),
                    },
                  ]}
                >
                  <div className="mt-6 flex space-x-6 divide-x">
                    <div className="flex flex-col">
                      <div className="inter-smaller-regular text-grey-50 mb-1">
                        Mail
                      </div>
                      <button
                        className="text-grey-90 active:text-violet-90 flex cursor-pointer items-center gap-x-1"
                        onClick={handleCopyEmail}
                      >
                        {order.email}
                        <ClipboardCopyIcon size={12} />
                      </button>
                    </div>
                    <div className="flex flex-col pl-6">
                      <div className="inter-smaller-regular text-grey-50 mb-1">
                        Telefon
                      </div>
                      <div>{order.shipping_address?.phone || "N/A"}</div>
                    </div>
                    <div className="flex flex-col pl-6">
                      <div className="inter-smaller-regular text-grey-50 mb-1">
                        Makse
                      </div>
                      <div>
                        {order.payments
                          ?.map((p) => capitalize(p.provider_id))
                          .join(", ")}
                      </div>
                    </div>
                  </div>
                </BodyCard>

                <SummaryCard order={order} reservations={reservations || []} />

                <BodyCard
                  className={"mb-4 h-auto min-h-0 w-full"}
                  title="Makse"
                  status={
                    <PaymentStatusComponent status={order.payment_status} />
                  }
                  customActionable={
                    <PaymentActionables
                      order={order}
                      capturePayment={capturePayment}
                      showRefundMenu={() => setShowRefund(true)}
                    />
                  }
                >
                  <div className="mt-6">
                    {order.payments.map((payment) => (
                      <div className="flex flex-col" key={payment.id}>
                        <DisplayTotal
                          currency={order.currency_code}
                          totalAmount={payment.amount}
                          totalTitle={payment.id}
                          subtitle={format(new Date(order.created_at), "d MMMM yyyy hh:mm a", { locale: et })}
                          
                        />
                        {!!payment.amount_refunded && (
                          <div className="mt-4 flex justify-between">
                            <div className="flex">
                              <div className="text-grey-40 mr-2">
                                <CornerDownRightIcon />
                              </div>
                              <div className="inter-small-regular text-grey-90">
                                Tagastatud makse
                              </div>
                            </div>
                            <div className="flex">
                              <div className="inter-small-regular text-grey-90 mr-3">
                                -
                                {formatAmountWithSymbol({
                                  amount: payment.amount_refunded,
                                  currency: order.currency_code,
                                })}
                              </div>
                              <div className="inter-small-regular text-grey-50">
                                {order.currency_code.toUpperCase()}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                    <div className="mt-4 flex justify-between">
                      <div className="inter-small-semibold text-grey-90">
                        Kokku makstud
                      </div>
                      <div className="flex">
                        <div className="inter-small-semibold text-grey-90 mr-3">
                          {formatAmountWithSymbol({
                            amount: order.paid_total - order.refunded_total,
                            currency: order.currency_code,
                          })}
                        </div>
                        <div className="inter-small-regular text-grey-50">
                          {order.currency_code.toUpperCase()}
                        </div>
                      </div>
                    </div>
                  </div>
                </BodyCard>
                <BodyCard
                  className={"mb-4 h-auto min-h-0 w-full"}
                  title="Täitmine"
                  status={
                    <FulfillmentStatusComponent
                      status={order.fulfillment_status}
                    />
                  }
                  customActionable={
                    order.status !== "canceled" &&
                    anyItemsToFulfil && (
                      <Button
                        variant="secondary"
                        size="small"
                        onClick={() => setShowFulfillment(true)}
                      >
                        Loo täitmine
                      </Button>
                    )
                  }
                >
                  <div className="mt-6">
                    {order.shipping_methods.map((method) => (
                      <div className="flex flex-col" key={method.id}>
                        <span className="inter-small-regular text-grey-50">
                          Saatmisviis 
                        </span>
                        <span className="inter-small-regular text-grey-90 mt-2">
                          {method?.shipping_option?.name || ""}
                        </span>
                        <div className="mt-4 flex w-full flex-grow items-center">
                          <JSONView data={method?.data} />
                        </div>
                      </div>
                    ))}
                    <div className="inter-small-regular mt-6 ">
                      {allFulfillments.map((fulfillmentObj, i) => (
                        <FormattedFulfillment
                          key={i}
                          order={order}
                          fulfillmentObj={fulfillmentObj}
                          setFullfilmentToShip={setFullfilmentToShip}
                        />
                      ))}
                    </div>
                  </div>
                </BodyCard>
                <BodyCard
                  className={"mb-4 h-auto min-h-0 w-full"}
                  title="Klient"
                  actionables={customerActionables}
                >
                  <div className="mt-6">
                    <div className="flex w-full items-center space-x-4">
                      <div className="flex h-[40px] w-[40px] ">
                        <Avatar
                          user={order.customer}
                          font="inter-large-semibold"
                          color="bg-fuschia-40"
                        />
                      </div>
                      <div>
                        <h1 className="inter-large-semibold text-grey-90">
                          {extractCustomerName(order)}
                        </h1>
                        {order.shipping_address && (
                          <span className="inter-small-regular text-grey-50">
                            {order.shipping_address.city},{" "}
                            {
                              isoAlpha2Countries[
                                order.shipping_address.country_code?.toUpperCase()
                              ]
                            }
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="mt-6 flex space-x-6 divide-x">
                      <div className="flex flex-col">
                        <div className="inter-small-regular text-grey-50 mb-1">
                          Kontakt
                        </div>
                        <div className="inter-small-regular flex flex-col">
                          <span>{order.email}</span>
                          <span>{order.shipping_address?.phone || ""}</span>
                        </div>
                      </div>
                      <FormattedAddress
                        title={"Transport"}
                        addr={order.shipping_address}
                      />
                      <FormattedAddress
                        title={"Arveldamine"}
                        addr={order.billing_address}
                      />
                    </div>
                  </div>
                </BodyCard>
                <div className="mt-large">
                  <RawJSON data={order} title="Töötlemata tellimus" />
                </div>
              </div>
              <Timeline orderId={order.id} />
            </div>

            <AddressModal
              onClose={closeAddressModal}
              open={addressModalState}
              onSave={updateOrder}
              address={addressModal?.address || undefined}
              type={addressModal?.type}
              allowedCountries={region?.countries}
            />

            {emailModal && (
              <EmailModal
                handleClose={() => setEmailModal(null)}
                email={emailModal.email}
                orderId={order.id}
              />
            )}
            {showFulfillment && (
              <CreateFulfillmentModal
                orderToFulfill={order as any}
                handleCancel={() => setShowFulfillment(false)}
                orderId={order.id}
                onComplete={inventoryEnabled ? refetchReservations : () => {}}
              />
            )}
            {showRefund && (
              <CreateRefundModal
                order={order}
                onDismiss={() => setShowRefund(false)}
              />
            )}
            {showTransferOrderModal && (
              <TransferOrdersModal
                order={order}
                onDismiss={toggleTransferOrderModal}
              />
            )}
            {fullfilmentToShip && (
              <MarkShippedModal
                handleCancel={() => setFullfilmentToShip(null)}
                fulfillment={fullfilmentToShip}
                orderId={order.id}
              />
            )}
            <OrderEditContext.Consumer>
              {({ isModalVisible }) =>
                isModalVisible && <OrderEditModal order={order} />
              }
            </OrderEditContext.Consumer>
          </>
        )}
      </OrderEditProvider>
    </div>
  )
}

export default OrderDetails
