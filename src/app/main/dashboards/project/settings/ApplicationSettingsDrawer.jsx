import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import { memo, useState } from "react";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import SettingsTable from "./SettingsTable";
import SettingsForm from "./SettingsForm";
import {
  useCreateApplicationSetting,
  useUpdateApplicationSetting,
} from "src/app/api/application-settings/useSettings";

/**
 * ApplicationSettingsDrawer - Comprehensive settings management drawer
 * Slides in from the right, takes 50% of screen width
 */
function ApplicationSettingsDrawer({ open, onClose }) {
  const [tabValue, setTabValue] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [editingSettings, setEditingSettings] = useState(null);

  const createSetting = useCreateApplicationSetting();
  const updateSettings = useUpdateApplicationSetting();

  const handleTabChange = (_event, newValue) => {
    setTabValue(newValue);
    setShowForm(false);
    setEditingSettings(null);
  };

  const handleAddNew = () => {
    setEditingSettings(null);
    setShowForm(true);
  };

  const handleEdit = (settings) => {
    setEditingSettings(settings);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingSettings(null);
  };

  const handleSave = (data) => {
    // TODO: Implement API call to save settings

    if (editingSettings) {
      // console.log('Saving settings:', data);
      updateSettings.mutate({
        settingId: editingSettings.id,
        settingData: data,
      });
    } else {
      // console.log('creating settings:', data);
      createSetting.mutate(data);
      if (createSetting.isSuccess) {
        setShowForm(false);
        setEditingSettings(null);
      }
    }
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={() => {}} // Prevent closing on backdrop click or ESC key
      disableEscapeKeyDown // Disable ESC key closing
      hideBackdrop={false} // Show backdrop but don't allow close on click
      ModalProps={{
        onBackdropClick: (e) => {
          e.stopPropagation(); // Prevent backdrop click from closing
        },
      }}
      PaperProps={{
        sx: {
          width: "50%",
          minWidth: "600px",
          maxWidth: "900px",
        },
      }}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-24 bg-primary-50 dark:bg-primary-900">
          <div className="flex items-center">
            <div className="flex items-center justify-center w-48 h-48 rounded-full bg-primary text-white mr-16">
              <FuseSvgIcon size={24}>heroicons-outline:cog</FuseSvgIcon>
            </div>
            <div>
              <Typography className="text-2xl font-bold">
                Application Settings
              </Typography>
              <Typography className="text-sm text-secondary">
                Manage platform configurations and access control
              </Typography>
            </div>
          </div>
          <IconButton onClick={onClose} size="large">
            <FuseSvgIcon>heroicons-outline:x</FuseSvgIcon>
          </IconButton>
        </div>

        <Divider />

        {/* Tabs Navigation */}
        <Box className="px-24 pt-16 bg-background-paper">
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
          >
            <Tab
              label={
                <div className="flex items-center">
                  <FuseSvgIcon size={18} className="mr-8">
                    heroicons-outline:view-list
                  </FuseSvgIcon>
                  All Settings
                </div>
              }
            />
            <Tab
              label={
                <div className="flex items-center">
                  <FuseSvgIcon size={18} className="mr-8">
                    heroicons-outline:user-circle
                  </FuseSvgIcon>
                  Admin Portal
                </div>
              }
            />
            <Tab
              label={
                <div className="flex items-center">
                  <FuseSvgIcon size={18} className="mr-8">
                    heroicons-outline:shopping-bag
                  </FuseSvgIcon>
                  Merchant Portal
                </div>
              }
            />
            <Tab
              label={
                <div className="flex items-center">
                  <FuseSvgIcon size={18} className="mr-8">
                    heroicons-outline:user-group
                  </FuseSvgIcon>
                  User Portal
                </div>
              }
            />
          </Tabs>
        </Box>

        <Divider />

        {/* Action Bar */}
        {!showForm && (
          <div className="flex items-center justify-between px-24 py-16 bg-gray-50 dark:bg-gray-900">
            <Typography className="text-sm text-secondary">
              {tabValue === 0 && "Showing all platform settings"}
              {tabValue === 1 && "Admin Dashboard Settings"}
              {tabValue === 2 && "Merchant Portal Settings"}
              {tabValue === 3 && "User Portal Settings"}
            </Typography>
            <Button
              variant="contained"
              color="secondary"
              size="small"
              startIcon={
                <FuseSvgIcon size={16}>heroicons-outline:plus</FuseSvgIcon>
              }
              onClick={handleAddNew}
            >
              Add New Settings
            </Button>
          </div>
        )}

        {/* Content Area */}
        <div className="flex-1 overflow-auto">
          {showForm ? (
            <SettingsForm
              settings={editingSettings}
              onSave={handleSave}
              onCancel={handleCloseForm}
              isLoading={createSetting.isLoading || updateSettings.isLoading}
              platformFilter={
                tabValue === 0
                  ? null
                  : ["ADMIN", "MERCHANT", "USER"][tabValue - 1]
              }
            />
          ) : (
            <SettingsTable
              platformFilter={
                tabValue === 0
                  ? null
                  : ["ADMIN", "MERCHANT", "USER"][tabValue - 1]
              }
              onEdit={handleEdit}
            />
          )}
        </div>

        {/* Footer */}
        <Divider />
        <div className="flex items-center justify-between px-24 py-16 bg-background-paper">
          <Typography className="text-xs text-secondary">
            Last updated: Just now
          </Typography>
          <div className="flex items-center space-x-8">
            <FuseSvgIcon size={16} className="text-green-500">
              heroicons-solid:check-circle
            </FuseSvgIcon>
            <Typography className="text-xs font-medium text-green-600">
              All systems operational
            </Typography>
          </div>
        </div>
      </div>
    </Drawer>
  );
}

export default memo(ApplicationSettingsDrawer);
