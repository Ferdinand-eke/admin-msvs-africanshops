import FusePageSimple from "@fuse/core/FusePageSimple";
import { styled } from "@mui/material/styles";
import Avatar from "@mui/material/Avatar";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Typography from "@mui/material/Typography";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import useThemeMediaQuery from "@fuse/hooks/useThemeMediaQuery";

// import InspectionsTab from "./tabs/inspections/InspectionsTab";
import AboutTab from "./tabs/about/AboutTab";
import OffersTab from "./tabs/offers/OffersTab";
import AcquisitionsTab from "./tabs/acquisitions/AcquisitionsTab";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import FuseLoading from "@fuse/core/FuseLoading";
import { useTheme } from "@mui/material/styles";
import { useNavigate, useParams } from "react-router-dom";
import useEstateProperty from "src/app/api/admin-handle-estateproperties/useEstateProperty";

const Root = styled(FusePageSimple)(({ theme }) => ({
  "& .FusePageSimple-header": {
    backgroundColor: theme.palette.background.paper,
    borderBottomWidth: 1,
    borderStyle: "solid",
    borderColor: theme.palette.divider,
    "& > .container": {
      maxWidth: "100%",
    },
  },
}));

const STORAGE_KEY = "propertyProfileActiveTab";

/**
 * The property profile page with Inspections, Offers, and Acquisitions tabs.
 */
function PropertyProfileApp() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { propertyId } = useParams();

  // Fetch property data
  const { data: property, isLoading: propertyLoading } = useEstateProperty(propertyId);

  console.log("PROPERTY__DATA", property)

  // Initialize tab from localStorage or default to 0
  const [selectedTab, setSelectedTab] = useState(() => {
    const savedTab = localStorage.getItem(STORAGE_KEY);
    return savedTab ? parseInt(savedTab, 10) : 0;
  });

  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down("lg"));

  // Persist tab selection to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, selectedTab.toString());
  }, [selectedTab]);

  function handleTabChange(_event, value) {
    setSelectedTab(value);
  }

  if (propertyLoading) {
    return <FuseLoading />;
  }

  if (!property) {
    return (
      <Box className="flex flex-col items-center justify-center min-h-screen p-48">
        <FuseSvgIcon size={64} color="disabled">
          heroicons-outline:home
        </FuseSvgIcon>
        <Typography color="text.secondary" className="mt-16" variant="h6">
          Property not found
        </Typography>
      </Box>
    );
  }

  return (
    <Root
      header={
        <div className="flex flex-col w-full">
          {/* Reduced height banner - property cover image */}
          <img
            className="h-120 lg:h-200 object-cover w-full"
            src={property?.coverImage || property?.images?.[0] || "assets/images/pages/profile/cover.jpg"}
            alt="Property Cover"
          />

          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1, transition: { delay: 0.3 } }}
          >
            <Typography
              className="flex items-center sm:mb-12 cursor-pointer"
              onClick={() => navigate(-1)}
              role="button"
              color="inherit"
            >
              <FuseSvgIcon size={20}>
                {theme.direction === "ltr"
                  ? "heroicons-outline:arrow-sm-left"
                  : "heroicons-outline:arrow-sm-right"}
              </FuseSvgIcon>
              <span className="flex mx-4 font-medium">Property Listings</span>
            </Typography>
          </motion.div>

          <div className="mt-20 flex flex-col flex-0 lg:flex-row items-center max-w-5xl w-full mx-auto px-32 lg:h-72">
            <div className="-mt-72 lg:-mt-64 rounded-full">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1, transition: { delay: 0.1 } }}
              >
                <Avatar
                  sx={{ borderColor: "background.paper" }}
                  className="w-128 h-128 border-4"
                  src={property?.images?.[0] || "assets/images/avatars/male-04.jpg"}
                  alt={property?.title}
                >
                  <FuseSvgIcon size={64}>heroicons-outline:home</FuseSvgIcon>
                </Avatar>
              </motion.div>
            </div>

            <div className="flex flex-col items-center lg:items-start mt-16 lg:mt-0 lg:ml-32">
              <Typography className="text-lg font-bold leading-none">
                {property?.title || "Property"}
              </Typography>
              <Typography color="text.secondary">
                {[property?.city, property?.state, property?.country]
                  .filter(Boolean)
                  .join(", ") || "Location not specified"}
              </Typography>
            </div>

            <div className="hidden lg:flex h-32 mx-32 border-l-2" />

            <div className="flex items-center mt-24 lg:mt-0 space-x-24">
              <div className="flex flex-col items-center">
                <Typography className="font-bold">{property?.offersCount || 0}</Typography>
                <Typography
                  className="text-sm font-medium"
                  color="text.secondary"
                >
                  OFFERS
                </Typography>
              </div>
              <div className="flex flex-col items-center">
                <Typography className="font-bold">{property?.inspectionsCount || 0}</Typography>
                <Typography
                  className="text-sm font-medium"
                  color="text.secondary"
                >
                  INSPECTIONS
                </Typography>
              </div>
            </div>

            <div className="flex flex-1 justify-end my-16 lg:my-0">
              <Tabs
                value={selectedTab}
                onChange={handleTabChange}
                indicatorColor="primary"
                textColor="inherit"
                variant="scrollable"
                scrollButtons={false}
                className="-mx-4 min-h-40"
                classes={{
                  indicator: "flex justify-center bg-transparent w-full h-full",
                }}
                TabIndicatorProps={{
                  children: (
                    <Box
                      sx={{ bgcolor: "text.disabled" }}
                      className="w-full h-full rounded-full opacity-20"
                    />
                  ),
                }}
              >
                <Tab
                  className="text-14 font-semibold min-h-40 min-w-64 mx-4 px-12"
                  disableRipple
                  label="Inspections"
                />
                <Tab
                  className="text-14 font-semibold min-h-40 min-w-64 mx-4 px-12"
                  disableRipple
                  label="Offers"
                />
                <Tab
                  className="text-14 font-semibold min-h-40 min-w-64 mx-4 px-12"
                  disableRipple
                  label="Acquisitions"
                />
                <Tab
                  className="text-14 font-semibold min-h-40 min-w-64 mx-4 px-12"
                  disableRipple
                  label="About"
                />
              </Tabs>
            </div>
          </div>
        </div>
      }
      content={
        <div className="flex flex-auto justify-center w-full max-w-full mx-auto p-24 sm:p-32">
          {/* {selectedTab === 0 && <InspectionsTab propertyId={propertyId} />} */}
          {selectedTab === 0 && <>
          <p>The first tab</p>
          </>} 
          {selectedTab === 1 && <OffersTab propertyId={propertyId} />}
          {selectedTab === 2 && <AcquisitionsTab propertyId={propertyId} />}
          {selectedTab === 3 && <AboutTab propertyId={propertyId} />}
        </div>
      }
      scroll={isMobile ? "normal" : "page"}
    />
  );
}

export default PropertyProfileApp;
