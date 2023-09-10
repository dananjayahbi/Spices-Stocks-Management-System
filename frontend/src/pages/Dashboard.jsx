import React, { useState, useEffect } from 'react';
import Sidebar from '../partials/Sidebar';
import Header from '../partials/Header';
import {
  Routes,
  Route,
  Navigate
} from "react-router-dom";
import Home from '../pages/Home';
import SalesList from '../pages/Sales/SalesList';
import SalesReturnList from '../pages/Sales/SalesReturnList';
import BuyersList from './Buyers/BuyersList';
import ImportBuyers from './Buyers/ImportBuyers';
import PurchaseList from '../pages/Purchase/PurchaseList';
import PurchaseReturnList from '../pages/Purchase/PurchaseReturnList';
import SuppliersList from '../pages/Suppliers/SuppliersList';
import ImportSuppliers from '../pages/Suppliers/ImportSuppliers';
import ProductsList from './Products/ProductsList';
import ProductCategoriesList from './Products/ProductCategoriesList';
import PrintLabels from './Products/PrintLabels';
import ImportProducts from './Products/ImportProducts';
import ExpensesList from '../pages/Expenses/ExpensesList';
import ProfitLossReport from '../pages/Reports/ProfitLossReport';
import PurchaseReport from '../pages/Reports/PurchaseReport';
import PurchaseReturnReport from '../pages/Reports/PurchaseReturnReport';
import PurchasePaymentsReport from '../pages/Reports/PurchasePaymentsReport';
import ProductSalesReport from './Reports/ProductSalesReport';
import ProductPurchaseReport from './Reports/ProductPurchaseReport';
import SalesReport from '../pages/Reports/SalesReport';
import SalesReturnReport from '../pages/Reports/SalesReturnReport';
import SalesPaymentsReport from '../pages/Reports/SalesPaymentsReport';
import StockReport from '../pages/Reports/StockReport';
import ExpensesReport from '../pages/Reports/ExpensesReport';
import UsersList from './Users/UsersList';
import RolesList from './Users/RolesList';
import SendSMS from './SMS/SendSMS';
import SMSTemplates from './SMS/SMSTemplstes';
import SMSAPI from './SMS/SMSAPI';
import CompanyProfile from './Settings/CompanyProfile';
import SiteSettings from './Settings/SiteSettings';
import TaxList from './Settings/TaxList';
import UnitsList from './Settings/UnitsList';
import PaymentTypesList from './Settings/PaymentTypesList';
import ChangePassword from './Settings/ChangePassword';
import DatabaseBackup from './Settings/DatabaseBackup';
import Notification from '../components/Notification';
import axios from "axios";

function Dashboard() {

  const [notify, setNotify] = useState({
    isOpen: false,
    message: '',
    type: '',
  });

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isLogged = window.localStorage.getItem("LoggedIn");
  const token = window.localStorage.getItem("token");
  const [loggedInUserDetails, setLoggedInUserDetails] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    // Define the effect to monitor changes in localStorage
    const handleStorageChange = () => {
      const updatedIsLogged = window.localStorage.getItem("LoggedIn");
      if (!updatedIsLogged) {
        // If not logged in, redirect to login page
        window.location.href = "/login";
      }
    };

    // Listen for changes in localStorage
    window.addEventListener("storage", handleStorageChange);

    return () => {
      // Clean up the event listener when the component unmounts
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [500]);

  useEffect(() => {
    getUserDetails(token);
  },[])

  if (isLogged == "false") {
    // If not logged in, redirect to login page
    return <Navigate to="/login" />;
  }

  //NOTIFICATION CONTROL
  useEffect(() => {
    if (sessionStorage.getItem("userCreated") == "1") {
      setNotify({
        isOpen: true,
        message: "User Created Successfully!",
        type: "success",
      });
      sessionStorage.removeItem("userCreated");
    }

    if (sessionStorage.getItem("userUpdated") == "1") {
      setNotify({
        isOpen: true,
        message: "User Updated Successfully!",
        type: "success",
      });
      sessionStorage.removeItem("userUpdated");
    }

    if (sessionStorage.getItem("userDeleted") == "1") {
      setNotify({
        isOpen: true,
        message: "User Deleted Successfully!",
        type: "success",
      });
      sessionStorage.removeItem("userDeleted");
    }

    if (sessionStorage.getItem("roleCreated") == "1") {
      setNotify({
        isOpen: true,
        message: "Role Created Successfully!",
        type: "success",
      });
      sessionStorage.removeItem("roleCreated");
    }

    if (sessionStorage.getItem("roleUpdated") == "1") {
      setNotify({
        isOpen: true,
        message: "Role Updated Successfully!",
        type: "success",
      });
      sessionStorage.removeItem("roleUpdated");
    }

    if (sessionStorage.getItem("roleDeleted") == "1") {
      setNotify({
        isOpen: true,
        message: "Role Deleted Successfully!",
        type: "success",
      });
      sessionStorage.removeItem("roleDeleted");
    }

    if (sessionStorage.getItem("productCategoryCreated") == "1") {
      setNotify({
        isOpen: true,
        message: "Product Category Created Successfully!",
        type: "success",
      });
      sessionStorage.removeItem("productCategoryCreated");
    }

    if (sessionStorage.getItem("productCategoryUpdated") == "1") {
      setNotify({
        isOpen: true,
        message: "Product Category Updated Successfully!",
        type: "success",
      });
      sessionStorage.removeItem("productCategoryUpdated");
    }

    if (sessionStorage.getItem("productCategoryDeleted") == "1") {
      setNotify({
        isOpen: true,
        message: "Product Category Deleted Successfully!",
        type: "success",
      });
      sessionStorage.removeItem("productCategoryDeleted");
    }

    if (sessionStorage.getItem("unitCreated") == "1") {
      setNotify({
        isOpen: true,
        message: "Unit Created Successfully!",
        type: "success",
      });
      sessionStorage.removeItem("unitCreated");
    }

    if (sessionStorage.getItem("unitUpdated") == "1") {
      setNotify({
        isOpen: true,
        message: "Unit Updated Successfully!",
        type: "success",
      });
      sessionStorage.removeItem("unitUpdated");
    }

    if (sessionStorage.getItem("unitDeleted") == "1") {
      setNotify({
        isOpen: true,
        message: "Unit Deleted Successfully!",
        type: "success",
      });
      sessionStorage.removeItem("unitDeleted");
    }

    if (sessionStorage.getItem("taxCreated") == "1") {
      setNotify({
        isOpen: true,
        message: "Tax Added Successfully!",
        type: "success",
      });
      sessionStorage.removeItem("taxCreated");
    }

    if (sessionStorage.getItem("taxUpdated") == "1") {
      setNotify({
        isOpen: true,
        message: "Tax Updated Successfully!",
        type: "success",
      });
      sessionStorage.removeItem("taxUpdated");
    }

    if (sessionStorage.getItem("taxDeleted") == "1") {
      setNotify({
        isOpen: true,
        message: "Tax Deleted Successfully!",
        type: "success",
      });
      sessionStorage.removeItem("taxDeleted");
    }

    if (sessionStorage.getItem("productCreated") == "1") {
      setNotify({
        isOpen: true,
        message: "Product Added Successfully!",
        type: "success",
      });
      sessionStorage.removeItem("productCreated");
    }

    if (sessionStorage.getItem("productUpdated") == "1") {
      setNotify({
        isOpen: true,
        message: "Product Updated Successfully!",
        type: "success",
      });
      sessionStorage.removeItem("productUpdated");
    }

    if (sessionStorage.getItem("productDeleted") == "1") {
      setNotify({
        isOpen: true,
        message: "Product Deleted Successfully!",
        type: "success",
      });
      sessionStorage.removeItem("productDeleted");
    }
  });


  //Getting Loggen In user's details
  async function getUserDetails(token){
    await axios
        .get(`http://localhost:8070/users/getUser`,{
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then((res) =>{
            setLoggedInUserDetails(res.data);
        })
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* NOTIFICATION */}
      <Notification notify={notify} setNotify={setNotify} />

      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Content area */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        {/*  Site header */}
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main>
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
            {/* Cards */}
            <div> {/* <div className="grid grid-cols-12 gap-6"> */}
              {/* Define routes and load corresponding components */}
              <Routes>
                <Route path="/" element={<Home />} />
                
                <Route path="/sales/salesList" element={<SalesList />} />
                <Route path="/sales/salesReturnList" element={<SalesReturnList />} />
                <Route path="/buyers/buyersList" element={<BuyersList />} />
                <Route path="/buyers/importBuyers" element={<ImportBuyers />} />
                <Route path="/purchase/purchaseList" element={<PurchaseList />} />
                <Route path="/purchase/purchaseReturnList" element={<PurchaseReturnList />} />
                <Route path="/suppliers/suppliersList" element={<SuppliersList />} />
                <Route path="/suppliers/importSuppliers" element={<ImportSuppliers />} />
                <Route path="/products/productsList" element={<ProductsList />} />
                <Route path="/products/productCategoriesList" element={<ProductCategoriesList />} />
                <Route path="/products/printLabels" element={<PrintLabels />} />
                <Route path="/products/importproducts" element={<ImportProducts />} />
                <Route path="/expenses/expensesList" element={<ExpensesList />} />
                <Route path="/reports/profitLossReport" element={<ProfitLossReport />} />
                <Route path="/reports/purchaseReport" element={<PurchaseReport />} />
                <Route path="/reports/purchaseReturnReport" element={<PurchaseReturnReport />} />
                <Route path="/reports/purchasePaymentsReport" element={<PurchasePaymentsReport />} />
                <Route path="/reports/productSalesReport" element={<ProductSalesReport />} />
                <Route path="/reports/productPurchaseReport" element={<ProductPurchaseReport />} />
                <Route path="/reports/salesReport" element={<SalesReport />} />
                <Route path="/reports/salesReturnReport" element={<SalesReturnReport />} />
                <Route path="/reports/salesPaymentsReport" element={<SalesPaymentsReport />} />
                <Route path="/reports/stockReport" element={<StockReport />} />
                <Route path="/reports/expensesReport" element={<ExpensesReport />} />
                <Route path="/users/usersList" element={<UsersList />} />
                <Route path="/users/rolesList" element={<RolesList />} />
                <Route path="/sms/sendSMS" element={<SendSMS />} />
                <Route path="/sms/smsTemplates" element={<SMSTemplates />} />
                <Route path="/sms/smsAPI" element={<SMSAPI />} />
                <Route path="/settings/companyProfile" element={<CompanyProfile />} />
                <Route path="/settings/siteSettings" element={<SiteSettings />} />
                <Route path="/settings/taxList" element={<TaxList />} />
                <Route path="/settings/unitsList" element={<UnitsList />} />
                <Route path="/settings/paymentTypesList" element={<PaymentTypesList />} />
                <Route path="/settings/changePassword" element={<ChangePassword />} />
                <Route path="/settings/databaseBackup" element={<DatabaseBackup />} />
              </Routes>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;