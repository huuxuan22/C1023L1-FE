// import ListUser from "./component/ListUser";
import CreateEmployee from "./component/AddUser";
// import UpdateUserForm from "./component/UpdateUser";
import React, { useState } from "react"; // Import CSS for Toastify
import Login from "./component/login/login";
import UserProfile from "./component/create-account/user-profile";
import ChangePassword from "./component/change-password/change-password";
import "react-toastify/dist/ReactToastify.css";
import {
  BrowserRouter,
  Navigate,
  NavLink,
  Route,
  Routes,
} from "react-router-dom";
import Dashboard from "./component/dashboard"; // Import component Dashboard
import UpdateUser from "./component/UpdateUser";
import { ToastContainer } from "react-toastify";
import UserList from "./component/ListUser";
import CreateAccount from "./component/create-account/create-register";
import ForgotPassword from "./component/forgot-password/forgot-password";
import AskAccount from "./component/ask-account/ask-account";
import VerifyCode from "./component/vefiry-code/vefiry-code";
import Home from "./component/home/Home/Home";
import PrivateRoute from "./component/protected-route/private-route";
import ProductList from "./component/product/product-list/ProductList";
import ProductCreate from "./component/product/product-create/ProductCreate";
import ProductUpdate from "./component/product/product-update/ProductUpdate";
import ProductDetail from "./component/product/product-detaisl/ProductDetails";
import CategoryList from "./component/categories/categories-list/CategoryList";
import CategoryCreateUpdate from "./component/categories/Categories-create-update/CategoryCreateUpdate";
import ProtectedRouted from "./component/protected-route/is-authenticated";
import "bootstrap/dist/css/bootstrap.min.css";
import ProtectedRoute from "./component/protected-route/private-route";
import { CreateNewPassword } from "./service/UserService";
import Header from "./component/home/header/header";
import TableList from "./component/order-detail/table-list/table-list";
import MenuProduct from "./component/order-detail/menu-product/menu-product";
import ListThanhToan from "./component/table/thanh-toan-list/thanh-toan-list";
import ListBill from "./component/bill/list-bill";
import IncomeManagement from "./component/income/income-management";

function App() {
  const [resetList, setResetList] = useState(false); // Định nghĩa ở đây
 
 // code của dương
  const [selectedTable, setSelectedTable] = useState(null);
  const handleSelectTable = (table) => {
    setSelectedTable(table); // Cập nhật đối tượng bàn khi bàn được chọn
};


  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="" element={<Home />} />

          {/* đây là route cho phần ROLE_OWNER */}
          <Route element={<ProtectedRoute requiredRole="ROLE_OWNER" />}>
            <Route
              path="/admin"
              element={<Dashboard setResetList={setResetList} />}
            >
            <Route path="income" element={<IncomeManagement />} />
              <Route
                path="users"
                element={
                  <UserList resetList={resetList} setResetList={setResetList} />
                }
              />
              <Route path="users/add" element={<CreateEmployee />} />{" "}
              {/* Route cho form thêm mới */}
              <Route path="users/update/:userId" element={<UpdateUser />} />
            </Route>{" "}
          </Route>

          {/* <Route path="/product" element={<ProductList />} /> */}

          <Route element={<ProtectedRoute requiredRole="ROLE_ADMIN" />}>
            <Route path={"/tables"} element={<TableList onSelectTable={handleSelectTable}/>} ></Route>
            <Route path="/bill" element={<ListBill />} />
            <Route path="/product" element={<ProductList />} />
            <Route path="/create" element={<ProductCreate />} />
            <Route path="/product/:id" element={<ProductUpdate />} />
            <Route path="/productDetail/:id" element={<ProductDetail />} />
            <Route path="/category" element={<CategoryList />} />
            <Route
              path="/createCategory/:id?"
              element={<CategoryCreateUpdate />}
            />
            <Route path={"/menu"} element={<MenuProduct selectedTable={selectedTable} />} ></Route>
          </Route>

          {/* Route cho trang cập nhật */}
          <Route path="/register" element={<CreateAccount />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />}></Route>
          <Route path="/ask-account" element={<AskAccount />}></Route>
          <Route path="/vefiry-code" element={<VerifyCode />}></Route>
          <Route
            path="/create-new-account"
            element={
              <ProtectedRoute>
                <CreateNewPassword />
              </ProtectedRoute>
            }
          ></Route>
          <Route element={<ProtectedRoute requiredRole="ROLE_USER" />}>
            <Route path="/userprofile" element={<UserProfile />} />
            <Route path="/changepassword" element={<ChangePassword />} />
          </Route>
          <Route
            path="/create-new-password"
            element={<CreateNewPassword />}
          ></Route>
          <Route path="/home" element={<Home />} />





            {/*      đây là code của chánh       */}
            {/* <NavLink to="/tables">Danh sách</NavLink> */}
            {/* <Route path="/tables" element={<TableList/>}></Route>
            <Route path="/thanhtoans/:id" element={<ListThanhToan/>}></Route> */}





        </Routes>
        <ToastContainer />
      </BrowserRouter>
    </div>
  );
}

export default App;
