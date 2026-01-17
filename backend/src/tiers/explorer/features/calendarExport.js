import ical from 'ical-generator';

// Helper function to check if user has Explorer tier or higher
const hasExplorerAccess = (tier) => {
    return tier === 'explorer';
};

// Export activities to iCal format
export const exportToCalendar = async (req, res) => {
    try {
        const { activities } = req.body;
        const userTier = req.user.tier;

        // Check tier access
        if (!hasExplorerAccess(userTier)) {
            return res.status(403).json({
                error: 'Export to Calendar is an Explorer feature. Upgrade to access this feature.'
            });
        }

        // Validate input
        if (!activities || !Array.isArray(activities) || activities.length === 0) {
            return res.status(400).json({ error: 'Activities array is required' });
        }

        // Create calendar
        const calendar = ical({
            name: 'Activity Finder - My Activities',
            prodId: {
                company: 'Activity Finder',
                product: 'Activity Finder App'
            },
            timezone: 'UTC'
        });

        // Add each activity as an event
        activities.forEach(activity => {
            const activityData = typeof activity === 'string'
                ? JSON.parse(activity)
                : activity;

            // Create event start time (default to next Saturday at 10 AM if no time specified)
            const startDate = new Date();
            startDate.setDate(startDate.getDate() + ((6 - startDate.getDay() + 7) % 7));
            startDate.setHours(10, 0, 0, 0);

            // Event duration: 2 hours by default
            const endDate = new Date(startDate);
            endDate.setHours(startDate.getHours() + 2);

            // Build description
            let description = activityData.name || 'Activity';
            if (activityData.category) {
                description += `\n\nCategory: ${activityData.category}`;
            }
            if (activityData.price) {
                description += `\nPrice: ${activityData.price}`;
            }
            if (activityData.description) {
                description += `\n\n${activityData.description}`;
            }
            description += '\n\nAdded from Activity Finder App';

            // Create event
            calendar.createEvent({
                start: startDate,
                end: endDate,
                summary: activityData.name || 'Activity',
                description: description,
                location: activityData.location || activityData.address || '',
                url: activityData.website || '',
                geo: activityData.lat && activityData.lon
                    ? { lat: activityData.lat, lon: activityData.lon }
                    : undefined
            });
        });

        // Set response headers for file download
        res.setHeader('Content-Type', 'text/calendar; charset=utf-8');
        res.setHeader('Content-Disposition', 'attachment; filename="activities.ics"');

        // Send the calendar
        res.send(calendar.toString());
    } catch (error) {
        console.error('Error exporting to calendar:', error);
        res.status(500).json({ error: 'Failed to export to calendar' });
    }
};
