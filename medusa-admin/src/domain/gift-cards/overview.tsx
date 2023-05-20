import { Product } from "@medusajs/medusa"
import {
  useAdminDeleteProduct,
  useAdminProducts,
  useAdminStore,
  useAdminUpdateProduct,
} from "medusa-react"
import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import PageDescription from "../../components/atoms/page-description"
import Spacer from "../../components/atoms/spacer"
import Spinner from "../../components/atoms/spinner"
import PlusIcon from "../../components/fundamentals/icons/plus-icon"
import BannerCard from "../../components/molecules/banner-card"
import BodyCard from "../../components/organisms/body-card"
import DeletePrompt from "../../components/organisms/delete-prompt"
import GiftCardBanner from "../../components/organisms/gift-card-banner"
import GiftCardTable from "../../components/templates/gift-card-table"
import useNotification from "../../hooks/use-notification"
import useToggleState from "../../hooks/use-toggle-state"
import { ProductStatus } from "../../types/shared"
import { getErrorMessage } from "../../utils/error-messages"
import CustomGiftcard from "./custom-giftcard"
import NewGiftCard from "./new"

const Overview = () => {
  const { products, isLoading } = useAdminProducts({
    is_giftcard: true,
  })
  const { store } = useAdminStore()
  const [showCreate, setShowCreate] = useState(false)

  const giftCard = products?.[0]

  const navigate = useNavigate()
  const notification = useNotification()
  const updateGiftCard = useAdminUpdateProduct(giftCard?.id!)
  const deleteGiftCard = useAdminDeleteProduct(giftCard?.id!)

  const {
    state: stateCustom,
    close: closeCustom,
    open: openCustom,
  } = useToggleState()

  const { state: stateNew, close: closeNew, open: openNew } = useToggleState()

  const {
    state: stateDelete,
    close: closeDelete,
    open: openDelete,
  } = useToggleState()

  const onUpdate = () => {
    let status: ProductStatus = ProductStatus.PUBLISHED
    if (giftCard?.status === "published") {
      status = ProductStatus.DRAFT
    }

    updateGiftCard.mutate(
      { status },
      {
        onSuccess: () =>
          notification("Õnnestus", "Kinkekaardi värskendamine õnnestus", "success"),
        onError: (err) => notification("Viga", getErrorMessage(err), "error"),
      }
    )
  }

  const onDelete = () => {
    deleteGiftCard.mutate(undefined, {
      onSuccess: () => {
        navigate("/a/gift-cards")
      },
    })
  }

  const actionables = [
    {
      label: "Kohandatud kinkekaart",
      onClick: openCustom,
      icon: <PlusIcon size={20} />,
    },
  ]

  const giftCardWithCurrency = useMemo(() => {
    if (!giftCard || !store) {
      return null
    }

    return {
      ...(giftCard as Product),
      defaultCurrency: store.default_currency_code,
    }
  }, [giftCard, store])

  return (
    <>
      <div className="flex flex-col">
        <PageDescription
          title="Kinkekaardid"
          subtitle="Hallake oma poe kinkekaarte"
        />
        {!isLoading ? (
          <div className="gap-y-xsmall flex flex-col">
            {giftCardWithCurrency ? (
              <GiftCardBanner
                {...giftCardWithCurrency}
                onDelete={openDelete}
                onEdit={() => navigate("/a/gift-cards/manage")}
                onUnpublish={onUpdate}
              />
            ) : (
              <BannerCard title="Kas olete valmis müüma oma esimest kinkekaarti?">
                <BannerCard.Description
                  cta={{
                    label: "Loo kinkekaart",
                    onClick: () => setShowCreate(true),
                  }}
                >
                 Kinkekaarti pole veel lisatud.
                </BannerCard.Description>
              </BannerCard>
            )}

            <BodyCard
              title="Ajalugu"
              subtitle="Vaata ostetud kinkekaartide ajalugu"
              actionables={actionables}
            >
              <GiftCardTable />
            </BodyCard>
          </div>
        ) : (
          <div className="rounded-rounded border-grey-20 flex h-44 w-full items-center justify-center border">
            <Spinner variant="secondary" size="large" />
          </div>
        )}
      </div>

      <CustomGiftcard onClose={closeCustom} open={stateCustom} />

      {showCreate && <NewGiftCard onClose={() => setShowCreate(!showCreate)} />}

      {stateDelete && (
        <DeletePrompt
          handleClose={closeDelete}
          onDelete={async () => onDelete()}
          successText="Kinkekaardi kustutamine õnnestus"
          confirmText="Jah, kustuta"
          heading="Kustuta kinkekaart"
        />
      )}
      <Spacer />
    </>
  )
}

export default Overview
