module.exports = {
    get: {
        access: ['aggregate_user'],
        fields: {
            restricted: {
                aggregate_user: ['Property_Address', 'IDX_Crop', 'IDX_Property']
            }
        }
    }
};
