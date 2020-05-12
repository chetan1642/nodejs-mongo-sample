var express = require('express');
var router = express.Router();
const Product = require('../models/Product')
const Category = require('../models/Category')
const TypedError = require('../modules/ErrorHandler')
var multer  = require('multer');
const upload = multer();


//GET /products
router.get('/products', function (req, res, next) {
  const { query, order } = categorizeQueryString(req.query)
  Product.getAllProducts(query, order, function (e, products) {
    if (e) {
      e.status = 406; return next(e);
    }
    if (products.length < 1) {
      return res.status(404).json({ message: "products not found" })
    }
    res.json({ products: products })
  })
});

//GET /products/:id
router.get('/products/:id', function (req, res, next) {
  let productId = req.params.id;
  Product.getProductByID(productId, function (e, item) {
    if (e) {
      e.status = 404; return next(e);
    }
    else {
      res.json({ product: item })
    }
  });
});

//get products by categories
router.get('/productsbycat/:id', (req, res, next) => {
  Product
      .find({category: req.params.id})
      .populate('category')
      .exec((err, products) => {
          if (err) return next(err);

          res.json({
              products: products
          });
      });
});

// POST Add Product
router.post('/addproduct', upload.none(), Product.create);

// POST Add Categories
router.post('/addcategory', upload.none(), Category.create);

//POST Add Sub Categories
router.put('/addsubcategory/:id', upload.none(), Category.update);

//put to Update Product Details 
router.put('/updateproductdetails/:id', upload.none(), Product.update);

//GET /categories
router.get('/categories', function (req, res, next) {
  Category.getAllCategories(function (err, c) {
    if (err) return next(err)
    res.json({ categories: c })
  })
})

//GET /search?
router.get('/search', function (req, res, next) {
  const { query, order } = categorizeQueryString(req.query)
  delete query['query']
  Product.getProductByDepartment(query, order, function (err, p) {
    if (err) return next(err)
    if (p.length > 0) {
      return res.json({ products: p })
    } else {
      query['category'] = query['department']
      delete query['department']
      Product.getProductByCategory(query, order, function (err, p) {
        if (err) return next(err)
        if (p.length > 0) {
          return res.json({ products: p })
        } else {
          query['title'] = query['category']
          delete query['category']
          Product.getProductByTitle(query, order, function (err, p) {
            if (err) return next(err)
            if (p.length > 0) {
              return res.json({ products: p })
            } else {
              query['id'] = query['title']
              delete query['title']
              Product.getProductByID(query.id, function (err, p) {
                let error = new TypedError('search', 404, 'not_found', { message: "no product exist" })
                if (err) {
                  return next(error)
                }
                if (p) {
                  return res.json({ products: p })
                } else {
                  return next(error)
                }
              })
            }
          })
        }
      })
    }
  })
})

function categorizeQueryString(queryObj) {
  let query = {}
  let order = {}
  //extract query, order, filter value
  for (const i in queryObj) {
    if (queryObj[i]) {
      // extract order
      if (i === 'order') {
        order['sort'] = queryObj[i]
        continue
      }
      // extract range
      if (i === 'range') {
        let range_arr = []
        let query_arr = []
        // multi ranges
        if (queryObj[i].constructor === Array) {
          for (const r of queryObj[i]) {
            range_arr = r.split('-')
            query_arr.push({
              price: { $gt: range_arr[0], $lt: range_arr[1] }
            })
          }
        }
        // one range
        if (queryObj[i].constructor === String) {
          range_arr = queryObj[i].split('-')
          query_arr.push({
            price: { $gt: range_arr[0], $lt: range_arr[1] }
          })
        }
        Object.assign(query, { $or: query_arr })
        delete query[i]
        continue
      }
      query[i] = queryObj[i]
    }
  }
  return { query, order }
}

module.exports = router;
