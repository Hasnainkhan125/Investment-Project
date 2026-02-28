import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

const Requests = () => {
  const [requests, setRequests] = useState([]);
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  useEffect(() => {
    const storedRequests = JSON.parse(localStorage.getItem("adminRequests") || "[]");
    setRequests(storedRequests.reverse());
  }, []);

  const handleApprove = (id) => {
    const updatedRequests = requests.map(req =>
      req.id === id ? { ...req, status: "Approved" } : req
    );
    setRequests(updatedRequests);
    localStorage.setItem("adminRequests", JSON.stringify([...updatedRequests].reverse()));

    // Store approved email for admin dashboard access
    const approvedReq = updatedRequests.find(r => r.id === id);
    let admins = JSON.parse(localStorage.getItem("admins") || "[]");
    if (!admins.includes(approvedReq.email)) {
      admins.push(approvedReq.email);
      localStorage.setItem("admins", JSON.stringify(admins));
    }

    // Trigger ChoosePanel update
    localStorage.setItem("approvalUpdated", "true");
  };

  const handleReject = (id) => {
    const updatedRequests = requests.map(req =>
      req.id === id ? { ...req, status: "Rejected" } : req
    );
    setRequests(updatedRequests);
    localStorage.setItem("adminRequests", JSON.stringify([...updatedRequests].reverse()));
  };

  const handleDelete = (id) => {
    const updatedRequests = requests.filter(req => req.id !== id);
    setRequests(updatedRequests);
    localStorage.setItem("adminRequests", JSON.stringify([...updatedRequests].reverse()));
  };

  const handleView = (req) => {
    setSelectedRequest(req);
    setViewOpen(true);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" mb={3}>Admin Requests</Typography>

      {requests.length === 0 ? (
        <Typography>No requests yet.</Typography>
      ) : (
        <List>
          {requests.map((req) => (
            <Paper key={req.id} sx={{ mb: 2, p: 2 }}>
              <ListItem sx={{ display: "block" }}>
                <Typography variant="h6" sx={{ color: "#008080" }}>
                  {req.name} requested access
                </Typography>
                <Typography>Email: {req.email}</Typography>
                <Typography>Password: {req.password}</Typography>
                <Typography>Message: {req.message}</Typography>
                <Typography>Date: {req.date}</Typography>
                <Typography>Status: {req.status || "Pending"}</Typography>

                <Box mt={2} display="flex" gap={1}>
                  {req.status === "Pending" && (
                    <>
                      <Button
                        variant="contained"
                        color="success"
                        onClick={() => handleApprove(req.id)}
                      >
                        Approve
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => handleReject(req.id)}
                      >
                        Reject
                      </Button>
                    </>
                  )}
                  <Button variant="outlined" color="primary" onClick={() => handleView(req)}>View</Button>
                  <Button variant="outlined" color="error" onClick={() => handleDelete(req.id)}>Delete</Button>
                </Box>
              </ListItem>
            </Paper>
          ))}
        </List>
      )}

      <Dialog open={viewOpen} onClose={() => setViewOpen(false)}>
        <DialogTitle>Request Details</DialogTitle>
        <DialogContent>
          {selectedRequest && (
            <Box>
              <Typography variant="h6" sx={{ color: "#008080" }}>{selectedRequest.name}</Typography>
              <Typography>Email: {selectedRequest.email}</Typography>
              <Typography>Password: {selectedRequest.password}</Typography>
              <Typography>Message: {selectedRequest.message}</Typography>
              <Typography>Date: {selectedRequest.date}</Typography>
              <Typography>Status: {selectedRequest.status || "Pending"}</Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Requests;
