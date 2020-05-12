Products && Categories REST API'S

=========================================================================================
#Running app in local
=========================================================================================

1. Open configs/mongo-config.js and change mongo url with your mongodb credentials and make sure mongodb is running.

2. Navigate to application folder in terminal and run "npm install".

3. Navigate to application folder in terminal and run "node app.js".

4. Now the application will be running on port 3200.

==========================================================================================
#Running app through Docker
==========================================================================================

1. Install Docker on your system.

2. Navigate to application folder in terminal and run "docker-compose up -d".

3. Run the command "docker ps" to check whether mongo and app services are running.

4. If the two docker services are up , Now the application is running on port 3200.

==========================================================================================
#Endpoint of Application
==========================================================================================

1. "/addcategory" -- Post API to add categories.
    Required body params -- categoryname

2. "/addsubcategory/:id" -- Put API to add child categories(id of category).
    Required body params -- categoryname

3. "/categories" -- Get API to get all categories and its child categories.

4. "/addproduct" -- Post API to add products.
    Requiered body params -- title
                          -- description
                          -- imagepath
                          -- size
                          -- color
                          -- quantity
                          -- price
                          -- category (if only 1 category)(should post id of category)
                          -- category (to add multiple categories send category param multiple times with different values).
    Note : Should post id of category in category field.

5. "/updateproductdetails/:id" -- Put API to update productdetails.(id of product)
    Requiered body params -- title
                          -- description
                          -- imagepath
                          -- size
                          -- color
                          -- quantity
                          -- price (any one param is required)

6. "/products" -- Get API to get all products and its details.

7. "/products/:id" -- Get API to get single product details of id.

8. "/productsbycat/:id" -- Get API to get products based on categories (id of category).

===========================================================================================
API's Host for Docker and local
===========================================================================================

host = http://localhost:3200

Example API : http://localhost:3200/products