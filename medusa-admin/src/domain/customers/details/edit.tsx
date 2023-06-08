import { Customer } from "@medusajs/medusa"
import { useAdminUpdateCustomer } from "medusa-react"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import MetadataForm, {
  getMetadataFormValues,
  getSubmittableMetadata,
  MetadataFormType,
} from "../../../components/forms/general/metadata-form"
import Button from "../../../components/fundamentals/button"
import LockIcon from "../../../components/fundamentals/icons/lock-icon"
import InputField from "../../../components/molecules/input"
import Modal from "../../../components/molecules/modal"
import useNotification from "../../../hooks/use-notification"
import { getErrorMessage } from "../../../utils/error-messages"
import { nestedForm } from "../../../utils/nested-form"
import { validateEmail } from "../../../utils/validate-email"

type EditCustomerModalProps = {
  customer: Customer
  handleClose: () => void
}

type EditCustomerFormType = {
  first_name: string
  last_name: string
  email: string
  phone: string | null
  metadata: MetadataFormType
}

const EditCustomerModal = ({
  handleClose,
  customer,
}: EditCustomerModalProps) => {
  const form = useForm<EditCustomerFormType>({
    defaultValues: getDefaultValues(customer),
  })

  const {
    register,
    reset,
    handleSubmit,
    formState: { isDirty },
  } = form

  const notification = useNotification()

  const updateCustomer = useAdminUpdateCustomer(customer.id)

  const onSubmit = handleSubmit((data) => {
    updateCustomer.mutate(
      {
        first_name: data.first_name,
        last_name: data.last_name,
        // @ts-ignore
        phone: data.phone,
        email: data.email,
        metadata: getSubmittableMetadata(data.metadata),
      },
      {
        onSuccess: () => {
          handleClose()
          notification("Õnnestus", "Kliendi värskendamine õnnestus", "success")
        },
        onError: (err) => {
          handleClose()
          notification("Viga", getErrorMessage(err), "error")
        },
      }
    )
  })

  useEffect(() => {
    reset(getDefaultValues(customer))
  }, [customer])

  return (
    <Modal handleClose={handleClose}>
      <Modal.Body>
        <Modal.Header handleClose={handleClose}>
          <span className="inter-xlarge-semibold">Kliendi üksikasjad</span>
        </Modal.Header>
        <Modal.Content>
          <div className="gap-y-xlarge flex flex-col">
            <div>
              <h2 className="inter-base-semibold text-grey-90 mb-4">Üldine</h2>
              <div className="flex w-full space-x-2">
                <InputField
                  label="Eesnimi"
                  {...register("first_name")}
                  placeholder="Lebron"
                />
                <InputField
                  label="Perekonnanimi"
                  {...register("last_name")}
                  placeholder="James"
                />
              </div>
            </div>
            <div>
              <h2 className="inter-base-semibold text-grey-90 mb-4">Kontakt</h2>
              <div className="flex space-x-2">
                <InputField
                  label="Mail"
                  {...register("email", {
                    validate: (value) => !!validateEmail(value),
                    disabled: customer.has_account,
                  })}
                  prefix={
                    customer.has_account && (
                      <LockIcon size={16} className="text-grey-50" />
                    )
                  }
                  disabled={customer.has_account}
                />
                <InputField
                  label="Telefon"
                  {...register("phone")}
                  placeholder="+45 42 42 42 42"
                />
              </div>
            </div>
            <div>
              <h2 className="inter-base-semibold mb-base">Metaandmed</h2>
              <MetadataForm form={nestedForm(form, "metadata")} />
            </div>
          </div>
        </Modal.Content>
        <Modal.Footer>
          <div className="flex w-full justify-end">
            <Button
              variant="secondary"
              size="small"
              onClick={handleClose}
              className="mr-2"
              type="button"
            >
              Tühista
            </Button>
            <Button
              loading={updateCustomer.isLoading}
              disabled={!isDirty || updateCustomer.isLoading}
              variant="primary"
              size="small"
              onClick={onSubmit}
            >
              Salvesta ja sule
            </Button>
          </div>
        </Modal.Footer>
      </Modal.Body>
    </Modal>
  )
}

const getDefaultValues = (customer: Customer): EditCustomerFormType => {
  return {
    first_name: customer.first_name,
    email: customer.email,
    last_name: customer.last_name,
    phone: customer.phone,
    metadata: getMetadataFormValues(customer.metadata),
  }
}

export default EditCustomerModal
