import { BatchJob } from "@medusajs/medusa/dist"

export enum BatchJobOperation {
  Import = "Import",
  Export = "Export",
}

export function batchJobDescriptionBuilder(
  batchJob: BatchJob,
  operation: BatchJobOperation,
  elapsedTime?: number
): string {
  let description = ""

  const entityName = batchJob.type.split("-").reverse().pop()

  const twentyfourHoursInMs = 24 * 60 * 60 * 1000

  switch (batchJob.status) {
    case "failed":
      description = `${operation} ${entityName} ebaõnnestus.`
      break
    case "canceled":
      description = `${operation} ${entityName} on tühistatud.`
      break
    case "completed":
      if (elapsedTime && Math.abs(elapsedTime) > twentyfourHoursInMs) {
        description = `${operation} fail pole enam saadaval. Faili säilitatakse ainult 24 tundi.`
        break
      } else {
        description = `${operation} ${entityName} on tehtud.`
        break
      }
    case "processing":
      description = `${operation} ${entityName}töödeldakse. Võite tegevuste vahekaardi ohutult sulgeda. Teavitame teid, kui teie eksport on allalaadimiseks valmis.`
      break
    case "confirmed":
      description = `${operation} ${entityName} on kinnitatud ja algab peagi.`
      break
    case "pre_processed":
      description = `${operation} ${entityName} valmistatakse ette.`
      break
    default:
      description = `${operation} ${entityName} on loodud ja algab peagi.`
  }

  return description
}
