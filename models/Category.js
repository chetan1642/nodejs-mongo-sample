var mongoose    = require('mongoose');

var categorySchema  = mongoose.Schema({
    categoryName: {
        type: String,
        index   : true,
        unique: true, 
        lowercase: true
    },
    childcategories: [{categoryName: {
        type: String,
        index   : true
     }}]
});

var Category = module.exports = mongoose.model('Category', categorySchema);

module.exports.getAllCategories = function(callback){
    Category.find(callback)
}

module.exports.getCategoryById = function(id, callback){
    Category.findById(id, callback);
}

module.exports.create = (req, res) => {
    // Validate request
    if(!req.body) {
        return res.status(400).send({
            message: "Category Details content can not be empty"
        });
    }
  
    // Create a category
    const category = new Category({
        categoryName:req.body.categoryname
           });
  console.log(category)
    // Save category in the database
    category.save()
    .then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the Category."
        });
    });
  };

  module.exports.update = (req, res) => {
    // Validate Request
    if(!req.body) {
        return res.status(400).send({
            message: "Category Details content can not be empty"
        });
    }
    var id = req.params.id;
    Category.findByIdAndUpdate(id, {$push:{
        childcategories:[{categoryName:req.body.categoryname}]
      }}, {new: true})
      .then(category => {
          if(!category) {
              return res.status(404).send({
                  message: "Category not found with id " + req.params.id
              });
          }
          res.send(category);
      }).catch(err => {
          if(err.kind === 'ObjectId') {
              return res.status(404).send({
                  message: "Category not found with id " + req.params.id
              });                
          }
          return res.status(500).send({
              message: "Error updating Category with id " + req.params.id
        });
    });
  };
