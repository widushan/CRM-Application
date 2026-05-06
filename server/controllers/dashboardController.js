import leadModel from "../models/Lead.js";

// Get Dashboard Stats
const getStats = async (req, res) => {
    try {
        const stats = await leadModel.aggregate([
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 },
                    totalValue: { $sum: "$dealValue" }
                }
            }
        ]);

        const totalLeads = await leadModel.countDocuments();
        
        // Sum of all deal values
        const totalDealValueData = await leadModel.aggregate([
            { $group: { _id: null, total: { $sum: "$dealValue" } } }
        ]);
        const totalDealValue = totalDealValueData.length > 0 ? totalDealValueData[0].total : 0;

        // Sum of won deals
        const wonDealValueData = await leadModel.aggregate([
            { $match: { status: "Won" } },
            { $group: { _id: null, total: { $sum: "$dealValue" } } }
        ]);
        const wonDealValue = wonDealValueData.length > 0 ? wonDealValueData[0].total : 0;

        // Group by status counts for the chart/dashboard
        const statusCounts = {
            New: 0,
            Contacted: 0,
            Qualified: 0,
            "Proposal Sent": 0,
            Won: 0,
            Lost: 0
        };

        stats.forEach(item => {
            if (statusCounts.hasOwnProperty(item._id)) {
                statusCounts[item._id] = item.count;
            }
        });

        res.json({
            success: true,
            totalLeads,
            totalDealValue,
            wonDealValue,
            statusCounts
        });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

export { getStats };
