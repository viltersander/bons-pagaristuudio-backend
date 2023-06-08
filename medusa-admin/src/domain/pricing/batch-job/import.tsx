import { useEffect, useState } from "react"

import { BatchJob } from "@medusajs/medusa"
import {
  useAdminBatchJob,
  useAdminCancelBatchJob,
  useAdminConfirmBatchJob,
  useAdminCreateBatchJob,
  useAdminDeleteFile,
  useAdminUploadFile,
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
type ImportPricesProps = {
  priceListId: string
  handleClose: () => void
}

/**
 * Product import modal container.
 */
function ImportPrices(props: ImportPricesProps) {
  const [fileKey, setFileKey] = useState<string | undefined>()
  const [batchJobId, setBatchJobId] = useState<string | undefined>()

  const notification = useNotification()

  const { resetInterval } = usePolling()

  const { mutateAsync: deleteFile } = useAdminDeleteFile()
  const { mutateAsync: uploadFile } = useAdminUploadFile()

  const { mutateAsync: createBatchJob } = useAdminCreateBatchJob()
  const { mutateAsync: cancelBathJob } = useAdminCancelBatchJob(batchJobId!)
  const { mutateAsync: confirmBatchJob } = useAdminConfirmBatchJob(batchJobId!)

  const batchJob = useImportBatchJob(batchJobId)

  const isUploaded = !!fileKey
  const isPreprocessed = !!batchJob?.result
  const hasError = batchJob?.status === "failed"

  const progress = isPreprocessed
    ? (batchJob!.result?.advancement_count || 0) /
      (batchJob!.result?.count || 1)
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
      const _fileKey = res.uploads![0].key
      setFileKey(_fileKey)

      const batchJob = await createBatchJob({
        dry_run: true,
        context: { fileKey: _fileKey, price_list_id: props.priceListId },
        type: "price-list-import",
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
  const getSummary = (): { toCreate: number } | undefined => {
    if (!batchJob) {
      return undefined
    }

    const res = batchJob.result?.stat_descriptors?.[0].message.match(/\d+/g)

    if (!res) {
      return undefined
    }

    return {
      toCreate: Number(res[0]),
    }
  }

  /**
   * When file upload is removed, delete file from the bucket and cancel batch job.
   */
  const onFileRemove = async () => {
    try {
      if (fileKey) {
        deleteFile({ file_key: fileKey })
      }
      cancelBathJob()
    } catch (e) {
      console.log(e)
    }
  }

  /**
   * Cleanup file if batch job isn't confirmed.
   */
  const onClose = () => {
    props.handleClose()
    if (
      !["confirmed", "completed", "canceled", "failed"].includes(
        batchJob?.status || ""
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
      type="prices"
      fileTitle="Hinnakirja hinnad"
      description1Text="Hinnakirja värskendamiseks laadige üles CSV-fail variantide ja hindadega. Pange tähele, et kõik olemasolevad hinnad kustutatakse."
      description2Title="Kas pole kindel, kuidas oma loendit korraldada?"
      description2Text="Laadige alla allpool olev mallifail ja värskendage hindu"
      status={status}
      progress={progress}
      canImport={isPreprocessed}
      onSubmit={onSubmit}
      onClose={onClose}
      summary={getSummary()}
      onFileRemove={onFileRemove}
      processUpload={processUpload}
      templateLink="/temp/price-list-import-template.csv"
    />
  )
}

export default ImportPrices
