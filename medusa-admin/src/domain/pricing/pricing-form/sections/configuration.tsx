import { PriceList } from "@medusajs/medusa"
import clsx from "clsx"
import { useAdminCustomerGroups } from "medusa-react"
import React, { useState } from "react"
import { Controller } from "react-hook-form"
import DatePicker from "../../../../components/atoms/date-picker/date-picker"
import TimePicker from "../../../../components/atoms/date-picker/time-picker"
import Switch from "../../../../components/atoms/switch"
import Select from "../../../../components/molecules/select"
import Accordion from "../../../../components/organisms/accordion"
import { weekFromNow } from "../../../../utils/date-utils"
import { usePriceListForm } from "../form/pricing-form-context"
import { ConfigurationFields } from "../types"

type ConfigurationProps = {
  priceList?: PriceList
}

const checkForEnabledConfigs = (config: ConfigurationFields): string[] => {
  const enabledConfigs: string[] = []

  if (config.customer_groups && config.customer_groups.length > 0) {
    enabledConfigs.push("customer_groups")
  }
  if (config.starts_at) {
    enabledConfigs.push("starts_at")
  }
  if (config.ends_at) {
    enabledConfigs.push("ends_at")
  }

  return enabledConfigs
}

const Configuration: React.FC<ConfigurationProps> = () => {
  const { customer_groups, isLoading } = useAdminCustomerGroups()
  const { control, handleConfigurationSwitch, configFields } =
    usePriceListForm()
  const [openItems, setOpenItems] = useState<string[]>(
    checkForEnabledConfigs(configFields)
  )

  return (
    <Accordion.Item
      forceMountContent
      title="Konfiguratisoon"
      tooltip="Hinnakirja valikuline konfiguratsioon"
      value="configuration"
      description="Hinna soodustus rakendub alates avaldamisnupu vajutamisest ja igavesti, kui seda ei puudutata."
    >
      <Accordion
        type="multiple"
        value={openItems}
        onValueChange={(values) => {
          handleConfigurationSwitch(values)
          setOpenItems(values)
        }}
      >
        <div className="mt-5">
          <Accordion.Item
            headingSize="medium"
            forceMountContent
            className="border-b-0"
            title="Hinna soodustusel on alguskuupäev?"
            subtitle="Ajastage hinnasoodustused tulevikus aktiveerimiseks."
            value="starts_at"
            customTrigger={
              <Switch checked={openItems.indexOf("starts_at") > -1} />
            }
          >
            <div
              className={clsx(
                "gap-xsmall accordion-margin-transition flex items-center",
                {
                  "mt-4": openItems.indexOf("starts_at") > -1,
                }
              )}
            >
              <Controller
                name="starts_at"
                control={control}
                render={({ field: { value, onChange } }) => {
                  const ensuredDate = value || new Date()
                  return (
                    <>
                      <DatePicker
                        date={ensuredDate}
                        label="Algus kuupäev"
                        onSubmitDate={onChange}
                      />
                      <TimePicker
                        date={ensuredDate}
                        label="Algus kuupäev"
                        onSubmitDate={onChange}
                      />
                    </>
                  )
                }}
              />
            </div>
          </Accordion.Item>
          <Accordion.Item
            headingSize="medium"
            forceMountContent
            className="border-b-0"
            title="Hinna soodustusel on aegumiskuupäev?"
            subtitle="Ajastage hinnasoodustus tulevikus desaktiveerimiseks."
            value="ends_at"
            customTrigger={
              <Switch checked={openItems.indexOf("ends_at") > -1} />
            }
          >
            <div
              className={clsx(
                "gap-xsmall accordion-margin-transition flex items-center",
                {
                  "mt-4": openItems.indexOf("ends_at") > -1,
                }
              )}
            >
              <Controller
                name="ends_at"
                control={control}
                render={({ field: { value, onChange } }) => {
                  const ensuredDate = value || weekFromNow()
                  return (
                    <>
                      <DatePicker
                        date={ensuredDate}
                        label="Lõppkuupäev"
                        onSubmitDate={onChange}
                      />
                      <TimePicker
                        date={ensuredDate}
                        label="Lõppkuupäev"
                        onSubmitDate={onChange}
                      />
                    </>
                  )
                }}
              />
            </div>
          </Accordion.Item>
          <Accordion.Item
            headingSize="medium"
            forceMountContent
            className="border-b-0"
            title="Kliendi kättesaadavus"
            subtitle="Määrake, millistele kliendirühmadele peaksid hindade soodustused kehtima."
            value="customer_groups"
            customTrigger={
              <Switch checked={openItems.indexOf("customer_groups") > -1} />
            }
          >
            <Controller
              name="customer_groups"
              control={control}
              render={({ field: { value, onChange, ref } }) => {
                return (
                  <div
                    className={clsx(
                      "gap-xsmall accordion-margin-transition flex w-full items-center",
                      {
                        "mt-4": openItems.indexOf("customer_groups") > -1,
                      }
                    )}
                  >
                    <Select
                      value={value}
                      label="Kliendirühmad"
                      onChange={onChange}
                      isMultiSelect
                      fullWidth
                      enableSearch
                      hasSelectAll
                      isLoading={isLoading}
                      options={
                        customer_groups?.map((cg) => ({
                          label: cg.name,
                          value: cg.id,
                        })) || []
                      }
                      ref={ref}
                    />
                  </div>
                )
              }}
            />
          </Accordion.Item>
        </div>
      </Accordion>
    </Accordion.Item>
  )
}

export default Configuration
