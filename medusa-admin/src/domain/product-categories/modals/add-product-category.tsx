import { useState } from "react"

import { ProductCategory } from "@medusajs/medusa"
import {
  adminProductCategoryKeys,
  useAdminCreateProductCategory,
} from "medusa-react"

import { useQueryClient } from "@tanstack/react-query"
import Button from "../../../components/fundamentals/button"
import CrossIcon from "../../../components/fundamentals/icons/cross-icon"
import InputField from "../../../components/molecules/input"
import TextArea from "../../../components/molecules/textarea"
import FocusModal from "../../../components/molecules/modal/focus-modal"
import { NextSelect } from "../../../components/molecules/select/next-select"
import useNotification from "../../../hooks/use-notification"
import { getErrorMessage } from "../../../utils/error-messages"
import TreeCrumbs from "../components/tree-crumbs"

const visibilityOptions = [
  {
    label: "Avalik",
    value: "public",
  },
  { label: "Privaatne", value: "private" },
]

const statusOptions = [
  { label: "Aktiivne", value: "active" },
  { label: "Mitteaktiivne", value: "inactive" },
]

type CreateProductCategoryProps = {
  closeModal: () => void
  parentCategory?: ProductCategory
}

/**
 * Focus modal container for creating Publishable Keys.
 */
function CreateProductCategory(props: CreateProductCategoryProps) {
  const { closeModal, parentCategory, categories } = props
  const notification = useNotification()
  const queryClient = useQueryClient()

  const [name, setName] = useState("")
  const [handle, setHandle] = useState("")
  const [description, setDescription] = useState("")
  const [isActive, setIsActive] = useState(true)
  const [isPublic, setIsPublic] = useState(true)

  const { mutateAsync: createProductCategory } = useAdminCreateProductCategory()

  const onSubmit = async () => {
    try {
      await createProductCategory({
        name,
        handle,
        description,
        is_active: isActive,
        is_internal: !isPublic,
        parent_category_id: parentCategory?.id ?? null,
      })
      // TODO: temporary here, investigate why `useAdminCreateProductCategory` doesn't invalidate this
      await queryClient.invalidateQueries(adminProductCategoryKeys.lists())
      closeModal()
      notification("Õnnestus", "Kategooria loomine õnnestus", "success")
    } catch (e) {
      const errorMessage =
        getErrorMessage(e) || "Uue kategooria loomine ebaõnnestus"
      notification("Viga", errorMessage, "error")
    }
  }

  return (
    <FocusModal>
      <FocusModal.Header>
        <div className="medium:w-8/12 flex w-full justify-between px-8">
          <Button size="small" variant="ghost" onClick={closeModal}>
            <CrossIcon size={20} />
          </Button>
          <div className="gap-x-small flex">
            <Button
              size="small"
              variant="primary"
              onClick={onSubmit}
              disabled={!name}
              className="rounded-rounded"
            >
              Salvesta kategooria
            </Button>
          </div>
        </div>
      </FocusModal.Header>

      <FocusModal.Main className="no-scrollbar flex w-full justify-center">
        <div className="small:w-4/5 medium:w-7/12 large:w-6/12 my-16 max-w-[700px]">
          <h1 className="inter-xlarge-semibold text-grey-90 pb-6">
            Lisa kategooria {parentCategory && `to ${parentCategory.name}`}
          </h1>

          {parentCategory && (
            <div className="mb-6">
              <TreeCrumbs
                nodes={categories}
                currentNode={parentCategory}
                showPlaceholder={true}
                placeholderText={name || "Uus"}
              />
            </div>
          )}

          <h4 className="inter-large-semibold text-grey-90 pb-1">Üksikasjad</h4>

          <div className="mb-8 flex justify-between gap-6">
            <InputField
              required
              label="Nimi"
              type="string"
              name="name"
              value={name}
              className="w-[338px]"
              placeholder="Andke sellele kategooriale nimi"
              onChange={(ev) => setName(ev.target.value)}
            />

            <InputField
              label="Käepide"
              type="string"
              name="handle"
              value={handle}
              className="w-[338px]"
              placeholder="Kohandatud käepide"
              onChange={(ev) => setHandle(ev.target.value)}
            />
          </div>

          <div className="mb-8">
            <TextArea
              label="Kirjeldus"
              name="description"
              value={description}
              placeholder="Kirjeldage seda kategooriat"
              onChange={(ev) => setDescription(ev.target.value)}
            />
          </div>

          <div className="mb-8 flex justify-between gap-6">
            <div className="flex-1">
              <NextSelect
                label="Olek"
                options={statusOptions}
                value={statusOptions[isActive ? 0 : 1]}
                onChange={(o) => setIsActive(o.value === "active")}
              />
            </div>

            <div className="flex-1">
              <NextSelect
                label="Nähtavus"
                options={visibilityOptions}
                value={visibilityOptions[isPublic ? 0 : 1]}
                onChange={(o) => setIsPublic(o.value === "public")}
              />
            </div>
          </div>
        </div>
      </FocusModal.Main>
    </FocusModal>
  )
}

export default CreateProductCategory
