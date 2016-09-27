module.exports = {
    get: {
        access: ['aggregate'],
        fields: {
            allowed: {
                aggregate: ['First_Name', 'Middle_Name', 'Last_Name', "DOB"]
            }
        }
    }
};
