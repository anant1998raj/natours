////refactoring the api features....by creating a class in which adding 1 method for each API FEATURES........(sort ,filter,limit,paginate)
class APIFeatures {
    // here  query= moongoose query and queryString = query which we get through express,coming fro routes
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }
    // for filter change query tyo this.query and queryString to this.queryString
    filter() {
        //    replacing req.query with this.queryString
        const queryObj = { ...this.queryString };
        const excludedFields = ['page', 'sort', 'limit', 'fields'];
        excludedFields.forEach(el => delete queryObj[el]);
        // for advance filter
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
        this.query = this.query.find(JSON.parse(queryStr));
        return this;
    }

    ////sorting
    sort() {
        //    repalcing req.query.sort with  this.queryStrig
        if (this.queryString.sort) {
            const SortBy = this.queryString.sort.split(',').join(' ');
            this.query = this.query.sort(SortBy);
        }
        else {
            this.query = this.query.sort('-createdAt');
        }
        return this;

    }
    ////limitFields
    limitFields() {
        if (this.queryString.fields) {
            const fields = this.queryString.fields.split(',').join(' ');
            this.query = this.query.select(fields);
        } else {
            this.query = this.query.select('-__v');
        }
        return this;
    }
    //// paginate
    paginate() {
        const page = this.queryString.page * 1 || 1;
        const limit = this.queryString.limit * 1 || 100;
        const skip = (page - 1) * limit;
        this.query = this.query.skip(skip).limit(limit);
        return this;
    }
}
module.exports=APIFeatures;