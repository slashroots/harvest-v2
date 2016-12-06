module.exports = {
    get: {
        access: ['aggregate_user'],
        fields: {
            restricted: {
                aggregate_user: ['IDX_Property', 'Property_Address', 'Volume_Num', 'Folio_Num', 'Ownership']
            }
        }
    }
};
