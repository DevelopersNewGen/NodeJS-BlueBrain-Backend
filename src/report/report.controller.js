import Report from './report.model.js';

export const getReports = async (req, res) => {
    try {
        const reports = await Report.find().populate('reportBy', 'name email').populate('reportTo', 'name email').populate('relatedSubject', 'name');
        return res.status(200).json({
            success: true,
            message: 'Reports retrieved successfully',
            reports
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error retrieving reports',
            error
        });
    }
}

export const updateStatus = async (req, res) => {
    const { reportId } = req.params;
    const { status } = req.body;

    try {
        const report = await Report.findByIdAndUpdate(reportId, { status }, { new: true });
        if (!report) {
            return res.status(404).json({
                success: false,
                message: 'Report not found'
            });
        }
        return res.status(200).json({
            success: true,
            message: 'Report status updated successfully',
            report
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error updating report status',
            error
        });
    }
}