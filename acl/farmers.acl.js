module.exports = {
    get: {
        access: ['aggregate_user'],
        fields: {
            allowed: {
                aggregate_user: ['Education_Level', 'Farmer_Type', 'Main_Agri_Activity']
            }
        }
    }
};
