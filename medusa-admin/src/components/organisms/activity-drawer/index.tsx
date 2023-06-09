import React, { useEffect } from "react"

import useOutsideClick from "../../../hooks/use-outside-click"
import { usePolling } from "../../../providers/polling-provider"
import Spinner from "../../atoms/spinner"
import SadFaceIcon from "../../fundamentals/icons/sad-face-icon"
import SidedMouthFaceIcon from "../../fundamentals/icons/sided-mouth-face"
import BatchJobActivityList from "../batch-jobs-activity-list"

const ActivityDrawer = ({ onDismiss }) => {
  const ref = React.useRef<HTMLDivElement>(null)
  const { batchJobs, hasPollingError, refetch } = usePolling()
  useOutsideClick(onDismiss, ref)

  useEffect(() => {
    refetch()
  }, [])

  return (
    <div
      ref={ref}
      className="bg-grey-0 shadow-dropdown rounded-rounded fixed top-[64px] bottom-2 right-3 flex w-[400px] flex-col overflow-x-hidden rounded"
    >
      <div className="inter-large-semibold pt-7 pl-8 pb-1">Tegevus</div>

      {!hasPollingError ? (
        batchJobs ? (
          <BatchJobActivityList batchJobs={batchJobs} />
        ) : (
          <EmptyActivityDrawer />
        )
      ) : (
        <ErrorActivityDrawer />
      )}
    </div>
  )
}

const EmptyActivityDrawer = () => {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center p-4">
      <SidedMouthFaceIcon size={36} />
      <span className={"inter-large-semibold text-grey-90 mt-4"}>
      Siin on vaikne...
      </span>
      <span className={"text-grey-60 inter-base-regular mt-4 text-center"}>
      Teil pole praegu ühtegi märguannet, kuid kui saate, hakkavad nad siin olema..
      </span>
    </div>
  )
}

const ErrorActivityDrawer = () => {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center p-4">
      <SadFaceIcon size={36} />
      <span className={"inter-large-semibold text-grey-90 mt-4"}>Oh no...</span>
      <span className={"text-grey-60 inter-base-regular mt-2 text-center"}>
      Teie märguannete toomisel läks midagi valesti – proovime edasi!
      </span>

      <div className="mt-4 flex items-center">
        <Spinner size={"small"} variant={"secondary"} />
        <span className="ml-2.5">Töötlemine...</span>
      </div>
    </div>
  )
}

export default ActivityDrawer
