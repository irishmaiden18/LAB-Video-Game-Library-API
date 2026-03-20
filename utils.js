// import lodash
const _ = require("lodash")

// create a sort function
const sort = (data, sortBy, order) => {

    // sort the data with the lodash function
    const sortedData = _.sortBy(data, sortBy)

    // if sortOrder is descending
    if (order === "desc") {

        // flip the sort
        sortedData.reverse()
    }
    return sortedData
}

module.exports = sort