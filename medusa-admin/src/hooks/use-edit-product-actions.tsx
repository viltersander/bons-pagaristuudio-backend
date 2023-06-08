import {
  AdminPostProductsProductReq,
  AdminPostProductsProductVariantsReq,
  AdminPostProductsProductVariantsVariantReq,
  Product,
} from "@medusajs/medusa"
import {
  useAdminCreateVariant,
  useAdminDeleteProduct,
  useAdminDeleteVariant,
  useAdminProduct,
  useAdminUpdateProduct,
  useAdminUpdateVariant,
} from "medusa-react"

import { useNavigate } from "react-router-dom"
import { getErrorMessage } from "../utils/error-messages"
import { removeNullish } from "../utils/remove-nullish"
import useImperativeDialog from "./use-imperative-dialog"
import useNotification from "./use-notification"

const useEditProductActions = (productId: string) => {
  const dialog = useImperativeDialog()
  const navigate = useNavigate()
  const notification = useNotification()
  const getProduct = useAdminProduct(productId)
  const updateProduct = useAdminUpdateProduct(productId)
  const deleteProduct = useAdminDeleteProduct(productId)
  const updateVariant = useAdminUpdateVariant(productId)
  const deleteVariant = useAdminDeleteVariant(productId)
  const addVariant = useAdminCreateVariant(productId)

  const onDelete = async () => {
    const shouldDelete = await dialog({
      heading: "Kustuta toode",
      text: "Kas olete kindel, et soovite selle toote kustutada?",
    })
    if (shouldDelete) {
      deleteProduct.mutate(undefined, {
        onSuccess: () => {
          notification("Õnnestus", "Toote kustutamine õnnestus", "success")
          navigate("/a/products/")
        },
        onError: (err) => {
          notification("Viga", getErrorMessage(err), "error")
        },
      })
    }
  }

  const onAddVariant = (
    payload: AdminPostProductsProductVariantsReq,
    onSuccess: (variantRes: Product) => void,
    successMessage = "Variant loodi edukalt"
  ) => {
    addVariant.mutate(payload, {
      onSuccess: (data) => {
        notification("Õnnestus", successMessage, "success")
        getProduct.refetch()
        onSuccess(data.product)
      },
      onError: (err) => {
        notification("Viga", getErrorMessage(err), "error")
      },
    })
  }

  const onUpdateVariant = (
    id: string,
    payload: Partial<AdminPostProductsProductVariantsVariantReq>,
    onSuccess: () => void,
    successMessage = "Variandi värskendamine õnnestus"
  ) => {
    updateVariant.mutate(
      {
        variant_id: id,
        ...removeNullish(payload),
        manage_inventory: payload.manage_inventory,
      },
      {
        onSuccess: () => {
          notification("Õnnestus", successMessage, "success")
          getProduct.refetch()
          onSuccess()
        },
        onError: (err) => {
          notification("Viga", getErrorMessage(err), "error")
        },
      }
    )
  }

  const onDeleteVariant = (
    variantId: string,
    onSuccess?: () => void,
    successMessage = "Variant on edukalt kustutatud"
  ) => {
    deleteVariant.mutate(variantId, {
      onSuccess: () => {
        notification("Õnnestus", successMessage, "success")
        getProduct.refetch()
        if (onSuccess) {
          onSuccess()
        }
      },
      onError: (err) => {
        notification("Viga", getErrorMessage(err), "error")
      },
    })
  }

  const onUpdate = (
    payload: Partial<AdminPostProductsProductReq>,
    onSuccess: () => void,
    successMessage = "Toote värskendamine õnnestus"
  ) => {
    updateProduct.mutate(
      // @ts-ignore TODO fix images being required
      payload,
      {
        onSuccess: () => {
          notification("Õnnestus", successMessage, "success")
          onSuccess()
        },
        onError: (err) => {
          notification("Viga", getErrorMessage(err), "error")
        },
      }
    )
  }

  const onStatusChange = (currentStatus: string) => {
    const newStatus = currentStatus === "published" ? "draft" : "published"
    updateProduct.mutate(
      {
        // @ts-ignore TODO fix update type in API
        status: newStatus,
      },
      {
        onSuccess: () => {
          const pastTense = newStatus === "published" ? "published" : "drafted"
          notification(
            "Õnnestus",
            `Toode ${pastTense} õnnestus`,
            "success"
          )
        },
        onError: (err) => {
          notification("Viga", getErrorMessage(err), "error")
        },
      }
    )
  }

  return {
    getProduct,
    onDelete,
    onStatusChange,
    onUpdate,
    onAddVariant,
    onUpdateVariant,
    onDeleteVariant,
    updating: updateProduct.isLoading,
    deleting: deleteProduct.isLoading,
    addingVariant: addVariant.isLoading,
    updatingVariant: updateVariant.isLoading,
    deletingVariant: deleteVariant.isLoading,
  }
}

export default useEditProductActions
