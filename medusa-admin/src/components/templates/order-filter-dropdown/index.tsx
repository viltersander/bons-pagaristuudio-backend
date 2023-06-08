import clsx from "clsx";
import { useAdminRegions, useAdminSalesChannels } from "medusa-react";
import { useEffect, useState } from "react";
import FilterDropdownContainer from "../../../components/molecules/filter-dropdown/container";
import FilterDropdownItem from "../../../components/molecules/filter-dropdown/item";
import SaveFilterItem from "../../../components/molecules/filter-dropdown/save-field";
import TabFilter from "../../../components/molecules/filter-tab";
import PlusIcon from "../../fundamentals/icons/plus-icon";
import FeatureToggle from "../../fundamentals/feature-toggle";
import { useFeatureFlag } from "../../../providers/feature-flag-provider";

const REGION_PAGE_SIZE = 10;
const CHANNEL_PAGE_SIZE = 10;

const statusFilters = [
  "completed",
  "pending",
  "canceled",
  "archived",
  "requires_action",
];
const paymentFilters = [
  "awaiting",
  "captured",
  "refunded",
  "canceled",
  "partially_refunded",
  "requires_action",
  "not_paid",
];
const fulfillmentFilters = [
  "fulfilled",
  "not_fulfilled",
  "partially_fulfilled",
  "returned",
  "partially_returned",
  "shipped",
  "partially_shipped",
  "requires_action",
  "canceled",
];

const dateFilters = [
  "on viimases",
  "on vanem kui",
  "on pärast",
  "on enne",
  "on võrdne",
];

const OrderFilters = ({
  tabs,
  activeTab,
  onTabClick,
  onSaveTab,
  onRemoveTab,
  filters,
  submitFilters,
  clearFilters,
}) => {
  const [tempState, setTempState] = useState(filters);
  const [name, setName] = useState("");

  const { isFeatureEnabled } = useFeatureFlag();
  const isSalesChannelsEnabled = isFeatureEnabled("sales_channels");

  const handleRemoveTab = (val) => {
    if (onRemoveTab) {
      onRemoveTab(val);
    }
  };

  const handleSaveTab = () => {
    if (onSaveTab) {
      onSaveTab(name, tempState);
    }
  };

  const handleTabClick = (tabName) => {
    if (onTabClick) {
      onTabClick(tabName);
    }
  };

  useEffect(() => {
    setTempState(filters);
  }, [filters]);

  const onSubmit = () => {
    submitFilters(tempState);
  };

  const onClear = () => {
    clearFilters();
  };

  const setSingleFilter = (filterKey, filterVal) => {
    setTempState((prevState) => ({
      ...prevState,
      [filterKey]: filterVal,
    }));
  };

  const numberOfFilters = Object.entries(filters).reduce(
    (acc, [key, value]) => {
      if (value?.open) {
        acc = acc + 1;
      }
      return acc;
    },
    0
  );

  const [regionsPagination, setRegionsPagination] = useState({
    offset: 0,
    limit: REGION_PAGE_SIZE,
  });

  const {
    regions,
    count,
    isLoading: isLoadingRegions,
  } = useAdminRegions(regionsPagination);

  const { sales_channels, isLoading: isLoadingSalesChannels } =
    useAdminSalesChannels(
      { limit: CHANNEL_PAGE_SIZE },
      { enabled: isSalesChannelsEnabled }
    );

  const handlePaginateRegions = (direction) => {
    if (direction > 0) {
      setRegionsPagination((prev) => ({
        ...prev,
        offset: prev.offset + prev.limit,
      }));
    } else if (direction < 0) {
      setRegionsPagination((prev) => ({
        ...prev,
        offset: Math.max(prev.offset - prev.limit, 0),
      }));
    }
  };

  const translateFilter = (filter) => {
    switch (filter) {
      case "completed":
        return "täidetud";
      case "pending":
        return "ootel";
      case "canceled":
        return "tühistatud";
      case "archived":
        return "arhiveeritud";
      case "awaiting":
        return "ootel";
      case "captured":
        return "makstud";
      case "refunded":
        return "tagastatud";
      case "partially_refunded":
        return "osaliselt tagastatud";
      case "not_paid":
        return "maksmata";
      case "not_fulfilled":
        return "täitmata";
      case "fulfilled":
        return "täidetud";
      case "partially_fulfilled":
        return "osaliselt täidetud";
      case "returned":
        return "tagastatud";
      case "partially_returned":
        return "osaliselt tagastatud";
      case "shipped":
        return "saadetud";
      case "partially_shipped":
        return "osaliselt saadetud";
      case "requires_action":
        return "nõuab tegevust";
      case "on viimases":
        return "on viimases";
      case "on vanem kui":
        return "on vanem kui";
      case "on pärast":
        return "on pärast";
      case "on enne":
        return "on enne";
      case "on võrdne":
        return "on võrdne";
      default:
        return filter;
    }
  };

  return (
    <div className="flex space-x-1">
      <FilterDropdownContainer
        submitFilters={onSubmit}
        clearFilters={onClear}
        triggerElement={
          <button
            className={clsx(
              "rounded-rounded focus-visible:shadow-input focus-visible:border-violet-60 flex items-center space-x-1 focus-visible:outline-none"
            )}
          >
            <div className="rounded-rounded bg-grey-5 border-grey-20 inter-small-semibold flex h-6 items-center border px-2">
              Filtrid
              <div className="text-grey-40 ml-1 flex items-center rounded">
                <span className="text-violet-60 inter-small-semibold">
                  {numberOfFilters ? numberOfFilters : "0"}
                </span>
              </div>
            </div>
            <div className="rounded-rounded bg-grey-5 border-grey-20 inter-small-semibold flex items-center border p-1">
              <PlusIcon size={14} />
            </div>
          </button>
        }
      >
        <FilterDropdownItem
          filterTitle="Olek"
          options={statusFilters.map((filter) => ({
            value: filter,
            label: translateFilter(filter),
          }))}
          filters={tempState.status.filter}
          open={tempState.status.open}
          setFilter={(val) => setSingleFilter("status", val)}
        />
        <FilterDropdownItem
          filterTitle="Makse olek"
          options={paymentFilters.map((filter) => ({
            value: filter,
            label: translateFilter(filter),
          }))}
          filters={tempState.payment.filter}
          open={tempState.payment.open}
          setFilter={(val) => setSingleFilter("payment", val)}
        />
        <FilterDropdownItem
          filterTitle="Täitmise olek"
          options={fulfillmentFilters.map((filter) => ({
            value: filter,
            label: translateFilter(filter),
          }))}
          filters={tempState.fulfillment.filter}
          open={tempState.fulfillment.open}
          setFilter={(val) => setSingleFilter("fulfillment", val)}
        />
        <FilterDropdownItem
          filterTitle="Regioonid"
          options={
            regions?.map((region) => ({
              value: region.id,
              label: region.name,
            })) || []
          }
          isLoading={isLoadingRegions}
          hasPrev={regionsPagination.offset > 0}
          hasMore={
            regionsPagination.offset + regionsPagination.limit < (count ?? 0)
          }
          onShowPrev={() => handlePaginateRegions(-1)}
          onShowNext={() => handlePaginateRegions(1)}
          filters={tempState.region.filter}
          open={tempState.region.open}
          setFilter={(v) => setSingleFilter("region", v)}
        />
        {isSalesChannelsEnabled && (
          <FilterDropdownItem
            filterTitle="Müügikanal"
            options={
              sales_channels?.map((salesChannel) => ({
                value: salesChannel.id,
                label: salesChannel.name,
              })) || []
            }
            isLoading={isLoadingSalesChannels}
            filters={tempState.salesChannel.filter}
            open={tempState.salesChannel.open}
            setFilter={(v) => setSingleFilter("salesChannel", v)}
          />
        )}
        <FilterDropdownItem
          filterTitle="Kuupäev"
          options={dateFilters}
          filters={tempState.date.filter}
          open={tempState.date.open}
          setFilter={(val) => setSingleFilter("date", val)}
        />
        <SaveFilterItem
          saveFilter={handleSaveTab}
          name={name}
          setName={setName}
        />
      </FilterDropdownContainer>
      {tabs &&
        tabs.map((t) => (
          <TabFilter
            key={t.value}
            onClick={() => handleTabClick(t.value)}
            label={t.label}
            isActive={activeTab === t.value}
            removable={!!t.removable}
            onRemove={() => handleRemoveTab(t.value)}
          />
        ))}
    </div>
  );
};

export default OrderFilters;