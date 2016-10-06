module.exports = {
    get: {
        access: ['aggregate_user'],
        fields: {
            allowed: {
                aggregate_user: ['First_Name', 'Middle_Name', 'Last_Name', "DOB"]
            }
        }
    }
};
