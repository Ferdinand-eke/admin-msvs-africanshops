import axios from "axios";
import Cookies from "js-cookie";
import {
  getAdminAccessToken,
  resetSessionForAdminUsers,
} from "../aaqueryhooks/utils/opsUtils";
import { toast } from "react-toastify";

/**
 * MAIN APIs STARTS
 */
const baseDomain = import.meta.env
  .VITE_API_BASE_URL_PROD; /**production & dev */

// console.log("domain from ENV", baseDomain)

// const baseDomain = "http://localhost:8000";
//====================================================
/***Digital Ocean Server : Current main server*/

// const baseDomain = "https://coral-app-n8ox9.ondigitalocean.app"; //deployed serve

//===================================================================================

export const baseUrl = `${baseDomain}`;

export default function Api() {
  const Api = axios.create({
    baseURL: baseUrl,
  });

  return Api;
}

export function authApi() {
  const TOKEN = getAdminAccessToken();
  const customHeaders = {
    Accept: "application/json",
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  };

  const Api = axios.create({
    baseURL: baseUrl,

    headers: { admincreed: `Bearer ${TOKEN}` },
  });

  Api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error?.response?.status === 403) {
        console.log("responseSTATS", error?.response?.status);
        AdminLogOutCall();
        toast.error(
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message
        );

        return Promise.reject({ status: 401, errors: ["Unauthorized"] });
      }

      if (error.response?.status === 422) {
        let errors = Object.values(error?.response?.data?.errors || {});

        return Promise.reject({
          status: 422,
          errorsRaw: errors,
          errors: errors.reduce((error) => error),
        });
      }

      console.error(error);
      toast.error(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );

      return Promise.reject({
        status: error?.response?.status,
        message:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  );

  return Api;
}

//News Blog
export const getNewBlogPosts = () => Api().get("/posts");
export const getNewBlogPostsById = (id) => authApi().get(`/posts/${id}`);

export const adminSigin = (formData) => {
  // console.log("LOGIN_API_CALL", formData)
  return Api().post("/authadmin/adminlogin", formData);
};

/*****
 * ###############################################################################
 * Departments handling starts here  (All functional as @ 20th August, 2024)
 * ###############################################################################
 */
//departments
export const getDepts = () => Api().get("/departments"); //done
export const getDeptById = (id) => Api().get(`/departments/${id}`); //done
export const createDepartMent = (deptFormData) =>
  authApi().post("/departments", deptFormData); //done

export const updateDeptById = (deptFormData) => {
  return authApi().put(`/departments/${deptFormData?._id}`, deptFormData); //done
};
export const deleteDepartmentById = (id) =>
  authApi().delete(`/departments/${id}`);

/*****
 * ####################################################################
 * Departments handling ends here
 * ______________________________________________________________________
 * ####################################################################
 */

/*****
 * ###############################################################################
 * Designation handling starts here  (All functional as @ 20th August, 2024)
 * ###############################################################################
 */
//designation
export const getDesigs = () => Api().get("/designations"); //done
export const getDesigById = (id) => Api().get(`/designations/${id}`); //done
export const getDesigByDepartmentId = (id) =>
  Api().get(`/designations/bydept/${id}`); //done
export const updateDesigById = (desigFormData) => {
  return authApi().put(`/designations/${desigFormData?._id}`, desigFormData); //done
};
export const createDesignation = (desigFormData) =>
  authApi().post("/designations", desigFormData); //done
export const deleteDesignationById = (id) =>
  authApi().delete(`/designations/${id}`);

/*****
 * ####################################################################
 * Designation handling ends here
 * ______________________________________________________________________
 * ####################################################################
 */

/*****
 * ###############################################################################
 * countries handling starts here  (All functional as @ 20th August, 2024)
 * ###############################################################################
 */
//Countries
export const getCountries = () => authApi().get("/buzcountries"); //done

/****operational countries */
export const getCountriesWithShippinTable = () =>
  Api().get("/buzcountries/with-shipping-table"); //done

export const getCountriesWithShippinTableExcludeOrigin = (originId) =>
  Api().get(`/buzcountries/with-shipping-table/excluded-origin/${originId}`); //done

export const getCountryById = (id) => authApi().get(`/buzcountries/${id}`); //done

export const updateCountryById = (countryFormData) => {
  return authApi().put(
    `/buzcountries/${countryFormData?._id}`,
    countryFormData
  ); //done
};

export const createCountry = (countryFormData) =>
  authApi().post("/buzcountries", countryFormData); //done

//operational countries
export const getOperationalCountries = () =>
  authApi().get("/buzcountries/operational"); //done
export const getOperationalCountryById = (id) =>
  Api().get(`/buzcountries/operationale/${id}`); //done

/**============================================================================================ */
/***Shipping Table routes */
export const createCountryShippingTable = (countryFormData) =>
  authApi().post("/buzcountries/add-shipping-table", countryFormData); //done

export const updateCountryShippingTableById = (countryFormData) => {
  return authApi().put(
    `/buzcountries/update-shipping-table/${countryFormData?.countryToShipTo}`,
    countryFormData
  ); //done
};

export const deleteCountryShippingTableById = (countryFormData) => {
  // console.log("InROUTES-FILE", countryFormData)
  return authApi().put(
    `/buzcountries/delete-shipping-table/${countryFormData?.countryToShipTo}`,
    countryFormData
  ); //done
};

export const getCountryShippingTable = (shipFrom, id) =>
  Api().get(`/buzcountries/get-shipping-table/${shipFrom}/${id}`);
export const deleteCountryById = (id) =>
  authApi().delete(`/buzcountries/${id}`);
/*****
 * ####################################################################
 * countries handling ends here
 * ______________________________________________________________________
 * ####################################################################
 */

/**=================================================================================== */

/*****
 * ####################################################################
 * states handling starts here  (All done as @ 20th August, 2024)
 * ####################################################################
 */
export const getBStates = () => authApi().get("/buzstates"); //done
export const getStateById = (id) => authApi().get(`/buzstates/${id}`); //done

export const getStateByCountryId = (cid) =>
  authApi().get(`/buzstates/country/${cid}`);

export const updateStateById = (stateFormData) => {
  return authApi().put(`/buzstates/${stateFormData?._id}`, stateFormData); //done
};
export const createBState = (stateFormData) =>
  authApi().post("/buzstates", stateFormData); //done
export const deleteStateById = (id) => authApi().delete(`/buzstates/${id}`);
/****operational state routes */
export const getOperationalBStates = () => Api().get("/buzstates/operational"); //done
export const getOperationalStateById = (id) =>
  Api().get(`/buzstates/operational/${id}`); //done
export const getOperationalStateByCountryId = (cid) =>
  authApi().get(`/operational/buzstates/country/${cid}`);
/*****
 * ####################################################################
 * states handling ends here
 * ______________________________________________________________________
 * ####################################################################
 */

/***================================================================ */

/*****
 * ####################################################################
 * LGAs/COUNTIES handling starts here  (All done as @ 20th August, 2024)
 * ####################################################################
 */
//lgas ''
export const getBLgas = () => authApi().get("/buz-lgas"); //done
export const getOperationalBLgas = () => Api().get("/buz-lgas/operational"); //done
export const getLgaById = (id) => authApi().get(`/buz-lgas/${id}`); //done
export const getOperationalLgaById = (id) =>
  Api().get(`/buz-lgas/operational/${id}`); //done
export const getLgaByStateId = (id) => Api().get(`/buz-lgas/state/${id}`); //done
export const getOperationalLgaByStateId = (id) =>
  Api().get(`/buz-lgas/operational/state/${id}`); //done (Operational)
export const updateLgaById = (lgaFormData) => {
  return authApi().put(`/buz-lgas/${lgaFormData?._id}`, lgaFormData); //done
};
export const createBLga = (stateFormData) =>
  authApi().post("/buz-lgas", stateFormData); //done
export const deleteLgaById = (id) => authApi().delete(`/buz-lgas/${id}`);
/*****
 * ####################################################################
 * LGAs/COUNTIES handling ends here
 * ______________________________________________________________________
 * ####################################################################
 */
/***================================================================ */

/*****
 * ####################################################################
 * TRADEHUBS handling starts here  (All done as @ 20th August, 2024)
 * ####################################################################
 */
//Tradehubs
export const getTradehubs = () => Api().get("/tradehubs"); //done
export const getTradehubById = (id) => Api().get(`/tradehubs/${id}`); //done/

export const updateTradehubById = (hubFormData) => {
  // console.log("TradeHub to UPDATE", hubFormData)
  return authApi().put(`/tradehubs/${hubFormData?._id}`, hubFormData); //done
};

export const createTradehub = (hubFormData) =>
  authApi().post("/tradehubs", hubFormData);

export const deleteTradehubById = (hubFormData) => {
  return authApi().delete(`/tradehubs/${hubFormData}`); //done
};

/*****
 * ####################################################################
 * TRADEHUBS handling ends here
 * ______________________________________________________________________
 * ####################################################################
 */
/***================================================================ */

/*****
 * ####################################################################
 * PRODUCT-CATEGORIES handling starts here  (All done as @ 20th August, 2024)
 * ####################################################################
 */
//Product Categories Routes
export const getProdCats = () => Api().get("/productcats"); //done
export const getProdCatById = (id) => Api().get(`/productcats/${id}`); //done

export const updateProdCatById = (prodcatFormData) => {
  return authApi().put(`/productcats/${prodcatFormData?._id}`, prodcatFormData); //done
};
export const createProdCat = (prodcatFormData) =>
  authApi().post("/productcats", prodcatFormData); //done

export const featureProdCatById = (id) =>
  authApi().put(`/productcats/feature-category/${id}`);

export const unFeatureProdCatById = (id) =>
  authApi().put(`/productcats/unfeature-category/${id}`);

export const deleteProdCatById = (catId) => {
  return authApi().delete(`/productcats/${catId}`); //done
};
/*****
 * ####################################################################
 * PRODUCT-CATEGORIES  handling ends here
 * ______________________________________________________________________
 * ####################################################################
 */
/***================================================================ */

/*****
 * ####################################################################
 * PRODUCT-UNITS handling starts here  (All done as @ 20th August, 2024)
 * ####################################################################
 */
//Product Units Routes
export const getProdUnits = () => Api().get("/productunits"); //done
export const getProdUnitById = (id) => Api().get(`/productunits/${id}`); //done
export const updateProdUnitById = (prodUnitFormData) =>
  authApi().put(`/productunits/${prodUnitFormData?._id}`, prodUnitFormData); //done

export const createProdUnit = (prodUnitFormData) =>
  authApi().post("/productunits", prodUnitFormData); //done
export const deleteProdUnitsById = (catId) => {
  return authApi().delete(`/productunits/${catId}`); //done
};
/*****
 * ####################################################################
 * PRODUCT-UNIT  handling ends here
 * ______________________________________________________________________
 * ####################################################################
 */
/***================================================================ */

//Product Large Units Routes
export const getLargeProdUnits = () => Api().get("/large-units");
export const getLargeProdUnitById = (id) => Api().get(`/large-units/${id}`);
export const updateLargeProdUnitById = (prodLargeUnitData) =>
  authApi().put(`/large-units/${prodLargeUnitData?._id}`, prodLargeUnitData);
export const createLargeProdUnit = (prodLargeUnitData) =>
  authApi().post("/large-units", prodLargeUnitData);

// Product Routes Routes
export const getProducts = () => Api().get("/products");
export const getProductById = (id) => Api().get(`/products/${id}`);
// export const updateProductById = (id, productFormData) =>
//   authApi().put(`/products/${id}`, productFormData);

// export const createProduct = (productFormData) =>
//   authApi().post('/products', productFormData);

///============Product related========================//

/**Market Warehouse  Categories */
export const getMarketWarehouseCategories = () =>
  Api().get("/waerehousecategories"); //done

/*****
 * ####################################################################
 * Market-category handling starts here  (All done as @ 20th August, 2024)
 * ####################################################################
 */
//Market Categories
export const getMarketCategories = () => Api().get("/marketcategories"); //done
export const getMarketCategoryById = (id) =>
  Api().get(`/marketcategories/${id}`); //done
export const updateMarketCategoryById = (marketCategoryFormData) =>
  authApi().put(
    `/marketcategories/${marketCategoryFormData?._id}`,
    marketCategoryFormData
  ); //done
export const createMarketCategory = (marketCategoryFormData) =>
  authApi().post("/marketcategories", marketCategoryFormData); //done
export const deleteMarketCategoryById = (id) =>
  authApi().delete(`/marketcategories/${id}`);
/*****
 * ####################################################################
 * Market Category handling ends here
 * ______________________________________________________________________
 * ####################################################################
 */

/***================================================================ */

/*****
 * ####################################################################
 * Markets handling starts here  (All done as @ 20th August, 2024)
 * ####################################################################
 */
//Market
export const getMarkets = () => authApi().get("/markets"); //done

export const getMarketById = (id) => Api().get(`/markets/${id}`); //done
// export const getMarketsByLgaId = (id) => Api().get(`/markets/${id}`);
export const updateMarketById = (marketFormData) =>
  authApi().put(`/markets/${marketFormData?._id}`, marketFormData); //done
export const createMarket = (marketFormData) =>
  authApi().post("/markets", marketFormData); //done
export const featureMarket = (id) =>
  authApi().put(`/markets/feature-market/${id}`);
export const unFeatureMarket = (id) =>
  authApi().put(`/markets/unfeature-market/${id}`);
export const getMarketsByStateId = (id) => Api().get(`/markets/states/${id}`);
export const getMarketsByLgaId = (id) => Api().get(`/markets/lga/${id}`);
export const deleteMarketById = (id) => authApi().delete(`/markets/${id}`);

/*****
 * ####################################################################
 * Markets handling ends here
 * ______________________________________________________________________
 * ####################################################################
 */

/***================================================================ */

/*****
 * ####################################################################
 * Shop Plans handling starts here  (All done as @ 20th August, 2024)
 * ####################################################################
 */
//SHopPlans Routes
export const getShopPlans = () => Api().get("/shopplans"); //done
export const getShopPlanById = (id) => Api().get(`/shopplans/${id}`); //done
export const updateShopPlanById = (planFormData) =>
  authApi().put(`/shopplans/${planFormData?._id}`, planFormData); //done
export const createShopPlan = (planFormData) =>
  authApi().post("/shopplans", planFormData); //done
export const deleteShopPlanById = (id) => authApi().delete(`/shopplans/${id}`);

/*****
 * ####################################################################
 * Shop Plans handling ends here
 * ______________________________________________________________________
 * ####################################################################
 */

/***================================================================ */

/*****
 * ####################################################################
 * Shops/Merchants handling starts here  (All done as @ 20th August, 2024)
 * ####################################################################
 */
//SHops Routes
export const getShops = () => Api().get("/shops");
export const getShopById = (id) => Api().get(`/shops/${id}`);

export const updateShopById = (id, shopFormData) =>
  authApi().put(`/shops/${id}`, shopFormData);

export const createApiShop = (shopFormData) =>
  authApi().post("/shops", shopFormData);
// export const createApiVendorShop = (shopFormData) =>
//   authApi().post('/shops', shopFormData);
export const createApiMerchantVendorShop = (shopFormData) =>
  authApi().post("/shops/create/resource-vendor", shopFormData); //done***
export const updateApiMerchantVendorShop = (shopFormData) =>
  authApi().put(
    `/shops/update/resource-vendor/${shopFormData?._id}`,
    shopFormData
  ); //done***
export const deleteShopById = (id) => authApi().delete(`/shops/${id}`);

/****Partners Shops handling */
export const createApiPartnerVendorShop = (shopFormData) =>
  authApi().post("/shops/create/resource-partner", shopFormData);
export const updateApiPartnerVendorShop = (shopFormData) =>
  authApi().put(
    `/shops/update/resource-partner/${shopFormData?._id}`,
    shopFormData
  );
/****Company Shops handling */
export const createApiCompanyVendorShop = (shopFormData) =>
  authApi().post("/shops/create/resource-company", shopFormData);
export const updateApiCompanyVendorShop = (shopFormData) =>
  authApi().put(
    `/shops/update/resource-company/${shopFormData?._id}`,
    shopFormData
  );

export const adminMakeShopHomeSlider = (id, shopFormData) =>
  authApi().put(`/shops/makeshop-homeslider/${id}`, shopFormData);

export const adminUnMakeShopHomeSlider = (id, shopFormData) =>
  authApi().put(`/shops/unmakeshop-homeslider/${id}`, shopFormData);

export const adminMakeShopBannerAd = (id, shopFormData) =>
  authApi().put(`/shops/makeshop-bannerads/${id}`, shopFormData);

export const adminUnMakeShopBannerAd = (id, shopFormData) =>
  authApi().put(`/shops/unmakeshop-bannerads/${id}`, shopFormData);

export const adminMakeShopPromotion = (id, shopFormData) =>
  authApi().put(`/shops/makeshop-promotion/${id}`, shopFormData);

export const adminUnMakeShopPromotion = (id, shopFormData) =>
  authApi().put(`/shops/unmakeshop-promotion/${id}`, shopFormData);
/*****
 * ####################################################################
 * Shop  handling ends here
 * ______________________________________________________________________
 * ####################################################################
 */

/***================================================================ */

/****####################################################################
 * OFFICE ROUTES starts here
 *##################################################################*/

export const getOffices = () => Api().get("/offices");

export const getOfficeById = (id) => Api().get(`/offices/${id}`);
export const getOfficeByLgaId = (id) => Api().get(`/offices/by-lga/${id}`);

export const createApiOfficeOutlet = (formData) =>
  authApi().post("/offices/create/resource-office", formData); //done***

export const updateApiOfficeOutlet = (formData) =>
  authApi().put(`/offices/update/resource-office/${formData?._id}`, formData); //done***
export const deleteOfficeById = (id) => authApi().delete(`/offices/${id}`);
/****####################################################################
 * OFFICE ROUTES ends here
 *##################################################################*/

//Ads Routes
export const getAds = () => Api().get("/ads"); //done
export const getAdById = (id) => Api().get(`/ads/${id}`); //done
export const updateAdById = (adFormData) =>
  authApi().put(`/ads/${adFormData?._id}`, adFormData); //done
export const createAd = (adFormData) => authApi().post("/ads", adFormData); //done

/*****
 * ####################################################################
 * Post categories handling starts here  (All done as @ 20th August, 2024)
 * ####################################################################
 */
// Post categories Routes
export const getPostcats = () => Api().get("/postcats"); //done
export const getPostcatById = (id) => Api().get(`/postcats/${id}`); //done
export const updatePostcatById = (postcatFormData) =>
  authApi().put(`/postcats/${postcatFormData?._id}`, postcatFormData); //done
export const createPostcat = (postcatFormData) =>
  authApi().post("/postcats", postcatFormData); //done
export const deletePostcatsById = (id) => authApi().delete(`/postcats/${id}`);
/*****
 * ####################################################################
 * Post categories  handling ends here
 * ______________________________________________________________________
 * ####################################################################
 */
/***================================================================ */

/*****
 * ####################################################################
 * Blog Posts handling starts here  (All done as @ 20th August, 2024)
 * ####################################################################
 */
// Post Routes
export const getNewsPosts = () => Api().get("/posts"); //done
export const getAdminPosts = () => authApi().get("/posts/adminposts"); //done
// export const getPosts = () => Api().get('/posts');
// export const getPostById = (id) => Api().get(`/posts/${id}`);
export const getSinglePostById = (id) => Api().get(`/posts/${id}`); //done
export const adminGetSinglePostById = (id) =>
  authApi().get(`/posts/getpostbyadmin/${id}`); //done
export const getPostById = (id) => authApi().get(`/posts/bycreator/${id}`); //done
export const updatePostById = (postFormData) =>
  authApi().put(`/posts/${postFormData?._id}`, postFormData); //done
export const createPost = (postFormData) =>
  authApi().post("/posts", postFormData); //done

export const deleteBlogPostById = (id) => authApi().delete(`/posts/${id}`);
/*****
 * ####################################################################
 * Blog Posts   handling ends here
 * ______________________________________________________________________
 * ####################################################################
 */
/***================================================================ */

// Faq Routes
export const getFaqs = () => Api().get("/faqs"); //done
export const getApiFaqById = (id) => authApi().get(`/faqs/byadmin/${id}`); //done
export const updateFaqById = (faqFormData) =>
  authApi().put(`/faqs/${faqFormData?._id}`, faqFormData); //done
export const createApiFaq = (faqFormData) =>
  authApi().post("/faqs", faqFormData); //done

// Partners Routes
export const getPartners = () => Api().get("/partners"); //done
export const getAdminPartnerById = (id) =>
  authApi().get(`/partners/byadmin/${id}`); //done
export const getPartnerById = (id) => Api().get(`/partners/${id}`);
export const updatePartnerById = (partnerFormData) =>
  authApi().put(`/partners/${partnerFormData?._id}`, partnerFormData);
export const createPartner = (partnerFormData) =>
  authApi().post("/partners", partnerFormData);

// Banner Routes users
export const getBanners = () => Api().get("/banners"); //done
export const getApiBannerById = (id) => Api().get(`/banners/${id}`); //done
export const updateBannerById = (bannerFormData) =>
  authApi().put(`/banners/${bannerFormData?._id}`, bannerFormData); //done
export const createBanner = (bannerFormData) =>
  authApi().post("/banners", bannerFormData); //done
export const adminMakeHomeSlider = (id) =>
  authApi().put(`/banners/makehomeslider/${id}`);
export const adminUnMakeHomeSlider = (id) =>
  authApi().put(`/banners/unmakehomeslider/${id}`);

// Legal/Advocacy Routes
export const getLegals = () => Api().get("/privacies"); //done
export const getApiLegalById = (id) => Api().get(`/privacies/${id}`);
export const updateLegalById = (legalFormData) =>
  authApi().put(`/privacies/${legalFormData?._id}`, legalFormData);
export const createLegal = (legalFormData) =>
  authApi().post("/privacies", legalFormData);

// Website Info Routes
export const getInfos = () => Api().get("/infos");
export const getApiInfoById = (id) => Api().get(`/infos/${id}`);
export const updateInfoById = (id, InfoFormData) =>
  authApi().put(`/infos/${id}`, InfoFormData);
export const createInfo = (InfoFormData) =>
  authApi().post("/infos", InfoFormData);

/*****
 * ###########################################################################################
 * Admin ORDERS-Management handling starts here  (All done as @ 20th August, 2024)
 * ##############################################################################################
 */
//Admin Order Routes
export const adminGetOrders = () => authApi().get("/adminorders");
export const adminGetOrderById = (id) => authApi().get(`/adminorders/${id}`);



export const adminDeleteOrders = (id) => authApi().delete(`/adminorders/${id}`);
export const adminPackOrders = (id) =>
  authApi().put(`/adminorders/pack-unpack/${id}`);
export const adminShipOrders = (id) =>
  authApi().put(`/adminorders/ship-unship/${id}`);
export const adminConfirmOrderArrival = (id) =>
  authApi().put(`/adminorders/confirm-order-arrival/${id}`);
export const adminDeliverOrders = (id) =>
  authApi().put(`/adminorders/deliver-undeliver/${id}`);


/******Manaing order-items */

export const adminGet_OrderItems = () => authApi().get("/adminmanage-orderitems");

  export const adminGetOrderItemsOfOrderById = (id) =>
  authApi().get(`/adminorders/adminorderitems-of-order/${id}`);
/*****
 * ###########################################################################################
 * Admin ORDERS-Management handling ends here  (All done as @ 20th August, 2024)
 * ##############################################################################################
 */
/***================================================================ */

//Finance Manage Orders and cashout Routes
export const adminFinanceGetOrders = () =>
  authApi().get("/financehandleorders");
export const adminFinanceGetOrderById = (id) =>
  authApi().get(`/financehandleorders/finance/${id}`);
export const adminFinanceCompleteOrders = (id) =>
  authApi().put(`/financehandleorders/complete-order/${id}`);

//Finance Manage Withdrawals Requests and Approval Routes
export const adminFinanceGetWithdrawals = () =>
  authApi().get("/handlewithdrawals");
export const adminFinanceGetApprovedWithdrawals = () =>
  authApi().get("/handlewithdrawals/showapproved");
export const adminFinanceGetWithdrawalsById = (id) =>
  authApi().get(`/handlewithdrawals/finance/${id}`);
export const adminFinanceApproveWithdrawals = (id) =>
  authApi().put(`/handlewithdrawals/complete-withdrawal/${id}`);
export const adminFinancePayoutWithdrawals = (id) =>
  authApi().put(`/handlewithdrawals/payout-withdrawal/${id}`);

//others 61b3279cdc3ce9f8fb5160f7
// export const getBarners = () => Api().get('/barners');
// export const getPosts = () => Api().get('/posts');
// export const findOnePost = (id) => Api().get(`/posts/${id}`);

// shop product handling starts
// export const storeShopProduct = (formData) =>
//   Api().post('/store/shopproducts', formData);

// export const getShopProducts = () => Api().get('/shop/product/list');

// shop product handling ends

// Users/Customers Routes users
export const getApiUsers = () => authApi().get("/users"); //new Dashboard ***Done
export const getApiUserById = (id) => authApi().get(`/users/${id}`);

export const updateApiUserById = (id, usersFormData) =>
  authApi().put(`/users/${id}`, usersFormData);

export const createApiUser = (usersFormData) =>
  authApi().post("/users", usersFormData);

export const adminBlockDisciplineUser = (id) =>
  authApi().put(`/users/blockuser/${id}`);
///blockuser/
export const adminUnBlockDisciplineUser = (id) =>
  authApi().put(`/users/unblockuser/${id}`);

export const adminSuspendDisciplineUser = (id) =>
  authApi().put(`/users/suspenduser/${id}`);

export const adminUnSuspendDisciplineUser = (id) =>
  authApi().put(`/users/unsuspenduser/${id}`);

//Users/Customers and discipinary Routes ends here

// Admin/ControlPanel AdminUsers Routes adminusers starts
export const getApiAdminUsers = () => authApi().get("/admin"); //new Dashboard done
export const getApiAdminUserById = (id) => authApi().get(`/admin/${id}`);

///blockuser/
export const adminBlockDisciplineStaff = (id) =>
  authApi().put(`/admin/blockuser/${id}`);

export const adminUnBlockDisciplineStaff = (id) =>
  authApi().put(`/admin/unblockuser/${id}`);
///suspend/unsuspend admin control panel user/
export const adminSuspendDisciplineStaff = (id) =>
  authApi().put(`/admin/suspenduser/${id}`);

export const adminUnSuspendDisciplineStaff = (id) =>
  authApi().put(`/admin/unsuspenduser/${id}`);

///User Leadership Status user/
export const adminMakeLeader = (id) => authApi().put(`/admin/makeceo/${id}`);

export const adminUnMakeLeader = (id) =>
  authApi().put(`/admin/unmakeceo/${id}`);

// Admin/ControlPanel AdminUsers Routes adminusers starts

export const updateApiAdminUserById = (adminFormData) =>
  authApi().put(`/admin/${adminFormData?._id}`, adminFormData);

export const createApiAdminUser = (adminFormData) =>
  authApi().post("/admin", adminFormData);

export const createRecruitAdminUserApi = (adminFormData) =>
  authApi().post("/admin/recruit-staff", adminFormData);

export const newAdminUserInviteAcceptanceEndpoint = (adminFormData) =>
  authApi().post("/admin/accept-invite", adminFormData);
//

// Admin/ControlPanel Admin Get Shops Routes  starts
export const getApiAdminMerchants = () => authApi().get("/shops"); //new Dashboard done

/*****
 * ###################################################################################################
 * ESTATE PROPERTIES handling starts here  (All done as @ 20th August, 2024)
 * ####################################################################################################
 */
export const adminGetEstatePropertiess = () => authApi().get("/handl-estates"); //done

/****Shop on Estate properties */
export const adminGetShopOnEstateProperties = () =>
  authApi().get("/handle-estates/get-shopsonestates"); //done
export const adminGetSingleShopAndEstateProperties = (id) =>
  authApi().get(`/handle-estates/get-shop-and-its-estateproperties/${id}`);
/*****
 * ###################################################################################################
 * ESTATE PROPERTIES handling ends here  (All done as @ 20th August, 2024)
 * ####################################################################################################
 */
/**============================================================================================================= */
/*****
 * ###################################################################################################
 * HOSPITALITY/BOOKINGS PROPERTIES handling starts here
 * ####################################################################################################
 */

/****Shop on Hospitality properties */
export const adminGetMerchantsOnHospitalityProperties = () =>
  authApi().get("/handle-hospitality/get-merchants-on-hospitality"); //done
export const adminGetSingleMerchantAndHospitalityProperties = (merchantId) =>
  authApi().get(
    `/handle-hospitality/get-marchants/${merchantId}/and-hospitality-properties`
  );



  /*******Getting and handling reservations */
  export const adminGetBookingsReservationsApi = () =>
  authApi().get("/handle-hospitality/get-hospitality-reservations"); 



  /******###CANCELLED RESERVATIONS Handling######### */
  export const adminGetCancelledReservationsApi = () =>
  authApi().get("/handle-hospitality/get-cancelled-reservations"); 


  export const adminApproveRefundsApi = (refundPayload) =>
  authApi().get(`/handle-hospitality/${refundPayload}/approve-credit-refund_request`); 
/*****
 * ###################################################################################################
 * HOSPITALITY/BOOKINGS PROPERTIES handling ends here  (All done as @ 20th August, 2024)
 * ####################################################################################################
 */

/****
 *
 * LOG OUT HANDLING BELOW
 */
export const AdminLogOutCall = () => {
  if (typeof window !== "undefined") {

    try {
      /**Fuse admin starts */
      resetSessionForAdminUsers();
      Cookies.remove("jwt_auth_credentials");
      /***Fuse admin ends */

      Cookies.remove("authUserInfo");
      Cookies.remove("isloggedin");
      Cookies.remove("_auth");
      Cookies.remove("_auth_state");
      Cookies.remove("_auth_type");
      Cookies.remove("_auth_storage");
      Cookies.remove("_ga");
      Cookies.remove("_ga_WJH9CH067R");
      Cookies.remove("SLG_G_WPT_TO");
      Cookies.remove("ADMIN_AFSP_Show_Hide_tmp_Lead");
      Cookies.remove("ADMIN_AFSP_Show_Hide_tmp_Lead_ARC");

      // Cookies.set(
      //   'ADMIN_AFSP_Show_Hide_tmp_Lead',
      //   JSON.stringify(response?.data?.accessToken),
      //   '1h'
      // );

      window.location.reload(false);
    } catch (error) {
      console.log(error);
    }
  }
};


//Shop Users Logout functionality  usersproducts
export const logOut = () => {
  // const logeAuthOut = useSignOut();
  if (typeof window !== "undefined") {
    // remove logged in user's cookie and redirect to login page 'authUserCookie', state.user, 60 * 24
    try {
      // Api()
      //   .post(`/logout`)
      //   .then((response) => {
      //     // alert('logged out successfully');
      //     console.log('logged out successfully');
      //   });

      logeAuthOut();

      window.location.reload(false);
    } catch (error) {
      console.log(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }

    Cookies.remove("ADMIN_AFSP_Show_Hide_tmp_Lead");
  }
};
