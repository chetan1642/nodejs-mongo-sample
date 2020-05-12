var mongoose = require('mongoose');

var productSchema = mongoose.Schema({
  imagePath: {
    type: String
  },
  title: {
    type: String
  },
  description: {
    type: String
  },
  category: [{
    type: mongoose.Schema.Types.ObjectId, ref: 'Category'
}],
  price: {
    type: Number
  },
  color: {
    type: String
  },
  size: {
    type: String
  },
  quantity: {
    type: Number
  }
});

var Product = module.exports = mongoose.model('Product', productSchema);

module.exports.getAllProducts = function (query, sort, callback) {
  Product.find(query, null, sort, callback)
}


module.exports.getProductByCategory = function (query,sort, callback) {
  Product.find(query, null, sort, callback)
}

module.exports.getProductByTitle = function (query,sort, callback) {
  Product.find(query, null, sort, callback)
}


module.exports.filterProductByCategory = function (category, callback) {
  let regexp = new RegExp(`${category}`, 'i')
  var query = { category: { $regex: regexp } };
  Product.find(query, callback);
}

module.exports.filterProductByTitle = function (title, callback) {
  let regexp = new RegExp(`${title}`, 'i')
  var query = { title: { $regex: regexp } };
  Product.find(query, callback);
}

module.exports.getProductByID = function (id, callback) {
  Product.findById(id, callback);
}

module.exports.getProductbyCategory = (req, res) => {
  const category = req.param.category || 'All';
  const findCondition = (category.toLowerCase() === 'all') ? {} : { category: category };
  Product.find({ $text: { $search: category }}).toArray((err, docs) => {
    if (err) {
      return res.status(500).send(`Error: ${err}`);
    }

    res.json({ docs});
  });
};


module.exports.create = (req, res) => {
  // Validate request
  if(!req.body) {
      return res.status(400).send({
          message: "Product details content can not be empty"
      });
  }



  // Create a product
  const product = new Product({
      title: req.body.title || "Untitled Product", 
      description: req.body.description,
      imagePath: req.body.imagepath,
      category: req.body.category,
      price: req.body.price,
      color: req.body.color,
      size: req.body.size,
      quantity: req.body.quantity
  });

  // Save Product in the database
  product.save()
  .then(data => {
      res.send(data);
  }).catch(err => {
      res.status(500).send({
          message: err.message || "Some error occurred while creating the Product."
      });
  });
};

module.exports.update = (req, res) => {
  // Validate Request
  if(!req.body) {
      return res.status(400).send({
          message: "Product Details content can not be empty"
      });
  }

  
  Product.findByIdAndUpdate(req.params.id, {
    title: req.body.title || "Untitled Product", 
    description: req.body.description,
    imagePath: req.body.imagepath,
    category: req.body.category,
    price: req.body.price,
    color: req.body.color,
    size: req.body.size,
    quantity: req.body.quantity
  }, {new: true})
  .then(product => {
      if(!product) {
          return res.status(404).send({
              message: "Product not found with id " + req.params.id
          });
      }
      res.send(product);
  }).catch(err => {
      if(err.kind === 'ObjectId') {
          return res.status(404).send({
              message: "Product not found with id " + req.params.id
          });                
      }
      return res.status(500).send({
          message: "Error updating Product with id " + req.params.id
      });
  });
};

