import React from "react";

import { Edit, Delete, LocationOn } from "@mui/icons-material";
import {
  Table,
  Paper,
  Stack,
  TableRow,
  Checkbox,
  TableBody,
  TableCell,
  TableHead,
  IconButton,
  Typography,
  TableContainer,
} from "@mui/material";

import { EmptyContent } from "src/components/empty-content"; 

const rows = []; 

const TimesheetTable = () => 
  rows.length !== 0 ? (
    <EmptyContent
      title="No Logs"
      description="No time logs added currently. To add new time logs, click Log Time"
    />
  ) : (
    <TableContainer component={Paper} sx={{ borderRadius: "10px", overflow: "hidden" }}>
      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: "#ECE9F1" }}>
            <TableCell>Checkbox</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Project</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Billable</TableCell>
            <TableCell>Hours</TableCell>
            <TableCell>Location</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, index) => (
            <TableRow key={index} sx={{ borderBottom: "1px solid #E0E0E0" }}>
              <TableCell>
                <Checkbox />
              </TableCell>
              <TableCell>
                <Typography variant="body1" fontWeight="bold">
                  {row.date}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body1" fontWeight="bold">
                  {row.project}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {row.tool}
                </Typography>
              </TableCell>
              <TableCell>{row.description}</TableCell>
              <TableCell>{row.billable}</TableCell>
              <TableCell>
                <Typography variant="body1" fontWeight="bold" color="green">
                  {row.time}
                </Typography>
              </TableCell>
              <TableCell>
                <IconButton>
                  <LocationOn />
                </IconButton>
              </TableCell>
              <TableCell>
                <Stack direction="row" spacing={1}>
                  <IconButton>
                    <Edit />
                  </IconButton>
                  <IconButton>
                    <Delete />
                  </IconButton>
                </Stack>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );


export default TimesheetTable;
