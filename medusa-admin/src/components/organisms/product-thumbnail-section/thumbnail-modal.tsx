import { Product } from "@medusajs/medusa"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import useEditProductActions from "../../../hooks/use-edit-product-actions"
import useNotification from "../../../hooks/use-notification"
import { FormImage } from "../../../types/shared"
import { prepareImages } from "../../../utils/images"
import { nestedForm } from "../../../utils/nested-form"
import ThumbnailForm, {
  ThumbnailFormType,
} from "../../forms/product/thumbnail-form"
import Button from "../../fundamentals/button"
import Modal from "../../molecules/modal"

type Props = {
  product: Product
  open: boolean
  onClose: () => void
}

type ThumbnailFormWrapper = {
  thumbnail: ThumbnailFormType
}

const ThumbnailModal = ({ product, open, onClose }: Props) => {
  const { onUpdate, updating } = useEditProductActions(product.id)
  const form = useForm<ThumbnailFormWrapper>({
    defaultValues: getDefaultValues(product),
  })

  const {
    formState: { isDirty },
    handleSubmit,
    reset,
  } = form

  const notification = useNotification()

  useEffect(() => {
    reset(getDefaultValues(product))
  }, [product, reset])

  const onReset = () => {
    reset(getDefaultValues(product))
    onClose()
  }

  const onSubmit = handleSubmit(async (data) => {
    let preppedImages: FormImage[] = []

    try {
      preppedImages = await prepareImages(data.thumbnail.images)
    } catch (error) {
      let errorMessage =
        "Midagi läks pisipildi üleslaadimisel valesti."
      const response = (error as any).response as Response

      if (response.status === 500) {
        errorMessage =
          errorMessage +
          " " +
          "Teil ei pruugi olla failiteenust konfigureeritud. Võtke ühendust oma administraatoriga"
      }

      notification("Viga", errorMessage, "error")
      return
    }
    const url = preppedImages?.[0]?.url

    onUpdate(
      {
        // @ts-ignore
        thumbnail: url || null,
      },
      onReset
    )
  })

  return (
    <Modal open={open} handleClose={onReset} isLargeModal>
      <Modal.Body>
        <Modal.Header handleClose={onReset}>
          <h1 className="inter-xlarge-semibold m-0">Laadi üles pisipilt</h1>
        </Modal.Header>
        <form onSubmit={onSubmit}>
          <Modal.Content>
            <h2 className="inter-large-semibold mb-2xsmall">Pisipilt</h2>
            <p className="inter-base-regular text-grey-50 mb-large">
              Kasutatakse teie toote esindamiseks kassas, suhtluses jagamise ja muu ajal.
            </p>
            <ThumbnailForm form={nestedForm(form, "thumbnail")} />
          </Modal.Content>
          <Modal.Footer>
            <div className="flex w-full justify-end gap-x-2">
              <Button
                size="small"
                variant="secondary"
                type="button"
                onClick={onReset}
              >
                Tühista
              </Button>
              <Button
                size="small"
                variant="primary"
                type="submit"
                disabled={!isDirty}
                loading={updating}
              >
                Salvesta ja sulge
              </Button>
            </div>
          </Modal.Footer>
        </form>
      </Modal.Body>
    </Modal>
  )
}

const getDefaultValues = (product: Product): ThumbnailFormWrapper => {
  return {
    thumbnail: {
      images: product.thumbnail
        ? [
            {
              url: product.thumbnail,
            },
          ]
        : [],
    },
  }
}

export default ThumbnailModal
