import React, { useEffect, useState } from "react";
import AnnouncementCustomization from "../../../../../components/templates/AnnouncementCustomization";

import { useFetcher, useParams, useSearchParams } from "@remix-run/react";
import { FETCHER_STATE, ROUTES } from "../../../../../utils/constants";
import SpinnerExample from "../../../../../components/atoms/Spinner";
import { isLoading } from "../../../../../utils/clientFunctions";

const Customization = () => {
  const { AnnouncementBarType } = useParams();
  const fetcher = useFetcher();
  const [fetchQuery] = useSearchParams();
  const [customizationData, setCustomizationData] = useState(null);

  const barId = fetchQuery.get("id");
  useEffect(() => {
    if (barId) {
      fetcher.load(ROUTES.ANNOUNCEMENT_OVERVIEW + "?id=" + barId);
    }
  }, [barId]);

  useEffect(() => {
    if (fetcher.data) {
      const data = fetcher.data.announcement_bars;

      setCustomizationData({
        id: data.id,
        status: Number(data.status).toString(),
        name: data.name,
        themeStyle: JSON.parse(data.theme_style),
        themeSettings: JSON.parse(data.theme_setting),
        generalSettings: JSON.parse(data.general_setting),
      });
    }
  }, [fetcher.data]);

  return (
    <div>
      {isLoading(fetcher.state) ? (
        <SpinnerExample></SpinnerExample>
      ) : (
        <AnnouncementCustomization
          announcementBarType={Number(AnnouncementBarType)}
          backActionRoute={ROUTES.ANNOUNCEMENT_OVERVIEW}
          initialData={customizationData}
        ></AnnouncementCustomization>
      )}
    </div>
  );
};

export default Customization;
