import {
  IndexTable,
  LegacyCard,
  useIndexResourceState,
  Text,
  Badge,
} from "@shopify/polaris";
import React, { useState } from "react";
import PopoverContent from "../PopoverContent";
import { announcementPopoverData } from "../../../constants/announcementCustomizationConfig";
import DiscardChangesConfirmationPopup from "../../atoms/DiscardChangesConfirmationPopup";
import DynamicEmptyState from "../../atoms/DynamicEmptyState";
import { formatDateAndTime } from "../../../utils/clientFunctions";
import { useFetcher, useNavigate } from "@remix-run/react";
import { ROUTES } from "../../../utils/constants";

const barState = {
  ACTIVE: "success",
  INACTIVE: "critical",
};

function CheckBars({ barsData }) {
  const fetcher = useFetcher();
  const navigate = useNavigate();
  const [confirmDelete, setConfirmDelete] = useState(false);

  const resourceName = {
    singular: "announcement bar",
    plural: "announcement bars",
  };

  const { selectedResources, allResourcesSelected, handleSelectionChange } =
    useIndexResourceState(barsData);

  const promotedBulkActions = [
    {
      content: "Delete",
      onAction: () => setConfirmDelete(true),
    },
  ];

  const handleCreateClick = (selectedType) => {
    navigate(`${ROUTES.ANNOUNCEMENT_CUSTOMIZATION_ROOT}${selectedType}`);
  };

  const rowMarkup = barsData.map(
    ({ id, name, createdAt, status, general_setting }, index) => (
      <IndexTable.Row
        id={id}
        key={id}
        selected={selectedResources.includes(id)}
        position={index}
      >
        <IndexTable.Cell>
          <div>
            <Text variant="bodyMd" fontWeight="bold" as="span">
              {name}
            </Text>
            <Badge
              tone={status ? barState.ACTIVE : barState.INACTIVE}
              style={{ marginLeft: "5px" }}
            >
              {status ? "Active" : "Inactive"}
            </Badge>
            <p>{JSON.parse(general_setting).message}</p>
          </div>
        </IndexTable.Cell>
        <Text as="span" alignment="end" numeric>
          {formatDateAndTime(createdAt)}
        </Text>
      </IndexTable.Row>
    ),
  );

  const handleDeleteConfirm = () => {
    console.log("Selected option: ", selectedResources);
    fetcher.submit(
      {
        _action: "DELETE",
        announcement_bar_id: selectedResources,
      },
      { method: "DELETE", action: ROUTES.ANNOUNCEMENT_OVERVIEW },
    );
    setConfirmDelete(false);
  };

  return (
    <LegacyCard>
      {barsData.length > 0 ? (
        <>
          <IndexTable
            resourceName={resourceName}
            itemCount={barsData.length}
            selectedItemsCount={
              allResourcesSelected ? "All" : selectedResources.length
            }
            onSelectionChange={handleSelectionChange}
            headings={[
              { title: `Showing ${barsData.length} announcement bar(s)` },
            ]}
            promotedBulkActions={promotedBulkActions}
          >
            {rowMarkup}
          </IndexTable>

          <div style={{ position: "absolute", top: "4px", right: "10px" }}>
            <PopoverContent
              options={announcementPopoverData}
              heading="Create"
              onSelect={handleCreateClick}
            />
            <DiscardChangesConfirmationPopup
              active={confirmDelete}
              toggleModal={() => setConfirmDelete(false)}
              primaryActionClick={handleDeleteConfirm}
              secondaryActionContent="Close"
              primaryActionContent="Delete"
              mainContent="This cannot be undone. Are you sure you want to delete the selected announcement bar(s)?"
              title={`Delete ${selectedResources.length} item(s)?`}
            />
          </div>
        </>
      ) : (
        <DynamicEmptyState
          heading="Create your first Announcement Bar"
          description="Display an interactive Free Shipping message, capture leads, or build trust using any of the 5 types of Announcement Bars."
          actionContent={
            <PopoverContent
              options={announcementPopoverData}
              heading="Create Announcement Bar"
              onSelect={handleCreateClick}
            />
          }
        />
      )}
    </LegacyCard>
  );
}

export default CheckBars;
