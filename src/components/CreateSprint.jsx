import React, { useState } from 'react';
import {
    Box, TextField, Button, Typography, Paper, Grid, CircularProgress
} from '@mui/material';
import { toast } from 'react-toastify';

const CreateSprint = ({ authToken, setCurrentPage }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [loading, setLoading] = useState(false);

    // Helper to get today's date in YYYY-MM-DD format for min attribute
    const getTodayDateString = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Basic validation
        if (!title || !startDate || !endDate) {
            toast.error('Vui lòng điền đầy đủ các thông tin bắt buộc (Tiêu đề, Ngày bắt đầu, Ngày kết thúc).');
            setLoading(false);
            return;
        }

        const start = new Date(startDate);
        const end = new Date(endDate);

        if (start > end) {
            toast.error('Ngày bắt đầu không thể sau Ngày kết thúc.');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/api/sprint/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`,
                },
                body: JSON.stringify({
                    title,
                    describe: description, // Keeping 'describe' to match your current backend controller
                    startDate,
                    endDate,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success(data.message || 'Tạo sprint thành công!');
                setCurrentPage('/sprints'); // Navigate back to sprints list after success
            } else {
                toast.error(data.message || 'Lỗi khi tạo sprint.');
            }
        } catch (err) {
            toast.error('Lỗi kết nối đến máy chủ.');
            console.error('Error creating sprint:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ p: 3, maxWidth: 600, margin: 'auto' }}>
            <Paper elevation={3} sx={{ p: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mb: 4 }}>
                    Tạo Sprint Mới
                </Typography>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Tiêu đề Sprint"
                                variant="outlined"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Mô tả Sprint"
                                variant="outlined"
                                multiline
                                rows={4}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Ngày bắt đầu"
                                type="date"
                                variant="outlined"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                required
                                inputProps={{
                                    min: getTodayDateString(), // Prevent selecting past dates
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Ngày kết thúc"
                                type="date"
                                variant="outlined"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                required
                                inputProps={{
                                    min: startDate || getTodayDateString(), // End date must be after or same as start date
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                fullWidth
                                disabled={loading}
                                sx={{ mt: 2, py: 1.5 }}
                            >
                                {loading ? <CircularProgress size={24} /> : 'Tạo Sprint'}
                            </Button>
                        </Grid>
                        <Grid item xs={12}>
                            <Button
                                variant="outlined"
                                color="secondary"
                                fullWidth
                                onClick={() => setCurrentPage('/sprints')}
                                sx={{ mt: 1 }}
                            >
                                Hủy
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Box>
    );
};

export default CreateSprint;