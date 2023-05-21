import { useEffect, useState } from "react"

import { BatchJob } from "@medusajs/medusa"
import {
  useAdminBatchJob,
  useAdminCancelBatchJob,
  useAdminConfirmBatchJob,
  useAdminCreateBatchJob,
  useAdminDeleteFile,
  useAdminUploadProtectedFile,
} from "medusa-react"

import UploadModal from "../../../components/organisms/upload-modal"
import useNotification from "../../../hooks/use-notification"
import { usePolling } from "../../../providers/polling-provider"

/**
 * Hook returns a batch job. The endpoint is polled every 2s while the job is processing.
 */
function useImportBatchJob(batchJobId?: string) {
  const [batchJob, setBatchJob] = useState<BatchJob>()

  const isBatchJobProcessing =
    batchJob?.status === "created" || batchJob?.status === "confirmed"

  const { batch_job } = useAdminBatchJob(batchJobId!, {
    enabled: !!batchJobId,
    refetchInterval: isBatchJobProcessing ? 2000 : false,
  })

  useEffect(() => {
    setBatchJob(batch_job)
  }, [batch_job])

  return batchJob
}

/**
 * Import products container interface.
 */
type ImportProductsProps = {
  handleClose: () => void
}

/**
 * Product import modal container.
 */
function ImportProducts(props: ImportProductsProps) {
  const [fileKey, setFileKey] = useState()
  const [batchJobId, setBatchJobId] = useState()

  const notification = useNotification()

  const { resetInterval } = usePolling()

  const { mutateAsync: deleteFile } = useAdminDeleteFile()
  const { mutateAsync: uploadFile } = useAdminUploadProtectedFile()

  const { mutateAsync: createBatchJob } = useAdminCreateBatchJob()
  const { mutateAsync: cancelBathJob } = useAdminCancelBatchJob(batchJobId!)
  const { mutateAsync: confirmBatchJob } = useAdminConfirmBatchJob(batchJobId!)

  const batchJob = useImportBatchJob(batchJobId)

  const isUploaded = !!fileKey
  const isPreprocessed = !!batchJob?.result
  const hasError = batchJob?.status === "failed"

  const progress = isPreprocessed
    ? batchJob!.result.advancement_count / batchJob!.result.count
    : undefined

  const status = hasError
    ? "Töötlemisel ilmnes viga"
    : isPreprocessed
    ? undefined
    : isUploaded
    ? "Eeltöötlus..."
    : "Üleslaadimine..."

  /**
   * Confirm job on submit.
   */
  const onSubmit = async () => {
    await confirmBatchJob()
    notification(
      "Õnnestus",
      "Import kinnitati töötlemiseks. Edenemisteave on saadaval tegevuste sahtlis.",
      "success"
    )
    props.handleClose()
  }

  /**
   * Upload file and use returned file key to create a batch job.
   */
  const processUpload = async (file: File) => {
    try {
      const res = await uploadFile(file as any)
      const _fileKey = res.uploads[0].key
      setFileKey(_fileKey)

      const batchJob = await createBatchJob({
        dry_run: true,
        context: { fileKey: _fileKey },
        type: "product-import",
      })

      resetInterval()

      setBatchJobId(batchJob.batch_job.id)
    } catch (e) {
      notification("Viga", "Import ebaõnnestus.", "error")
      if (fileKey) {
        await deleteFile({ file_key: fileKey })
      }
    }
  }

  /**
   * Returns create/update counts from stat descriptor.
   */
  const getSummary = () => {
    if (!batchJob) {
      return undefined
    }

    const res = batchJob.result?.stat_descriptors?.[0].message.match(/\d+/g)

    if (!res) {
      return undefined
    }

    return {
      toCreate: Number(res[0]),
      toUpdate: Number(res[1]),
    }
  }

  /**
   * When file upload is removed, delete file from the bucket and cancel batch job.
   */
  const onFileRemove = async () => {
    if (fileKey) {
      try {
        deleteFile({ file_key: fileKey })
      } catch (e) {
        notification("Viga", "CSV-faili kustutamine ebaõnnestus", "error")
      }
    }

    try {
      cancelBathJob()
    } catch (e) {
      notification("Viga", "Pakktöö tühistamine ebaõnnestus", "error")
    }

    setBatchJobId(undefined)
  }

  /**
   * Cleanup file if batch job isn't confirmed.
   */
  const onClose = () => {
    props.handleClose()
    if (
      !["confirmed", "completed", "canceled", "failed"].includes(
        batchJob?.status
      )
    ) {
      if (fileKey) {
        deleteFile({ file_key: fileKey })
      }
      if (batchJobId) {
        cancelBathJob()
      }
    }
  }

  return (
    <UploadModal
      type="products"
      status={status}
      progress={progress}
      hasError={hasError}
      canImport={isPreprocessed}
      onSubmit={onSubmit}
      onClose={onClose}
      summary={getSummary()}
      onFileRemove={onFileRemove}
      processUpload={processUpload}
      fileTitle={"toodete nimekiri"}
      templateLink="/temp/product-import-template.csv"
      errorMessage={batchJob?.result?.errors?.join(" \n")}
      description2Title="Kas pole kindel, kuidas oma loendit korraldada?"
      description2Text="Laadige alla allolev mall, et veenduda, et järgite õiget vormingut."
      description1Text="Impordi kaudu saate tooteid lisada või värskendada. Olemasolevate toodete/variantide värskendamiseks peate veergudes Toote/variandi ID määrama olemasoleva ID. Kui väärtus on määramata, luuakse uus kirje. Enne toodete importimist küsitakse teilt kinnitust."
    />
  )
}

export default ImportProducts
