import { ProductCollection } from "@medusajs/medusa"
import {
  useAdminCreateCollection,
  useAdminUpdateCollection,
} from "medusa-react"
import React, { useEffect } from "react"
import { useForm } from "react-hook-form"
import useNotification from "../../../hooks/use-notification"
import { getErrorMessage } from "../../../utils/error-messages"
import { nestedForm } from "../../../utils/nested-form"
import MetadataForm, {
  getSubmittableMetadata,
  MetadataFormType,
} from "../../forms/general/metadata-form"
import Button from "../../fundamentals/button"
import IconTooltip from "../../molecules/icon-tooltip"
import InputField from "../../molecules/input"
import Modal from "../../molecules/modal"
import { MetadataField } from "../../organisms/metadata"

type CollectionModalProps = {
  onClose: () => void
  onSubmit: (values: any, metadata: MetadataField[]) => void
  isEdit?: boolean
  collection?: ProductCollection
}

type CollectionModalFormData = {
  title: string
  handle: string | undefined
  metadata: MetadataFormType
}

const CollectionModal: React.FC<CollectionModalProps> = ({
  onClose,
  isEdit = false,
  collection,
}) => {
  const { mutate: update, isLoading: updating } = useAdminUpdateCollection(
    collection?.id!
  )
  const { mutate: create, isLoading: creating } = useAdminCreateCollection()

  const form = useForm<CollectionModalFormData>({
    defaultValues: {
      title: collection?.title,
      handle: collection?.handle,
      metadata: {
        entries: Object.entries(collection?.metadata || {}).map(
          ([key, value]) => ({
            key,
            value: value as string,
            state: "existing",
          })
        ),
      },
    },
  })
  const { register, handleSubmit, reset } = form

  useEffect(() => {
    if (collection) {
      reset({
        title: collection.title,
        handle: collection.handle,
        metadata: {
          entries: Object.entries(collection.metadata || {}).map(
            ([key, value]) => ({
              key,
              value: value as string,
              state: "existing",
            })
          ),
        },
      })
    }
  }, [collection, reset])

  const notification = useNotification()

  if (isEdit && !collection) {
    throw new Error("Kollektsioon on vajalik muutmiseks")
  }

  const submit = (data: CollectionModalFormData) => {
    if (isEdit) {
      update(
        {
          title: data.title,
          handle: data.handle,
          metadata: getSubmittableMetadata(data.metadata),
        },
        {
          onSuccess: () => {
            notification(
              "Õnnestus",
              "Kogu edukalt värskendatud",
              "success"
            )
            onClose()
          },
          onError: (error) => {
            notification("Error", getErrorMessage(error), "error")
          },
        }
      )
    } else {
      create(
        {
          title: data.title,
          handle: data.handle,
          metadata: getSubmittableMetadata(data.metadata),
        },
        {
          onSuccess: () => {
            notification(
              "Õnnestus",
              "Kogu edukalt loodud",
              "success"
            )
            onClose()
          },
          onError: (error) => {
            notification("Error", getErrorMessage(error), "error")
          },
        }
      )
    }
  }

  return (
    <Modal handleClose={onClose} isLargeModal>
      <Modal.Body>
        <Modal.Header handleClose={onClose}>
          <div>
            <h1 className="inter-xlarge-semibold mb-2xsmall">
              {isEdit ? "Muuda kollektsiooni" : "Loo kollektsioon"}
            </h1>
            <p className="inter-small-regular text-grey-50">
              Kollektsiooni loomiseks on vaja ainult pealkirja ja käepidet.
            </p>
          </div>
        </Modal.Header>
        <form onSubmit={handleSubmit(submit)}>
          <Modal.Content>
            <div>
              <h2 className="inter-base-semibold mb-base">Detailid</h2>
              <div className="gap-x-base flex items-center">
                <InputField
                  label="Pealkiri"
                  required
                  placeholder="Sunglasses"
                  {...register("title", { required: true })}
                />
                <InputField
                  label="Käepide"
                  placeholder="sunglasses"
                  {...register("handle")}
                  prefix="/"
                  tooltip={
                    <IconTooltip content="URL Slug kogu jaoks. Kui jätate tühjaks, luuakse see automaatselt." />
                  }
                />
              </div>
            </div>
            <div className="mt-xlarge">
              <h2 className="inter-base-semibold mb-base">Metaandmed</h2>
              <MetadataForm form={nestedForm(form, "metadata")} />
            </div>
          </Modal.Content>
          <Modal.Footer>
            <div className="gap-x-xsmall flex w-full items-center justify-end">
              <Button
                variant="secondary"
                size="small"
                type="button"
                onClick={onClose}
              >
                Loobu
              </Button>
              <Button
                variant="primary"
                size="small"
                loading={isEdit ? updating : creating}
              >
                {`${isEdit ? "Salvesta" : "Avalda"} kollektsioon`}
              </Button>
            </div>
          </Modal.Footer>
        </form>
      </Modal.Body>
    </Modal>
  )
}

export default CollectionModal
