import { useAdminGiftCard, useAdminUpdateGiftCard } from "medusa-react"
import { format } from 'date-fns'
import { et } from 'date-fns/locale'
import { useParams } from "react-router-dom"
import BackButton from "../../../components/atoms/back-button"
import Spinner from "../../../components/atoms/spinner"
import DollarSignIcon from "../../../components/fundamentals/icons/dollar-sign-icon"
import EditIcon from "../../../components/fundamentals/icons/edit-icon"
import StatusSelector from "../../../components/molecules/status-selector"
import BodyCard from "../../../components/organisms/body-card"
import RawJSON from "../../../components/organisms/raw-json"
import useNotification from "../../../hooks/use-notification"
import useToggleState from "../../../hooks/use-toggle-state"
import { getErrorMessage } from "../../../utils/error-messages"
import { formatAmountWithSymbol } from "../../../utils/prices"
import EditGiftCardModal from "./edit-gift-card-modal"
import UpdateBalanceModal from "./update-balance-modal"

const GiftCardDetails = () => {
  const { id } = useParams()

  const { gift_card: giftCard, isLoading } = useAdminGiftCard(id!, {
    enabled: !!id,
  })

  const updateGiftCard = useAdminUpdateGiftCard(giftCard?.id!)

  const notification = useNotification()

  const {
    state: editState,
    open: openEdit,
    close: closeEdit,
  } = useToggleState()

  const {
    state: balanceState,
    open: openBalance,
    close: closeBalance,
  } = useToggleState()

  const actions = [
    {
      label: "Redigeeri üksikasju",
      onClick: openEdit,
      icon: <EditIcon size={20} />,
    },
    {
      label: "Saldo värskendamine",
      onClick: openBalance,
      icon: <DollarSignIcon size={20} />,
    },
  ]

  const updateStatus = (data: { is_disabled?: boolean }) => {
    updateGiftCard.mutate(
      { is_disabled: data.is_disabled },
      {
        onSuccess: () => {
          notification(
            "Värskendatud olek",
            "Kinkekaardi oleku värskendamine õnnestus",
            "success"
          )
        },
        onError: (err) => notification("Error", getErrorMessage(err), "error"),
      }
    )
  }

  return (
    <div>
      <BackButton
        label="Tagasi kinkekaartide juurde"
        path="/a/gift-cards"
        className="mb-xsmall"
      />
      {isLoading || !giftCard ? (
        <div className="bg-grey-0 border-grey-20 rounded-rounded py-xlarge flex w-full items-center justify-center border">
          <Spinner size={"large"} variant={"secondary"} />
        </div>
      ) : (
        <>
          <div className="gap-y-xsmall flex flex-col">
            <BodyCard
              className={"h-auto min-h-0 w-full"}
              title={`${giftCard?.code}`}
              status={
                <StatusSelector
                  isDraft={!!giftCard?.is_disabled}
                  activeState={"Aktiivne"}
                  draftState={"Keelatud"}
                  onChange={() =>
                    updateStatus({ is_disabled: !giftCard.is_disabled })
                  }
                />
              }
              actionables={actions}
            >
              <div className="flex justify-between">
                <div className="flex space-x-6 divide-x">
                  <div className="flex flex-col">
                    <div className="inter-smaller-regular text-grey-50 mb-1">
                    Algne summa
                    </div>
                    <div>
                      {formatAmountWithSymbol({
                        amount: giftCard.value,
                        currency: giftCard.region.currency_code,
                      })}
                    </div>
                  </div>
                  <div className="flex flex-col pl-6">
                    <div className="inter-smaller-regular text-grey-50 mb-1">
                      Saldo
                    </div>
                    <div>
                      {formatAmountWithSymbol({
                        amount: giftCard.balance,
                        currency: giftCard.region.currency_code,
                      })}
                    </div>
                  </div>
                  <div className="flex flex-col pl-6">
                    <div className="inter-smaller-regular text-grey-50 mb-1">
                      Piirkond
                    </div>
                    <div>{giftCard.region.name}</div>
                  </div>
                  {giftCard.ends_at && (
                    <div className="flex flex-col pl-6">
                      <div className="inter-smaller-regular text-grey-50 mb-1">
                      Aegub
                      </div>
                      <div>
                        {format(new Date(giftCard.ends_at), 'dd MMM yyyy', { locale: et })}
                      </div>
                    </div>
                  )}
                  <div className="flex flex-col pl-6">
                    <div className="inter-smaller-regular text-grey-50 mb-1">
                    Loodud
                    </div>
                    <div>
                      {format(new Date(giftCard.ends_at), 'dd MMM yyyy', { locale: et })}
                    </div>
                  </div>
                </div>
              </div>
            </BodyCard>
            <RawJSON data={giftCard} title="Töötlemata kinkekaart" />
          </div>

          <UpdateBalanceModal
            giftCard={giftCard}
            onClose={closeBalance}
            open={balanceState}
          />

          <EditGiftCardModal
            onClose={closeEdit}
            open={editState}
            giftCard={giftCard}
          />
        </>
      )}
    </div>
  )
}

export default GiftCardDetails
