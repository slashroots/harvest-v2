module.exports = {
    get: {
        access: ['aggregate_user'],
        fields: {
            restricted: {
                aggregate_user: ['IDX_Farmer_Profile', 'IDX_Stakeholder', 'Respondent', 'Manager']
            }
        }
    }
};
