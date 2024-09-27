import _ from "@lodash";
/**
 * The product model. 
 */
const ProductModel = (data) =>
  _.defaults(data || {}, {
    id: _.uniqueId("product-"),
    name: "",
    images: [],
    description: "",

    // handle: "",
    // categories: [],
    // tags: [],
    // featuredImageId: "",
   
    // priceTaxExcl: 0,
    // priceTaxIncl: 0,
    // taxRate: 0,
    // comparedPrice: 0,
    // quantity: 0,
    // sku: "",
    // width: "",
    // height: "",
    // depth: "",
    // weight: "",
    // extraShippingFee: 0,
    // price: "",
    // active: true,
    // image: "",
    // total: "",


    flag: "",
    isFeatured: "",
    isInOperation: "",
    isPublished: "",
    countrylocation:"",

  });
export default ProductModel;
