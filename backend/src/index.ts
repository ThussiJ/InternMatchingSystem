import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import authRoutes from './routes/auth';
import internshipRoutes from './routes/internship';
import studentRoutes from './routes/student';
import employerRoutes from './routes/employer';
import applicationRoutes from './routes/application';
import savedInternshipRoutes from './routes/savedInternship';
import adminRoutes from './routes/admin';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5005;

app.use(cors());
app.use(express.json());

// Serve static files for uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/internships', internshipRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/employers', employerRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/saved-internships', savedInternshipRoutes);
app.use('/api/admin', adminRoutes);


app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'InternTalentConnect API is running' });
});

// Global Error Handler for Multer and other middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (err) {
        if (err.name === 'MulterError' || err.message === 'Unexpected field' || err.message.includes('files are allowed')) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({ message: 'File is too large. Maximum size allowed is 5MB.' });
            }
            return res.status(400).json({ message: err.message });
        }
        console.error('Express Global Error:', err);
        return res.status(500).json({ message: err.message || 'Internal Server Error' });
    }
    next();
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

setInterval(() => {
    console.log('Keep-alive ping...');
}, 5000);

process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
});
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection:', reason);
});
