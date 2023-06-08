import { Address } from "@medusajs/medusa"
import {
  useAdminDeleteDraftOrder,
  useAdminDraftOrder,
  useAdminDraftOrderRegisterPayment,
  useAdminStore,
  useAdminUpdateDraftOrder,
} from "medusa-react"
import moment from "moment"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import Avatar from "../../../components/atoms/avatar"
import BackButton from "../../../components/atoms/back-button"
import CopyToClipboard from "../../../components/atoms/copy-to-clipboard"
import Spinner from "../../../components/atoms/spinner"
import Button from "../../../components/fundamentals/button"
import DetailsIcon from "../../../components/fundamentals/details-icon"
import DollarSignIcon from "../../../components/fundamentals/icons/dollar-sign-icon"
import TruckIcon from "../../../components/fundamentals/icons/truck-icon"
import StatusDot from "../../../components/fundamentals/status-indicator"
import JSONView from "../../../components/molecules/json-view"
import BodyCard from "../../../components/organisms/body-card"
import ConfirmationPrompt from "../../../components/organisms/confirmation-prompt"
import DeletePrompt from "../../../components/organisms/delete-prompt"
import { AddressType } from "../../../components/templates/address-form"
import useNotification from "../../../hooks/use-notification"
import { isoAlpha2Countries } from "../../../utils/countries"
import { getErrorMessage } from "../../../utils/error-messages"
import extractCustomerName from "../../../utils/extract-customer-name"
import { formatAmountWithSymbol } from "../../../utils/prices"
import AddressModal from "../details/address-modal"
import DraftSummaryCard from "../details/detail-cards/draft-summary"
import { DisplayTotal, FormattedAddress } from "../details/templates"
import { format } from 'date-fns';
import et from 'date-fns/locale/et'; 

type DeletePromptData = {
  resource: string
  onDelete: () => any
  show: boolean
}

const DraftOrderDetails = () => {
  const { id } = useParams()

  const initDeleteState: DeletePromptData = {
    resource: "",
    onDelete: () => Promise.resolve(console.log("Kustuta ressurss")),
    show: false,
  }

  const [deletePromptData, setDeletePromptData] =
    useState<DeletePromptData>(initDeleteState)
  const [addressModal, setAddressModal] = useState<null | {
    address: Address
    type: AddressType
  }>(null)

  const [showMarkAsPaidConfirmation, setShowAsPaidConfirmation] =
    useState(false)

  const { draft_order, isLoading } = useAdminDraftOrder(id!)
  const { store, isLoading: isLoadingStore } = useAdminStore()

  const [paymentLink, setPaymentLink] = useState("")

  useEffect(() => {
    if (store && draft_order && store.payment_link_template) {
      setPaymentLink(
        store.payment_link_template.replace(/\{cart_id\}/, draft_order.cart_id)
      )
    }
  }, [isLoading, isLoadingStore])

  const markPaid = useAdminDraftOrderRegisterPayment(id!)
  const cancelOrder = useAdminDeleteDraftOrder(id!)
  const updateOrder = useAdminUpdateDraftOrder(id!)

  const navigate = useNavigate()
  const notification = useNotification()

  const OrderStatusComponent = () => {
    switch (draft_order?.status) {
      case "completed":
        return <StatusDot title="Lõpetatud" variant="success" />
      case "open":
        return <StatusDot title="Avatud" variant="default" />
      default:
        return null
    }
  }

  const PaymentActionables = () => {
    // Default label and action
    const label = "Märgi tasutuks"
    const action = () => setShowAsPaidConfirmation(true)

    return (
      <Button variant="secondary" size="small" onClick={action}>
        {label}
      </Button>
    )
  }

  const onMarkAsPaidConfirm = async () => {
    try {
      await markPaid.mutateAsync()
      notification("Õnnestus", "Tasuks märkimine õnnestus", "success")
    } catch (err) {
      notification("Viga", getErrorMessage(err), "error")
    } finally {
      setShowAsPaidConfirmation(false)
    }
  }

  const handleDeleteOrder = async () => {
    return cancelOrder.mutate(void {}, {
      onSuccess: () =>
        notification("Õnnestus", "Tellimuse tühistamine õnnestus", "success"),
      onError: (err) => notification("Viga", getErrorMessage(err), "error"),
    })
  }

  const { cart } = draft_order || {}
  const { region } = cart || {}

  return (
    <div>
      <BackButton
        path="/a/draft-orders"
        label="Tagasi tellimuste mustandite juurde"
        className="mb-xsmall"
      />
      {isLoading || !draft_order ? (
        <BodyCard className="pt-2xlarge flex w-full items-center justify-center">
          <Spinner size={"large"} variant={"secondary"} />
        </BodyCard>
      ) : (
        <div className="flex space-x-4">
          <div className="flex h-full w-full flex-col">
            <BodyCard
              className={"mb-4 min-h-[200px] w-full"}
              title={`Tellimus #${draft_order.display_id}`}
              subtitle={format(new Date(draft_order.created_at), "d MMMM yyyy hh:mm a", { locale: et })}
              status={<OrderStatusComponent />}
              customActionable={
                draft_order?.status === "completed" && (
                  <Button
                    variant="secondary"
                    size="small"
                    onClick={() =>
                      navigate(`/a/orders/${draft_order.order_id}`)
                    }
                  >
                    Minge tellimise juurde
                  </Button>
                )
              }
              forceDropdown={draft_order?.status === "completed" ? false : true}
              actionables={
                draft_order?.status === "completed"
                  ? [
                      {
                        label: " Minge tellimise juurde",
                        icon: null,
                        onClick: () => console.log("Ei tohiks siin olla"),
                      },
                    ]
                  : [
                      {
                        label: "Tühista tellimuse mustand",
                        icon: null,
                        // icon: <CancelIcon size={"20"} />,
                        variant: "danger",
                        onClick: () =>
                          setDeletePromptData({
                            resource: "Tellimuse mustand",
                            onDelete: () => handleDeleteOrder(),
                            show: true,
                          }),
                      },
                    ]
              }
            >
              <div className="mt-6 flex space-x-6 divide-x">
                <div className="flex flex-col">
                  <div className="inter-smaller-regular text-grey-50 mb-1">
                    Mail
                  </div>
                  <div>{cart?.email}</div>
                </div>
                <div className="flex flex-col pl-6">
                  <div className="inter-smaller-regular text-grey-50 mb-1">
                    Telefon
                  </div>
                  <div>{cart?.shipping_address?.phone || "N/A"}</div>
                </div>
                <div className="flex flex-col pl-6">
                  <div className="inter-smaller-regular text-grey-50 mb-1">
                    Summa ({region?.currency_code.toUpperCase()})
                  </div>
                  <div>
                    {cart?.total && region?.currency_code
                      ? formatAmountWithSymbol({
                          amount: cart?.total,
                          currency: region?.currency_code,
                        })
                      : "N/A"}
                  </div>
                </div>
              </div>
            </BodyCard>
            <DraftSummaryCard order={draft_order} />
            <BodyCard
              className={"mb-4 h-auto min-h-0 w-full"}
              title="Makse"
              customActionable={
                draft_order?.status !== "completed" && <PaymentActionables />
              }
            >
              <div className="mt-6">
                <DisplayTotal
                  currency={region?.currency_code}
                  totalAmount={cart?.subtotal}
                  totalTitle={"Vahesumma"}
                />
                <DisplayTotal
                  currency={region?.currency_code}
                  totalAmount={cart?.shipping_total}
                  totalTitle={"Transport"}
                />
                <DisplayTotal
                  currency={region?.currency_code}
                  totalAmount={cart?.tax_total}
                  totalTitle={"Maksud"}
                />
                <DisplayTotal
                  variant="bold"
                  currency={region?.currency_code}
                  totalAmount={cart?.total}
                  totalTitle={"Kokku tasuda"}
                />
                {draft_order?.status !== "completed" && (
                  <div className="text-grey-50 inter-small-regular mt-5 flex w-full items-center">
                    <span className="mr-2.5">Makse link:</span>
                    {store?.payment_link_template ? (
                      <CopyToClipboard
                        value={paymentLink}
                        displayValue={draft_order.cart_id}
                        successDuration={1000}
                      />
                    ) : (
                      "Seadistage poe seadetes makselink"
                    )}
                  </div>
                )}
              </div>
            </BodyCard>
            <BodyCard className={"mb-4 h-auto min-h-0 w-full"} title="Saatmine">
              <div className="mt-6">
                {cart?.shipping_methods.map((method) => (
                  <div className="flex flex-col" key={method.id}>
                    <span className="inter-small-regular text-grey-50">
                      Tarneviis
                    </span>
                    <span className="inter-small-regular text-grey-90 mt-2">
                      {method?.shipping_option.name || ""}
                    </span>
                    <div className="bg-grey-5 mt-8 flex h-full min-h-[100px] flex-col px-3 py-2">
                      <span className="inter-base-semibold">
                      Andmed{" "}
                        <span className="text-grey-50 inter-base-regular">
                          (1 toode)
                        </span>
                      </span>
                      <div className="mt-4 flex flex-grow items-center">
                        <JSONView data={method?.data} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </BodyCard>
            <BodyCard
              className={"mb-4 h-auto min-h-0 w-full"}
              title="Klient"
              actionables={[
                {
                  label: "Redigeeri tarneaadressi",
                  icon: <TruckIcon size={"20"} />,
                  onClick: () =>
                    setAddressModal({
                      address: cart?.shipping_address,
                      type: AddressType.SHIPPING,
                    }),
                },
                {
                  label: "Muuda arveldusaadressi",
                  icon: <DollarSignIcon size={"20"} />,
                  onClick: () => {
                    if (cart?.billing_address) {
                      setAddressModal({
                        address: cart?.billing_address,
                        type: AddressType.BILLING,
                      })
                    }
                  },
                },
                {
                  label: "Minge kliendi juurde",
                  icon: <DetailsIcon size={"20"} />, // TODO: Change to Contact icon
                  onClick: () => navigate(`/a/customers/${cart?.customer.id}`),
                },
              ]}
            >
              <div className="mt-6">
                <div className="flex w-full items-center space-x-4">
                  <div className="flex h-[40px] w-[40px] ">
                    <Avatar
                      user={cart?.customer}
                      font="inter-large-semibold"
                      color="bg-grey-80"
                    />
                  </div>
                  <div>
                    <h1 className="inter-large-semibold text-grey-90">
                      {extractCustomerName(cart)}
                    </h1>
                    {cart?.shipping_address && (
                      <span className="inter-small-regular text-grey-50">
                        {cart.shipping_address.city},{" "}
                        {
                          isoAlpha2Countries[
                            cart.shipping_address.country_code?.toUpperCase()
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
                      <span>{cart?.email}</span>
                      <span>{cart?.shipping_address?.phone || ""}</span>
                    </div>
                  </div>
                  <FormattedAddress
                    title={"Tarne"}
                    addr={cart?.shipping_address || undefined}
                  />
                  <FormattedAddress
                    title={"Arveldamine"}
                    addr={cart?.billing_address || undefined}
                  />
                </div>
              </div>
            </BodyCard>
            <BodyCard
              className={"mb-4 h-auto min-h-0 w-full pt-[15px]"}
              title="Töötlemata tellimuse eelnõu"
            >
              <JSONView data={draft_order!} />
            </BodyCard>
          </div>
        </div>
      )}
      {addressModal && (
        <AddressModal
          onClose={() => setAddressModal(null)}
          onSave={updateOrder.mutate}
          address={addressModal.address}
          type={addressModal.type}
          allowedCountries={region?.countries}
        />
      )}
      {/* An attempt to make a reusable delete prompt, so we don't have to hold +10
      state variables for showing different prompts */}
      {deletePromptData.show && (
        <DeletePrompt
          text={"Oled sa kindel?"}
          heading={`Eemalda ${deletePromptData?.resource}`}
          successText={`${
            deletePromptData?.resource || "Ressurss"
          } on eemaldatud`}
          onDelete={() => deletePromptData.onDelete()}
          handleClose={() => setDeletePromptData(initDeleteState)}
        />
      )}

      {showMarkAsPaidConfirmation && (
        <ConfirmationPrompt
          heading="Märgi tasutuks"
          text="See loob tellimuse. Märkige see tasutuks, kui olete makse kätte saanud."
          confirmText="Märgi tasutuks"
          cancelText="Tühista"
          handleClose={() => setShowAsPaidConfirmation(false)}
          onConfirm={onMarkAsPaidConfirm}
        />
      )}
    </div>
  )
}

export default DraftOrderDetails
