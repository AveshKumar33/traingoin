import "./App.css";

import {
  createBrowserRouter,
  RouterProvider,
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

import Tags from "./pages/admin/tags/Tags";
import TagsCreate from "./pages/admin/tags/TagsCreate";
import EditTag from "./pages/admin/tags/EditTag";

import Collection from "./pages/admin/collection/Collection";
import AddCollection from "./pages/admin/collection/AddCollection";
import EditCollection from "./pages/admin/collection/EditCollection";
import Gallery from "./pages/admin/gallery/Gallery";
import User from "./pages/admin/user/User";
import AddUser from "./pages/admin/user/AddUser";
import EditUser from "./pages/admin/user/EditUser";
import UserRole from "./pages/admin/userRole/UserRole";
import AddUserRoles from "./pages/admin/userRole/AddUserRole";
import EditUserRoles from "./pages/admin/userRole/EditUserRole";
import UOM from "./pages/admin/UOM/UOM";
import CreateUOM from "./pages/admin/UOM/CreateUOM";
import EditUOM from "./pages/admin/UOM/EditUOM";
import Coupon from "./pages/admin/coupon/Coupon";
import AddCoupon from "./pages/admin/coupon/AddCoupon";
import EditCoupon from "./pages/admin/coupon/EditCoupon";
import Order from "./pages/admin/order/Order";
// import AddOrder from "./pages/admin/order/AddOrder";
// import EditOrder from "./pages/admin/order/EditOrder";
import Login from "./pages/client/auth/Login";
import Register from "./pages/client/auth/Register";
import ProtectedRoute from "./pages/client/auth/ProtectedRoute/ProtectedRoute";
import Home from "./pages/client/home/Home";
import Review from "./pages/admin/review/Review";
import AddReview from "./pages/admin/review/AddReview";
import EditReview from "./pages/admin/review/EditReview";
import ClientCollection from "./pages/client/collection/ClientCollection";
import ProductDetails from "./pages/client/productdetails/ProductDetails";
import CustomizedProductDetailsClient from "./pages/client/productdetails/customizedProduct/CustomizedProductDetails";
import Checkout from "./pages/client/checkout/Checkout";
import Contact from "./pages/client/contact/Contact";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { verifyToken } from "./redux/slices/authSlice";
import Profile from "./pages/client/profile/Profile";
import Orderdetails from "./pages/client/orderdetails/Orderdetails";
import UserProtectedRoute from "./pages/client/auth/ProtectedRoute/UserProtectedRoute";

// Attribute
import ProductBundle from "./pages/admin/bundle/ProductBundle";
import EditProductBundle from "./pages/admin/bundle/EditProductBundle";
import PostProductBundle from "./pages/admin/bundle/PostProductBundle";

// import Bundle from "./pages/client/bundle/Bundle";
// import BundleDetails from "./pages/client/bundle/BundleDetails";

import RoomIdea from "./pages/client/roomideas/RoomIdea";
import RoomIdeadetails from "./pages/client/roomideas/RoomIdeadetails";
import RoomIdeaCustomizeDetails from "./pages/client/roomideas/RoomIdeaCustomizeDetails";
import { verifyCart } from "./redux/slices/cartSlice";
// import AttributeNew from "./pages/admin/attribute/AttributeNew";

import SearchPage from "./pages/client/searchpage/SearchPage";

//Enquiry  Form
import Enquiry from "./pages/admin/enquiry/Enquiry";
import AdminCatalogue from "./pages/admin/catalogue/AdminCatalogue";
import AddAdminCatalogue from "./pages/admin/catalogue/AddAdminCatalogue";
import EditAdminCatalogue from "./pages/admin/catalogue/EditAdminCatalogue";
import TrackOrder from "./pages/client/trackorder/TrackOrder";
import Whislist from "./pages/client/whislist/Whislist";
import ProjectCategory from "./pages/admin/projectcategory/ProjectCategory";
import AddProjectCategory from "./pages/admin/projectcategory/AddProjectCategory";
import EditProjectCategory from "./pages/admin/projectcategory/EditProjectCategory";
import Project from "./pages/admin/project/Project";
import AddProject from "./pages/admin/project/AddProject";
import EditProject from "./pages/admin/project/EditProject";
import ProjectPage from "./pages/client/Project/ProjectPage";
import ProjectDetails from "./pages/client/Project/ProjectDetails";
import OtpLogin from "./pages/client/auth/OtpLogin";
import AdminSlider from "./pages/admin/slider/AdminSlider";
import AddAdminSlider from "./pages/admin/slider/AddAdminSlider";

import AllCustomizedProduct from "./pages/client/allcustomizedproduct/AllCustomizedProduct";
import AdminArchitect from "./pages/admin/architect/AdminArchitect";
import AddArchitect from "./pages/admin/architect/AddArchitect";
import EditArchitect from "./pages/admin/architect/EditArchitect";
import ArchitectLogin from "./pages/client/architect/ArchitectLogin";
import ArchitectDashboard from "./pages/client/architect/ArchitectDashboard";
import ArchitectProtectedRoute from "./pages/client/auth/ProtectedRoute/ArchitectProtectedRoute";
import ArchitectPage from "./pages/client/architect/ArchitectPage";
import AdminBlog from "./pages/admin/blog/AdminBlog";
import AddBlog from "./pages/admin/blog/AddBlog";
import EditBlog from "./pages/admin/blog/EditBlog";
import Blog from "./pages/client/blog/Blog";
import Blogdetails from "./pages/client/blog/Blogdetails";
import SingleBlog from "./pages/client/blog/SingleBlog";
import ExperienceCenters from "./pages/client/ExperienceCenters/ExperienceCenters";
import SingleExperienceCenters from "./pages/client/ExperienceCenters/SingleExperienceCenters";
import AboutUs from "./pages/client/AboutUs/AboutUs";
import PrivacyPolicy from "./pages/client/PrivacyPolicy/PrivacyPolicy";
import TermsandCondition from "./pages/client/TermsandCondition/TermsandCondition";
import CancelationPolicy from "./pages/client/CancelationPolicy/CancelationPolicy";
import CompletedProject from "./pages/client/CompletedProject/CompletedProject";

import Exibhitions from "./pages/client/Exibhitions/Exibhitions";
import PartnerWithUs from "./pages/client/PartnerWithUs/PartnerWithUs";
import Queries from "./pages/admin/QuotationRequest/Queries";

import CollectionFilters from "./pages/admin/CollectionFilters/CollectionFilters";
import AddCollectionFilter from "./pages/admin/CollectionFilters/AddCollectionFilter";
import EditCollectionFilters from "./pages/admin/CollectionFilters/EditCollectionFilters";
import ImageComponentView from "./pages/admin/dotProductNew/ImageComponentView";
import AttributeCategor from "./pages/admin/AttributeCategor/AttributeCategor";
import AttributeCategorCreate from "./pages/admin/AttributeCategor/AttributeCategorCreate";
import EditAttributeCategor from "./pages/admin/AttributeCategor/EditAttributeCategor";

import CollectionFiltersNew from "./pages/admin/CollectionFilterNew/CollectionFilters";
import AddCollectionFilterNew from "./pages/admin/CollectionFilterNew/AddCollectionFilter";
import EditCollectionFiltersNew from "./pages/admin/CollectionFilterNew/EditCollectionFilters";

import AttributeNewUpdated from "./pages/admin/AttributeNew/Attribute";
import AddAttributeUpdated from "./pages/admin/AttributeNew/AddAttribute";
import EditAttributeUpdated from "./pages/admin/AttributeNew/EditAttribute";

import AddParameters from "./pages/admin/AttributeNew/Parameter/AddParameters";
import Parameters from "./pages/admin/AttributeNew/Parameter/Parameters";
import EditParameters from "./pages/admin/AttributeNew/Parameter/EditParameter";
//Admin Catalogue

import Position from "./pages/admin/AttributeNew/Position/Position";
import AddPosition from "./pages/admin/AttributeNew/Position/AddPosition";
import EditPosition from "./pages/admin/AttributeNew/Position/EditPosition";

import CombinationData from "./pages/admin/AttributeNew/CombinationData/CombinationData";

import ProductNew from "./pages/admin/NewProduct/Product";
import AddProductNew from "./pages/admin/NewProduct/AddProduct";
import EditProductNew from "./pages/admin/NewProduct/EditProduct";
// import AddDescription from "./pages/admin/NewProduct/AddDescription";
import AddDescription from "./components/productDescription/AddDescription";
import ViewDescriptionNew from "./components/productDescription/ViewDescription";
import ProductCombination from "./pages/admin/NewProduct/ProductCombination";

import CustomizedProductNew from "./pages/admin/customizedProductNew/CustomizedProduct";
import AddCustomizedProductNew from "./pages/admin/customizedProductNew/AddCustomizedProduct";
import EditCustomizedProductNew from "./pages/admin/customizedProductNew/EditCustomizedProduct";
import CustomizedProductCombination from "./pages/admin/customizedProductNew/ProductCombination";
import CustomizedProductDetails from "./pages/admin/customizedProductNew/customizeProduct/CustomizedProductDetails";

import DotProductNew from "./pages/admin/dotProductNew/DotProduct";
import AddDotProductNew from "./pages/admin/dotProductNew/AddDotProduct";
import AddOnImagesNew from "./pages/admin/dotProductNew/AddOnImages";
import ViewImagesNew from "./pages/admin/dotProductNew/ViewImages";
import EditDotProductNew from "./pages/admin/dotProductNew/EditDotProduct";

import DotCustomizedProductNew from "./pages/admin/dotCustomizedProductNew/DotCustomizedProduct";
import AddDotCustomizedProductNew from "./pages/admin/dotCustomizedProductNew/AddDotCustomizedProduct";
import EditDotCustomizedProductNew from "./pages/admin/dotCustomizedProductNew/EditDotCustomizedProduct";
import DotCustomizedViewImages from "./pages/admin/dotCustomizedProductNew/ViewImages";
import DotCustomizedAddOnImages from "./pages/admin/dotCustomizedProductNew/AddOnImages";
import DotCustomizedImageComponentView from "./pages/admin/dotCustomizedProductNew/ImageComponentView";

import CustomizedComboProduct from "./pages/admin/customizeCombo/CustomizedComboProduct";
import AddCustomizedComboProduct from "./pages/admin/customizeCombo/AddCustomizedComboProduct";
import EditCustomizedComboProduct from "./pages/admin/customizeCombo/EditCustomizedComboProduct";

import CustomizeComboReactangle from "./pages/admin/customizeCombo/customizeComboRectangle/CustomizeComboReactangle";
import AddCustomizeComboReactangle from "./pages/admin/customizeCombo/customizeComboRectangle/AddCustomizeComboReactangle";
import EditCustomizeComboReactangle from "./pages/admin/customizeCombo/customizeComboRectangle/EditCustomizeComboReactangle";

// import CustomizedProductBundle from "./pages/client/customizedproductbundle/CustomizedProductBundle";
// import CustomizedProductBundleDetails from "./pages/client/customizedproductbundle/CustomizedProductBundleDetails";

import CustomizedCombination from "./pages/client/customizedCombination/CustomizedCombination";
import CustomizeCombinationDetails from "./pages/client/customizedCombination/CustomizeCombinationDetails";
import Experience from "./pages/admin/ExperienceCenters/Experience";
import EditExperience from "./pages/admin/ExperienceCenters/EditExperience";
import AddExperience from "./pages/admin/ExperienceCenters/AddExperience";
import AddAboutUs from "./pages/admin/aboutUs/AddAboutUs";
import EditAboutUs from "./pages/admin/aboutUs/EditAboutUs";
import Aboutus from "./pages/admin/aboutUs/Aboutus";
import Exibhition from "./pages/admin/Exibhitions/Exibhition";
import AddExibhitions from "./pages/admin/Exibhitions/AddExibhitions";
import EditExibhitions from "./pages/admin/Exibhitions/EditExibhitions";

import HeaderImage from "./pages/admin/headerImage/HeaderImage";
import AddChildCollectionHeaderImage from "./pages/admin/headerImage/AddChildCollectionHeaderImage";

import Settings from "./pages/client/architect/dashboard/components/Settings/Settings";
import SingleProduct from "./pages/client/architect/dashboard/components/SingleProduct/SingleProduct";
import DotProduct from "./pages/client/architect/dashboard/components/DotProduct/DotProduct";
import CustomizeProduct from "./pages/client/architect/dashboard/components/CustomizeProduct/CustomizeProduct";

import ComboProduct from "./pages/client/architect/dashboard/components/ComboProduct/ComboProduct";
import QueryProducts from "./pages/admin/QuotationRequest/QueryProducts";
import Quotation from "./pages/admin/QuotationRequest/Quotation";

import Cart from "./pages/client/cart/Cart";
import RequestProduct from "./pages/client/architect/dashboard/components/RequestProduct/RequestProduct";
import ReviewModal from "./pages/client/home/ReviewModal";
import AddPartnerWithUs from "./pages/admin/PartnerWithUs/AddPartnerWithUs";
import EditPartnerWithUs from "./pages/admin/PartnerWithUs/EditPartnerWithUs";
import PartnerWithus from "./pages/admin/PartnerWithUs/PartnerWithUs";
import UserOrders from "./pages/client/orderdetails/UserOrders";
import FeelFreeToContactUs from "./pages/admin/FeelFreeToContactUs/FeelFreeToContactUs";

import UserOrderDetails from "./pages/client/orderdetails/UserOrderDetails";
import OrderStatus from "./pages/admin/orderStatus/OrderStatus";
import CreateOrderStatus from "./pages/admin/orderStatus/CreateOrderStatus";
import OrderProductDetails from "./pages/admin/order/OrderProductDetails";
import UpdateOrderStatus from "./pages/admin/order/UpdateOrderStatus";

function App() {
  const { userToken } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  useEffect(() => {
    if (userToken) {
      dispatch(verifyToken());
    }
    dispatch(verifyCart());
  }, [dispatch, userToken]);

  // const router = createBrowserRouter([
  //   {
  //     path: "/",
  //     element: <Home />,
  //   },
  // ]);

  return (
    <>
      <Router>
        <Routes>
          {/* Home */}
          <Route path="/" element={<Home />} />

          <Route path="/search/:productname" element={<SearchPage />} />

          <Route element={<UserProtectedRoute />}>
            <Route path="/profile" element={<Profile />} />
          </Route>

          <Route
            path="/product/:collectionurl/:productname"
            element={<ProductDetails />}
          />

          <Route
            path="/customized-product/:collectionurl/:productname"
            element={<CustomizedProductDetailsClient />}
          />
          <Route path="/review-details/:id" element={<ReviewModal />} />

          <Route path="/orderdetails" element={<Orderdetails />} />
          <Route path="/orders" element={<UserOrders />} />
          <Route path="/orders/:orderId" element={<UserOrderDetails />} />

          <Route
            path="/collection/:collectionname"
            element={<ClientCollection />}
          />

          <Route element={<UserProtectedRoute />}>
            <Route path="/checkout" element={<Checkout />} />
          </Route>

          <Route path="/Contact" element={<Contact />} />

          <Route path="/otplogin" element={<OtpLogin />} />

          <Route
            path="/customized-combination"
            element={<CustomizedCombination />}
          />
          <Route
            path="/customized-combination/:productId"
            element={<CustomizeCombinationDetails />}
          />

          {/* Customized Product Bundle */}

          {/* <Route
            path="/customizedProductbundle"
            element={<CustomizedProductBundle />}
          /> */}

          {/* <Route
            path="/customizedProductbundle/:id"
            element={<CustomizedProductBundleDetails />}
          /> */}

          {/* Bundle */}

          {/* <Route path="/bundle/:id" element={<BundleDetails />} />
          <Route path="/bundle" element={<Bundle />} /> */}

          {/* Room Ideas */}
          <Route path="/room-ideas" element={<RoomIdea />} />
          <Route path="/room-idea/:id" element={<RoomIdeadetails />} />
          <Route
            path="/customize-room-idea/:id"
            element={<RoomIdeaCustomizeDetails />}
          />

          {/* track Order */}
          <Route path="/track-order" element={<TrackOrder />} />

          {/* Whistlist PAge */}
          <Route path="/whishlist" element={<Whislist />} />

          {/* Cart Page */}
          <Route path="/cart" element={<Cart />} />

          {/* Customized Product */}
          <Route
            path="/customized-product"
            element={<AllCustomizedProduct />}
          />

          {/* Project Page */}
          <Route path="/project" element={<ProjectPage />} />
          <Route path="/project/:id" element={<ProjectDetails />} />

          {/* Architect Login */}

          <Route path="/architect/login" element={<ArchitectLogin />} />

          {/* Architect Route */}

          <Route element={<ArchitectProtectedRoute />}>
            <Route
              path="/architect/dashboard"
              element={<ArchitectDashboard />}
            />
            <Route path="/architect/setting" element={<Settings />} />
            <Route
              path="/architect/request-product"
              element={<RequestProduct />}
            />
            <Route
              path="/architect/single-product"
              element={<SingleProduct />}
            />
            <Route path="/architect/dot-product" element={<DotProduct />} />

            <Route
              path="/architect/customize-product"
              element={<CustomizeProduct />}
            />

            <Route path="/architect/combo-product" element={<ComboProduct />} />
          </Route>

          {/* Architect Url */}

          <Route path="/architect/:url" element={<ArchitectPage />} />

          {/* Blog Details */}

          <Route path="/:url" element={<Blogdetails />} />
          <Route path="/single-blog/:id" element={<SingleBlog />} />
          <Route path="/experience-centers" element={<ExperienceCenters />} />
          <Route
            path="/single-experience-centers/:id"
            element={<SingleExperienceCenters />}
          />
          <Route path="/CompletedProject" element={<CompletedProject />} />
          <Route path="/PartnerWithUs" element={<PartnerWithUs />} />
          <Route path="/Exibhitions" element={<Exibhitions />} />
          <Route path="/AboutUs" element={<AboutUs />} />
          <Route path="/PrivacyPolicy" element={<PrivacyPolicy />} />
          <Route path="/TermsandCondition" element={<TermsandCondition />} />
          <Route path="/CancelationPolicy" element={<CancelationPolicy />} />

          <Route path="/blog" element={<Blog />} />

          {/* Admin Panel route status */}
          <Route element={<ProtectedRoute />}>
            <Route
              path="/admin/add-AttributeCategor"
              element={<AttributeCategorCreate />}
            />
            <Route
              path="/admin/AttributeCategor"
              element={<AttributeCategor />}
            />
            <Route
              path="/admin/AttributeCategor/:id"
              element={<EditAttributeCategor />}
            />
            {/* Single Product new */}
            <Route path="/admin/product-new" element={<ProductNew />} />
            <Route path="/admin/add-product-new" element={<AddProductNew />} />
            <Route
              path="/admin/edit-product-new/:id"
              element={<EditProductNew />}
            />
            <Route
              path="/admin/product/create-description/:id"
              element={<AddDescription />}
            />
            <Route
              path="/admin/product/view-description/:id"
              element={<ViewDescriptionNew />}
            />
            <Route
              path="/admin/product-new/combination/:id"
              element={<ProductCombination />}
            />
            {/* AttributeCategor */}
            <Route path="/admin/add-tags" element={<TagsCreate />} />
            <Route path="/admin/tags" element={<Tags />} />
            <Route path="/admin/tags/:id" element={<EditTag />} />
            {/* Collection Filters */}
            <Route
              path="/admin/add-CollectionFilters"
              element={<AddCollectionFilter />}
            />
            <Route
              path="/admin/CollectionFilters"
              element={<CollectionFilters />}
            />
            <Route
              path="/admin/CollectionFilters/:id"
              element={<EditCollectionFilters />}
            />
            {/* Collection Filter New */}
            <Route
              path="/admin/collection-filters"
              element={<CollectionFiltersNew />}
            />
            <Route
              path="/admin/add-collection-filters"
              element={<AddCollectionFilterNew />}
            />
            <Route
              path="/admin/edit-collection-filters/:id"
              element={<EditCollectionFiltersNew />}
            />
            {/* PartnerWithUs  */}
            <Route path="/admin/partner-with-us" element={<PartnerWithus />} />
            <Route
              path="/admin/add-partner-with-us"
              element={<AddPartnerWithUs />}
            />
            <Route
              path="/admin/partner-with-us/:id"
              element={<EditPartnerWithUs />}
            />
            <Route
              path="/admin/feel-free-to-contact-us"
              element={<FeelFreeToContactUs />}
            />

            {/* Order Status */}

            <Route
              path="/admin/order-status/:id"
              element={<CreateOrderStatus />}
            />

            <Route path="/admin/order-status" element={<OrderStatus />} />

            {/* Header Image */}

            <Route
              path="/admin/header-images/:id"
              element={<AddChildCollectionHeaderImage />}
            />
            <Route path="/admin/header-image" element={<HeaderImage />} />

            {/* Set Collection */}
            <Route path="/admin/collection" element={<Collection />} />
            <Route path="/admin/add-collection" element={<AddCollection />} />
            <Route
              path="/admin/edit-collection/:id"
              element={<EditCollection />}
            />
            {/* Galley Setup */}
            <Route path="/admin/gallery" element={<Gallery />} />
            {/* queries Setup */}
            <Route path="/admin/queries" element={<Queries />} />
            {/* User Setup */}
            <Route path="/admin/user" element={<User />} />
            <Route path="/admin/add-user" element={<AddUser />} />
            <Route path="/admin/edit-user/:id" element={<EditUser />} />
            {/**show products  */}
            <Route path="/admin/user-products" element={<QueryProducts />} />

            <Route
              path="/admin/quotation/:productType/:id"
              element={<Quotation />}
            />
            {/* User Role Setup */}
            <Route path="/admin/user/role" element={<UserRole />} />
            <Route path="/admin/add-user-roles" element={<AddUserRoles />} />
            <Route
              path="/admin/edit-user-role/:id"
              element={<EditUserRoles />}
            />
            {/* UOM Setup */}
            <Route path="/admin/uom" element={<UOM />} />
            <Route path="/admin/add-uom" element={<CreateUOM />} />
            <Route path="/admin/edit-uom/:id" element={<EditUOM />} />
            {/* Coupon Route */}
            <Route path="/admin/coupon" element={<Coupon />} />
            <Route path="/admin/add-coupon" element={<AddCoupon />} />
            <Route path="/admin/edit-coupon/:id" element={<EditCoupon />} />
            {/* Order Route */}
            <Route path="/admin/order" element={<Order />} />
            <Route
              path="/admin/order/:orderId"
              element={<OrderProductDetails />}
            />
            {/* <Route
              path="/admin/order/:orderId"
              element={<OrderProductDetails />}
            /> */}
            <Route
              path="/admin/order/status/:productType/:orderId/:orderItemId"
              element={<UpdateOrderStatus />}
            />
            {/* <Route path="/admin/add-order" element={<AddOrder />} /> */}
            {/* <Route path="/admin/edit-order/:id" element={<EditOrder />} /> */}
            {/* Review Route */}
            <Route path="/admin/review" element={<Review />} />
            <Route path="/admin/add-review" element={<AddReview />} />
            <Route path="/admin/edit-review/:id" element={<EditReview />} />
            {/* New Attribute Routes */}
            <Route
              path="/admin/attribute-new"
              element={<AttributeNewUpdated />}
            />
            <Route
              path="/admin/add-attribute-new"
              element={<AddAttributeUpdated />}
            />
            <Route
              path="/admin/edit-attribute-new/:id"
              element={<EditAttributeUpdated />}
            />
            {/* Attribute ==> Position */}
            <Route
              path="/admin/attribute/position/:Name/:id"
              element={<Position />}
            />
            <Route
              path="/admin/attribute/add-position/:Name/:id"
              element={<AddPosition />}
            />
            <Route
              path="/admin/attribute/edit-position/:Name/:attId/:id"
              element={<EditPosition />}
            />
            {/* Parameters Route */}
            <Route
              path="/admin/attribute/parameters/:Name/:id/:isVisibleInCustomized"
              element={<Parameters />}
            />
            <Route
              path="/admin/attribute/add-parameters/:Name/:id/:isVisibleInCustomized"
              element={<AddParameters />}
            />
            <Route
              path="/admin/attribute/edit-parameters/:Name/:attId/:id/:isVisibleInCustomized"
              element={<EditParameters />}
            />
            {/* Combination Routes */}
            <Route
              path="/admin/attribute/parameters/position/:attName/:parameterName/:attId/:parameterId/:isVisibleInCustomized"
              element={<CombinationData />}
            />
            {/* Product Bundle */}
            <Route path="/admin/product-bundle" element={<ProductBundle />} />
            <Route
              path="/admin/edit-product-bundle/:id"
              element={<EditProductBundle />}
            />
            <Route
              path="/admin/add-product-bundle"
              element={<PostProductBundle />}
            />
            {/* Dot Product New */}
            <Route
              path="/admin/imagecomponentview/:id"
              element={<ImageComponentView />}
            />
            <Route path="/admin/dot-product-new" element={<DotProductNew />} />
            <Route
              path="/admin/add-dot-product-new"
              element={<AddDotProductNew />}
            />
            <Route
              path="/admin/dot-product-new/add-on-images/:id"
              element={<AddOnImagesNew />}
            />
            <Route
              path="/admin/dot-product-new/view-images/:id"
              element={<ViewImagesNew />}
            />
            <Route
              path="/admin/edit-dot-product-new/:id"
              element={<EditDotProductNew />}
            />
            {/* Customized Product New */}
            <Route
              path="/admin/customized-product"
              element={<CustomizedProductNew />}
            />
            <Route
              path="/admin/add-customized-product"
              element={<AddCustomizedProductNew />}
            />
            <Route
              path="/admin/edit-customized-product/:id"
              element={<EditCustomizedProductNew />}
            />
            <Route
              path="/admin/customized-product/combination/:name/:id"
              element={<CustomizedProductCombination />}
            />
            <Route
              path="/admin/customized-product-detaills/:pName/:id"
              element={<CustomizedProductDetails />}
            />
            {/* Customized Combo  */}
            <Route
              path="/admin/customized-combo-product"
              element={<CustomizedComboProduct />}
            />
            <Route
              path="/admin/add-customized-combo-product"
              element={<AddCustomizedComboProduct />}
            />
            <Route
              path="/admin/edit-customized-combo-product/:id"
              element={<EditCustomizedComboProduct />}
            />
            {/* Customized Combo Rectangle */}
            <Route
              path="/admin/customized-combo-product/rectangle/:productId"
              element={<CustomizeComboReactangle />}
            />
            <Route
              path="/admin/customized-combo-product/add-rectangle/:productId"
              element={<AddCustomizeComboReactangle />}
            />
            <Route
              path="/admin/customized-combo-product/edit-rectangle/:productId/:editedProductId"
              element={<EditCustomizeComboReactangle />}
            />
            {/* Enquiry Form */}
            <Route path="/admin/enquiry" element={<Enquiry />} />
            {/* <Route path="/admin/add-enquiry" element={<AddEnquiry />} /> */}
            {/* <Route path="/admin/edit-enquiry/:id" element={<EditEnquiry />} /> */}
            <Route path="/admin/catalogue" element={<AdminCatalogue />} />
            <Route
              path="/admin/add-catalogue"
              element={<AddAdminCatalogue />}
            />
            <Route
              path="/admin/catalogue/:id"
              element={<EditAdminCatalogue />}
            />
            {/**exprience routing */}
            <Route path="/admin/experience" element={<Experience />} />
            <Route path="/admin/add-experience" element={<AddExperience />} />
            <Route path="/admin/experience/:id" element={<EditExperience />} />
            {/**aboutUs routing */}
            <Route path="/admin/about-us" element={<Aboutus />} />
            <Route path="/admin/add-about-us" element={<AddAboutUs />} />
            <Route path="/admin/about-us/:id" element={<EditAboutUs />} />
            {/* ProjectCategory */}
            {/**exibhitions routing */}
            <Route path="/admin/exibhitions" element={<Exibhition />} />
            <Route path="/admin/add-exibhitions" element={<AddExibhitions />} />
            <Route
              path="/admin/exibhitions/:id"
              element={<EditExibhitions />}
            />
            {/* ProjectCategory */}
            <Route
              path="/admin/add-projectcategory"
              element={<AddProjectCategory />}
            />
            <Route
              path="/admin/projectcategory"
              element={<ProjectCategory />}
            />
            <Route
              path="/admin/projectcategory/:id"
              element={<EditProjectCategory />}
            />
            {/* Project */}
            <Route path="/admin/addproject" element={<AddProject />} />
            <Route path="/admin/project" element={<Project />} />
            <Route path="/admin/project/:id" element={<EditProject />} />
            {/* Slider */}
            <Route path="/admin/addslider" element={<AddAdminSlider />} />
            <Route path="/admin/slider" element={<AdminSlider />} />
            {/* New Dot Customized Product */}
            <Route
              path="/admin/dot-customized-product"
              element={<DotCustomizedProductNew />}
            />
            <Route
              path="/admin/add-dot-customized-product"
              element={<AddDotCustomizedProductNew />}
            />
            <Route
              path="/admin/edit-dot-customized-product/:id"
              element={<EditDotCustomizedProductNew />}
            />
            <Route
              path="/admin/dot-customized-product-new/view-images/:id"
              element={<DotCustomizedViewImages />}
            />
            <Route
              path="/admin/dot-customized-product/add-images/:id"
              element={<DotCustomizedAddOnImages />}
            />
            <Route
              path="/admin/edit-dot-customized-product-image/:id"
              element={<DotCustomizedImageComponentView />}
            />
            {/* Architect */}
            <Route path="/admin/architect" element={<AdminArchitect />} />
            <Route path="/admin/add-architect" element={<AddArchitect />} />
            <Route
              path="/admin/edit-architect/:id"
              element={<EditArchitect />}
            />
            {/* Blog Page */}
            <Route path="/admin/blog" element={<AdminBlog />} />
            <Route path="/admin/add-blog" element={<AddBlog />} />
            <Route path="/admin/edit-blog/:id" element={<EditBlog />} />
            {/* Blog */}
          </Route>

          {/* Auth Route */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* <Route path="*" element={<Navigate to="/" />} /> */}
        </Routes>
      </Router>
    </>
  );
}

export default App;
