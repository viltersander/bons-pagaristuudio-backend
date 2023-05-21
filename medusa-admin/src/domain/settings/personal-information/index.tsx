import { useAdminGetSession } from "medusa-react"
import BackButton from "../../../components/atoms/back-button"
import { useFeatureFlag } from "../../../providers/feature-flag-provider"
import EditUserInformation from "./edit-user-information"
import UsageInsights from "./usage-insights"

const PersonalInformation = () => {
  const { isFeatureEnabled } = useFeatureFlag()
  const { user } = useAdminGetSession()

  return (
    <div>
      <BackButton
        label="Tagasi seadetesse"
        path="/a/settings"
        className="mb-xsmall"
      />
      <div className="rounded-rounded border-grey-20 pt-large pb-xlarge px-xlarge gap-y-xlarge large:max-w-[50%] flex flex-col border bg-white">
        <div className="gap-y-2xsmall flex flex-col">
          <h1 className="inter-xlarge-semibold">Isiklik informatsioon</h1>
          <p className="inter-base-regular text-grey-50">
          Hallake oma Medusa profiili
          </p>
        </div>
        <div className="flex flex-col">
          <div className="border-grey-20 py-xlarge border-t">
            <EditUserInformation user={user} />
          </div>
          {isFeatureEnabled("analytics") && (
            <div className="border-grey-20 py-xlarge border-t">
              <UsageInsights user={user} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default PersonalInformation
