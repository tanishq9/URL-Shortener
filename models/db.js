const mongoose = require('mongoose');

// To store the auto-incremented counter 
var countersSchema = new mongoose.Schema({
    _id : {
        type : String,
        required : true
    },
    count : {
        type : Number,
        default : 0
    }
});

var Counter = mongoose.model('Counter',countersSchema);

// For storing the URLs
var urlSchema = new mongoose.Schema({
    // _id stores the value of hash(currentValue of counter)
    _id : {
        type : Number 
    },
    // url stores the original value of URL
    url : '',
    created_at : ''
});


// (collection_name,schema_name)
// Use pre('validate') instead of pre('save') to set the value for the required field. Mongoose validates documents before saving, therefore your save middleware won't be called if there are validation errors. Switching the middleware from save to validate will make your function set the number field before it is validated.
// pre is a middleware passed control during the async functions
urlSchema.pre('save',function(next){
    console.log('running pre-save');
    var doc = this;
    // doc is the current doc/row being saved
    // Counter.findByIdAndUpdate(id, update, callback) // executes
    // Syntax to find in mongoose : { <field1>: <value1>, ... }
    // Syntax to update in mongoose : { <update operator>: { <field1>: <value1>, ... }},
    Counter.findByIdAndUpdate({_id : 'url_count'},{ $inc:{ count : 1 }},function (err,counter) {
        if(err){
            return next(err);
        }
        console.log(counter);
        console.log(counter.count);
        doc._id = counter.count;
        doc.created_at = new Date();
        console.log(doc);
        next();
    });
});

// dont write it above the .pre() else URL will not contain that pre function
// (collection_name,schema_name)
var URL = mongoose.model('URL',urlSchema);

exports = module.exports = {
    Counter,
    URL
}
