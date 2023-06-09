import { useAdminRegions } from "medusa-react"
import { useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import BackButton from "../../../components/atoms/back-button"
import Spinner from "../../../components/atoms/spinner"
import GearIcon from "../../../components/fundamentals/icons/gear-icon"
import BodyCard from "../../../components/organisms/body-card"
import RadioGroup from "../../../components/organisms/radio-group"
import TwoSplitPane from "../../../components/templates/two-split-pane"
import TaxDetails from "./details"

const SEARCH_PARAM = "reg_id"

const Taxes = () => {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  const { regions, isLoading } = useAdminRegions()

  useEffect(() => {
    if (!isLoading && regions?.length && !searchParams.get(SEARCH_PARAM)) {
      setSearchParams({ [SEARCH_PARAM]: regions[0].id })
    }
  }, [regions, isLoading, searchParams, setSearchParams])

  return (
    <>
      <div>
        <BackButton
          path="/a/settings"
          label="Tagasi seadete juurde"
          className="mb-xsmall"
        />
        <TwoSplitPane threeCols>
          <BodyCard
            forceDropdown
            title="Piirkonnad"
            subtitle="Valige piirkond, mille makse soovite hallata"
            actionables={[
              {
                icon: <GearIcon />,
                label: "Avage piirkonna seaded",
                onClick: () => navigate("/a/settings/regions"),
              },
            ]}
          >
            {isLoading || !regions ? (
              <div className="flex h-full flex-grow items-center justify-center">
                <Spinner size="large" variant="secondary" />
              </div>
            ) : (
              <RadioGroup.Root
                value={searchParams.get(SEARCH_PARAM) || undefined}
                onValueChange={(value) =>
                  setSearchParams({ [SEARCH_PARAM]: value })
                }
              >
                {regions.map((r) => {
                  return (
                    <RadioGroup.Item
                      label={r.name}
                      description={
                        r.countries.length
                          ? `${r.countries
                              .map((c) => c.display_name)
                              .join(", ")}`
                          : undefined
                      }
                      value={r.id}
                      key={r.id}
                      id={r.id}
                    />
                  )
                })}
              </RadioGroup.Root>
            )}
          </BodyCard>
          <TaxDetails id={searchParams.get(SEARCH_PARAM)} />
        </TwoSplitPane>
      </div>
    </>
  )
}

export default Taxes
