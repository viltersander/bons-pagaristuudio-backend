import { Controller, useFieldArray, UseFormReturn } from "react-hook-form"
import { nestedForm } from "../../../../../utils/nested-form"
import React, { useMemo, useState } from "react"
import clsx from "clsx"
import Accordion from "../../../../organisms/accordion"
import BuildingsIcon from "../../../../fundamentals/icons/buildings-icon"
import Button from "../../../../fundamentals/button"
import CustomsForm, { CustomsFormType } from "../../customs-form"
import DimensionsForm, { DimensionsFormType } from "../../dimensions-form"
import IconBadge from "../../../../fundamentals/icon-badge"
import InputField from "../../../../molecules/input"
import Modal from "../../../../molecules/modal"
import Switch from "../../../../atoms/switch"
import { useAdminStockLocations } from "medusa-react"
import { useLayeredModal } from "../../../../molecules/modal/layered-modal"
import { InventoryLevelDTO, StockLocationDTO } from "@medusajs/types"

export type VariantStockFormType = {
  manage_inventory?: boolean
  allow_backorder: boolean
  inventory_quantity: number | null
  sku: string | null
  ean: string | null
  upc: string | null
  barcode: string | null
  location_levels?: Partial<InventoryLevelDTO>[] | null
  dimensions: DimensionsFormType
  customs: CustomsFormType
}

type Props = {
  locationLevels: InventoryLevelDTO[]
  form: UseFormReturn<VariantStockFormType>
}

const VariantStockForm = ({ form, locationLevels }: Props) => {
  const locationLevelMap = useMemo(
    () => new Map(locationLevels.map((l) => [l.location_id, l])),
    [locationLevels]
  )

  const layeredModalContext = useLayeredModal()

  const { stock_locations: locations, isLoading } = useAdminStockLocations()

  const locationsMap = useMemo(() => {
    if (isLoading || !locations) {
      return new Map()
    }

    return new Map(locations.map((l) => [l.id, l]))
  }, [locations, isLoading])
  const { control, register, watch } = form

  const manageInventory = watch("manage_inventory")

  const {
    fields: selectedLocations,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "location_levels",
  })

  const selectedLocationLevels = watch("location_levels")

  const levelMap = new Map(
    selectedLocationLevels?.map((l) => [l.location_id, l])
  )

  const handleUpdateLocations = async (data: {
    added: string[]
    removed: string[]
  }) => {
    const removed = data.removed.map((r) =>
      selectedLocations.findIndex((sl) => sl.location_id === r)
    )

    removed.forEach((r) => remove(r))

    data.added.forEach((added) => {
      append({
        location_id: added,
        stocked_quantity: locationLevelMap.get(added)?.stocked_quantity ?? 0,
        reserved_quantity: locationLevelMap.get(added)?.reserved_quantity ?? 0,
      })
    })
  }

  return (
    <Accordion type="multiple" defaultValue={["general"]}>
      <Accordion.Item title="General" value="general">
        <div className="gap-y-xlarge mt-large flex flex-col">
          <div className="flex flex-col gap-y-4">
            <div className="gap-large grid grid-cols-2">
              <InputField
                label="Laoseisuüksus (SKU)"
                placeholder="SUN-G, JK1234..."
                {...register("sku")}
              />
              <InputField
                label="EAN (Vöötkood)"
                placeholder="123456789102..."
                {...register("ean")}
              />
              <InputField
                label="UPC (Vöötkood)"
                placeholder="023456789104..."
                {...register("upc")}
              />
              <InputField
                label="Vöötkoode"
                placeholder="123456789104..."
                {...register("barcode")}
              />
            </div>
          </div>
        </div>
      </Accordion.Item>
      <Accordion.Item title="Laoseis" value="inventory">
        <div className="gap-y-small mt-large flex flex-col">
          <div className="gap-y-2xsmall flex flex-col">
            <div className="flex items-center justify-between">
              <h3 className="inter-base-semibold mb-2xsmall">
                Halda laoseisu
              </h3>
              <Controller
                control={control}
                name={"manage_inventory"}
                render={({ field: { value, onChange } }) => {
                  return <Switch checked={value} onCheckedChange={onChange} />
                }}
              />
            </div>
            <p className="inter-base-regular text-grey-50">
              Märkimisel reguleerib Medusa laoseisu, kui tellimusi ja
              tagastatakse.
            </p>
          </div>
          {manageInventory && (
            <>
              <div className="gap-y-2xsmall flex flex-col">
                <div className="flex items-center justify-between">
                  <h3 className="inter-base-semibold mb-2xsmall">
                    Luba järeltellimused
                  </h3>
                  <Controller
                    control={control}
                    name={"allow_backorder"}
                    render={({ field: { value, onChange } }) => {
                      return (
                        <Switch checked={value} onCheckedChange={onChange} />
                      )
                    }}
                  />
                </div>
                <p className="inter-base-regular text-grey-50">
                  Kui see on märgitud, on toode saadaval ostmiseks hoolimata sellest, et toode on välja müüdud
                </p>
              </div>
              <div className="flex w-full flex-col text-base">
                <h3 className="inter-base-semibold mb-2xsmall">Kogus</h3>
                {!isLoading && locations && (
                  <div className="flex w-full flex-col">
                    <div className="inter-base-regular text-grey-50 flex justify-between py-3">
                      <div className="">Asukoht</div>
                      <div className="">Laos</div>
                    </div>
                    {selectedLocations.map((level, i) => {
                      const locationDetails = locationsMap.get(
                        level.location_id
                      )
                      const locationLevel = levelMap.get(level.location_id)

                      return (
                        <div key={level.id} className="flex items-center py-3">
                          <div className="inter-base-regular flex items-center">
                            <IconBadge className="mr-base">
                              <BuildingsIcon />
                            </IconBadge>
                            {locationDetails?.name}
                          </div>
                          <div className="ml-auto flex">
                            <div className="mr-base text-small text-grey-50 flex flex-col">
                              <span className="whitespace-nowrap text-right">
                                {`${locationLevel!.reserved_quantity} reserved`}
                              </span>
                              <span className="whitespace-nowrap text-right">{`${
                                locationLevel!.stocked_quantity! -
                                locationLevel!.reserved_quantity!
                              } available`}</span>
                            </div>
                            <InputField
                              placeholder={"0"}
                              type="number"
                              min={0}
                              {...register(
                                `location_levels.${i}.stocked_quantity`,
                                { valueAsNumber: true }
                              )}
                            />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
              <div className="flex">
                <Button
                  variant="secondary"
                  size="small"
                  type="button"
                  className="w-full"
                  onClick={() => {
                    layeredModalContext.push(
                      // @ts-ignore
                      ManageLocationsScreen(
                        layeredModalContext.pop,
                        selectedLocations,
                        locations || [],
                        handleUpdateLocations
                      )
                    )
                  }}
                >
                  Halda asukohti
                </Button>
              </div>
            </>
          )}
        </div>
      </Accordion.Item>
      <Accordion.Item title="Tarne" value="shipping">
        <p className="inter-base-regular text-grey-50">
          Sõltuvalt teie saatmisest võidakse nõuda tarneteavet
          teenusepakkuja ja kas tarnite rahvusvaheliselt või mitte.
        </p>
        <div className="mt-large">
          <h3 className="inter-base-semibold mb-2xsmall">Mõõtmed</h3>
          <p className="inter-base-regular text-grey-50 mb-large">
            Seadistage kõige täpsemate saatmishindade arvutamiseks.
          </p>
          <DimensionsForm form={nestedForm(form, "dimensions")} />
        </div>
        <div className="mt-xlarge">
          <h3 className="inter-base-semibold mb-2xsmall">Toll</h3>
          <p className="inter-base-regular text-grey-50 mb-large">
            Seadistage, kui tarnite rahvusvaheliselt.
          </p>
          <CustomsForm form={nestedForm(form, "customs")} />
        </div>
      </Accordion.Item>
    </Accordion>
  )
}

export const ManageLocationsScreen = (
  pop: () => void,
  levels: Partial<InventoryLevelDTO>[],
  locations: StockLocationDTO[],
  onSubmit: (value: any) => Promise<void>
) => {
  return {
    title: "Halda asukohti",
    onBack: () => pop(),
    view: (
      <ManageLocationsForm
        existingLevels={levels}
        locationOptions={locations}
        onSubmit={onSubmit}
      />
    ),
  }
}

type ManageLocationFormProps = {
  existingLevels: Partial<InventoryLevelDTO>[]
  locationOptions: StockLocationDTO[]
  onSubmit: (value: any) => Promise<void>
}

const ManageLocationsForm = ({
  existingLevels,
  locationOptions,
  onSubmit,
}: ManageLocationFormProps) => {
  const layeredModalContext = useLayeredModal()
  const { pop } = layeredModalContext

  const existingLocations = useMemo(() => {
    return existingLevels.map((level) => level.location_id!)
  }, [existingLevels])

  const [selectedLocations, setSelectedLocations] =
    useState<string[]>(existingLocations)

  const [isDirty, setIsDirty] = useState(false)

  React.useEffect(() => {
    const selectedIsExisting = selectedLocations.every((locationId) =>
      existingLocations.includes(locationId)
    )
    setIsDirty(
      !selectedIsExisting ||
        selectedLocations.length !== existingLocations.length
    )
  }, [existingLocations, selectedLocations])

  const handleToggleLocation = (locationId: string) => {
    if (selectedLocations.includes(locationId)) {
      setSelectedLocations(selectedLocations.filter((id) => id !== locationId))
    } else {
      setSelectedLocations([...selectedLocations, locationId])
    }
  }

  // TODO: On submit, create location level and refetch locations if needed, so that object exists correctly
  const handleSubmit = async (e) => {
    e.preventDefault()

    const newLevels = selectedLocations.filter(
      (locationId: string) => !existingLocations.includes(locationId)
    )
    const removedLevels = existingLocations.filter(
      (locationId) => !!locationId && !selectedLocations.includes(locationId)
    )

    await onSubmit({
      added: newLevels,
      removed: removedLevels,
    }).then(() => {
      pop()
    })
  }

  const handleSelectAll = (e) => {
    e.preventDefault()

    setSelectedLocations(locationOptions.map((l) => l.id))
  }

  const locationsAvailable = !!locationOptions.length

  return (
    <div className="h-full w-full">
      <form onSubmit={handleSubmit}>
        <Modal.Content>
          <div>
            <div
              className={clsx(
                "border-grey-20 text-grey-50 flex w-full items-center justify-between",
                { "pb-base border-b": locationsAvailable }
              )}
            >
              <div>
                <p>
                  {locationsAvailable
                    ? "Valige asukohad, kus valitud varianti müüakse"
                    : "Teil pole asukohti"}
                </p>
                {locationsAvailable && (
                  <p>{`(${selectedLocations.length} of ${locationOptions.length} selected)`}</p>
                )}
              </div>
              {locationsAvailable && (
                <Button
                  size="small"
                  variant="ghost"
                  className="border"
                  onClick={handleSelectAll}
                >
                  Vali kõik
                </Button>
              )}
            </div>
            {locationOptions.map((loc) => {
              const existingLevel = selectedLocations.find((l) => l === loc.id)

              return (
                <div
                  className="border-grey-20 py-base flex items-center justify-between gap-6 border-b"
                  key={loc.id}
                >
                  <div className="flex items-center">
                    <IconBadge className="mr-base">
                      <BuildingsIcon />
                    </IconBadge>
                    <h3>{loc.name}</h3>
                  </div>
                  <Switch
                    checked={!!existingLevel}
                    onCheckedChange={() => handleToggleLocation(loc.id)}
                  />
                </div>
              )
            })}
          </div>
        </Modal.Content>
        <Modal.Footer>
          <div className="gap-x-xsmall flex w-full justify-end">
            <Button
              variant="ghost"
              size="small"
              className="w-[112px]"
              onClick={() => pop()}
              type="button"
            >
              Tagasi
            </Button>
            <Button
              variant="primary"
              className="nowrap w-[134px]"
              size="small"
              type="submit"
              disabled={!isDirty}
            >
              Salvesta ja mine tagasi
            </Button>
          </div>
        </Modal.Footer>
      </form>
    </div>
  )
}

export default VariantStockForm
