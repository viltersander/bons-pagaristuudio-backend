import { useAdminStore } from "medusa-react"
import { useNavigate } from "react-router-dom"
import BackButton from "../../../components/atoms/back-button"
import Spinner from "../../../components/atoms/spinner"
import Tooltip from "../../../components/atoms/tooltip"
import FeatureToggle from "../../../components/fundamentals/feature-toggle"
import JSONView from "../../../components/molecules/json-view"
import Section from "../../../components/organisms/section"
import { useAnalytics } from "../../../providers/analytics-provider"
import { getErrorStatus } from "../../../utils/get-error-status"
import CurrencyTaxSetting from "./components/currency-tax-setting"
import DefaultStoreCurrency from "./components/default-store-currency"
import StoreCurrencies from "./components/store-currencies"

const CurrencySettings = () => {
  const navigate = useNavigate()
  const { trackCurrencies } = useAnalytics()
  const { store, status, error } = useAdminStore({
    onSuccess: (data) => {
      trackCurrencies({
        used_currencies: data.store.currencies.map((c) => c.code),
      })
    },
  })

  if (error) {
    let message = "Ilmnes tundmatu viga"

    const errorStatus = getErrorStatus(error)

    if (errorStatus) {
      message = errorStatus.message

      if (errorStatus.status === 404) {
        navigate("/404")
        return null
      }
    }

    // temp needs design
    return (
      <Section title="Error">
        <p className="inter-base-regular">{message}</p>

        <div className="mt-base px-base py-xsmall">
          <JSONView data={JSON.parse(JSON.stringify(error))} />
        </div>
      </Section>
    )
  }

  if (status === "loading" || !store) {
    // temp, perhaps use skeletons?
    return (
      <div className="flex h-[calc(100vh-64px)] w-full items-center justify-center">
        <Spinner variant="secondary" />
      </div>
    )
  }

  return (
    <div className="pb-xlarge">
      <BackButton
        label="Tagasi seadetesse"
        path="/a/settings"
        className="mb-xsmall"
      />
      <div className="gap-base grid grid-cols-3">
        <div className="gap-y-xsmall col-span-2 flex flex-col ">
          <Section title="Currencies">
            <p className="text-grey-50 inter-base-regular mt-2xsmall">
              Hallake turge, kus tegutsete.
            </p>
          </Section>

          <Section>
            <div className="mb-large">
              <StoreCurrencies store={store} />
            </div>
            <FeatureToggle featureFlag="tax_inclusive_pricing">
              <div className="cursor-default">
                <div className="inter-small-semibold text-grey-50 mb-base flex items-center justify-between">
                  <p>Valuuta</p>
                  <Tooltip
                    side="top"
                    content={
                      "Otsustage, kas soovite selles valuutas hinna määramisel lisada või välistada makse"
                    }
                  >
                    <p>Sisaldab maksu. Hinnad</p>
                  </Tooltip>
                </div>
                <div className="gap-base grid grid-cols-1">
                  {store.currencies
                    .sort((a, b) => {
                      return a.code > b.code ? 1 : -1
                    })
                    .map((c, index) => {
                      return (
                        <CurrencyTaxSetting
                          currency={c}
                          isDefault={store.default_currency_code === c.code}
                          key={index}
                        />
                      )
                    })}
                </div>
              </div>
            </FeatureToggle>
          </Section>
        </div>
        <div>
          <Section>
            <DefaultStoreCurrency store={store} />
          </Section>
        </div>
      </div>
    </div>
  )
}

export default CurrencySettings
