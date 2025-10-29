import { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Divider,
  Alert,
  Paper,
  Badge,
} from '@mui/material';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { PickersDay } from '@mui/x-date-pickers/PickersDay';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { format, isSameDay } from 'date-fns';

// Mock data - Replace with actual API call
const mockInspections = [
  {
    id: 1,
    date: new Date(2025, 9, 30),
    time: '10:00 AM',
    inspectorName: 'John Smith',
    inspectorContact: '+1234567890',
    status: 'scheduled',
    notes: 'Initial property inspection for potential buyer',
    clientName: 'Sarah Johnson',
    clientEmail: 'sarah@example.com',
  },
  {
    id: 2,
    date: new Date(2025, 9, 30),
    time: '2:00 PM',
    inspectorName: 'Emily Davis',
    inspectorContact: '+1987654321',
    status: 'scheduled',
    notes: 'Follow-up inspection after repairs',
    clientName: 'Michael Brown',
    clientEmail: 'michael@example.com',
  },
  {
    id: 3,
    date: new Date(2025, 10, 5),
    time: '11:30 AM',
    inspectorName: 'Robert Wilson',
    inspectorContact: '+1122334455',
    status: 'scheduled',
    notes: 'Pre-purchase inspection',
    clientName: 'Lisa Anderson',
    clientEmail: 'lisa@example.com',
  },
];

function InspectionsTab({ propertyId }) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedInspection, setSelectedInspection] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Get inspections for selected date
  const inspectionsForDate = mockInspections.filter((inspection) =>
    isSameDay(inspection.date, selectedDate)
  );

  // Get all dates that have inspections
  const datesWithInspections = mockInspections.map((inspection) => inspection.date);

  // Custom day renderer to highlight dates with inspections
  const ServerDay = (props) => {
    const { day, outsideCurrentMonth, ...other } = props;
    const hasInspection = datesWithInspections.some((date) => isSameDay(date, day));

    return (
      <Badge
        key={day.toString()}
        overlap="circular"
        badgeContent={hasInspection ? '●' : undefined}
        color="secondary"
      >
        <PickersDay {...other} outsideCurrentMonth={outsideCurrentMonth} day={day} />
      </Badge>
    );
  };

  const handleInspectionClick = (inspection) => {
    setSelectedInspection(inspection);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedInspection(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled':
        return 'primary';
      case 'completed':
        return 'success';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Box className="w-full">
      <Alert severity="info" className="mb-16">
        <Typography variant="body2">
          Note: Inspection scheduling API is currently under development. This is a placeholder
          interface.
        </Typography>
      </Alert>

      <Box className="flex flex-col lg:flex-row gap-16 w-full">
        {/* Left Pane - Calendar (70%) */}
        <Paper className="flex-[0.7] p-24" elevation={1}>
          <Typography variant="h6" className="mb-16 font-semibold">
            Inspection Calendar
          </Typography>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DateCalendar
              value={selectedDate}
              onChange={(newDate) => setSelectedDate(newDate)}
              slots={{
                day: ServerDay,
              }}
              sx={{
                width: '100%',
                '& .MuiPickersDay-root': {
                  fontSize: '0.875rem',
                },
              }}
            />
          </LocalizationProvider>

          <Box className="mt-16 p-12 bg-gray-100 dark:bg-gray-800 rounded">
            <Typography variant="body2" color="text.secondary">
              <FuseSvgIcon size={16} className="mr-4">
                heroicons-outline:information-circle
              </FuseSvgIcon>
              Dates with blue dots have scheduled inspections. Click on a date to view details.
            </Typography>
          </Box>
        </Paper>

        {/* Right Pane - Inspection List (30%) */}
        <Paper className="flex-[0.3] p-24" elevation={1}>
          <Typography variant="h6" className="mb-16 font-semibold">
            Inspections for {format(selectedDate, 'MMM dd, yyyy')}
          </Typography>

          {inspectionsForDate.length === 0 ? (
            <Box className="flex flex-col items-center justify-center py-48">
              <FuseSvgIcon size={48} color="disabled">
                heroicons-outline:calendar
              </FuseSvgIcon>
              <Typography color="text.secondary" className="mt-16">
                No inspections scheduled for this date
              </Typography>
            </Box>
          ) : (
            <List>
              {inspectionsForDate.map((inspection, index) => (
                <div key={inspection.id}>
                  {index > 0 && <Divider className="my-8" />}
                  <ListItemButton onClick={() => handleInspectionClick(inspection)}>
                    <ListItemText
                      primary={
                        <Box className="flex items-center justify-between mb-4">
                          <Typography variant="subtitle2" className="font-semibold">
                            {inspection.time}
                          </Typography>
                          <Chip
                            label={inspection.status}
                            size="small"
                            color={getStatusColor(inspection.status)}
                            className="text-11"
                          />
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.primary">
                            Inspector: {inspection.inspectorName}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" className="mt-4">
                            Client: {inspection.clientName}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItemButton>
                </div>
              ))}
            </List>
          )}
        </Paper>
      </Box>

      {/* Inspection Details Modal */}
      <Dialog
        open={modalOpen}
        onClose={handleModalClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          elevation: 3,
        }}
      >
        <DialogTitle className="flex items-center justify-between">
          <Box className="flex items-center">
            <FuseSvgIcon className="mr-8" color="primary">
              heroicons-outline:clipboard-check
            </FuseSvgIcon>
            <Typography variant="h6">Inspection Details</Typography>
          </Box>
          <Chip
            label={selectedInspection?.status}
            size="small"
            color={getStatusColor(selectedInspection?.status)}
          />
        </DialogTitle>
        <Divider />
        <DialogContent>
          {selectedInspection && (
            <Box className="space-y-16">
              <Box>
                <Typography variant="subtitle2" color="text.secondary" className="mb-4">
                  Date & Time
                </Typography>
                <Typography variant="body1">
                  {format(selectedInspection.date, 'MMMM dd, yyyy')} at {selectedInspection.time}
                </Typography>
              </Box>

              <Divider />

              <Box>
                <Typography variant="subtitle2" color="text.secondary" className="mb-4">
                  Inspector Information
                </Typography>
                <Typography variant="body1">{selectedInspection.inspectorName}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {selectedInspection.inspectorContact}
                </Typography>
              </Box>

              <Divider />

              <Box>
                <Typography variant="subtitle2" color="text.secondary" className="mb-4">
                  Client Information
                </Typography>
                <Typography variant="body1">{selectedInspection.clientName}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {selectedInspection.clientEmail}
                </Typography>
              </Box>

              <Divider />

              <Box>
                <Typography variant="subtitle2" color="text.secondary" className="mb-4">
                  Notes
                </Typography>
                <Typography variant="body2">{selectedInspection.notes}</Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions className="px-24 pb-16">
          <Button onClick={handleModalClose} variant="outlined">
            Close
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<FuseSvgIcon size={16}>heroicons-outline:pencil</FuseSvgIcon>}
          >
            Update Status
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default InspectionsTab;
