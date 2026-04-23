import Sidebar from "../../Components/sidebar";
import Button from '@mui/material/Button';
import React, { useContext, useEffect, useState } from "react";
import { IoIosMenu } from "react-icons/io";
import { CgMenuGridR } from "react-icons/cg";
import { HiViewGrid } from "react-icons/hi";
import { TfiLayoutGrid4Alt } from "react-icons/tfi";
import { FaAngleDown, FaFilter } from "react-icons/fa6";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ProductItem from '../../Components/ProductItem';
import Pagination from '@mui/material/Pagination';
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import Banner from "../../Components/banner";
import { fetchDataFromApi } from "../../utils/api";
import { MyContext } from "../../App";
import { useLocation } from "react-router-dom";

const Listing = () => {

  const context = useContext(MyContext);
  const [products, setProducts] = useState([]);
  const [productView, setproductView] = useState('four');
  const [anchorEl, setAnchorEl] = React.useState(null);
  const search = context.search;
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(12);
  const { id } = useParams();
  const location = useLocation();

  // ── Mobile sidebar drawer state ──
  const [drawerOpen, setDrawerOpen] = useState(false);

  const openDropdown = Boolean(anchorEl);
  const [allProducts, setAllProducts] = useState([]);
  const [filters, setFilters] = useState({
    subCategory: [],
    price: [100, 60000],
    brand: [],
    stock: false,
    sale: false
  });

  const isSidebarFiltering =
    filters.subCategory.length > 0 ||
    filters.brand.length > 0 ||
    filters.stock ||
    filters.sale ||
    filters.price[0] !== 100 ||
    filters.price[1] !== 60000;

  // Count active filters for badge
  const activeFilterCount = [
    filters.subCategory.length > 0,
    filters.brand.length > 0,
    filters.stock,
    filters.sale,
    filters.price[0] !== 100 || filters.price[1] !== 60000,
  ].filter(Boolean).length;

  useEffect(() => {
    let filtered = [...allProducts];

    if (!isSidebarFiltering) {
      if (location.pathname.includes("/subcat/")) {
        filtered = filtered.filter(item => item.subCategory?._id === id);
      } else if (location.pathname.includes("/cat/")) {
        filtered = filtered.filter(item => item.category?._id === id);
      }
    }

    if (search !== "") {
      filtered = filtered.filter(item =>
        item.name?.toLowerCase().includes(search)
      );
    }

    if (filters.subCategory.length > 0) {
      filtered = filtered.filter(item =>
        filters.subCategory.includes(item.subCategory?._id)
      );
    }

    filtered = filtered.filter(item =>
      Number(item.price) >= filters.price[0] &&
      Number(item.price) <= filters.price[1]
    );

    if (filters.brand.length > 0) {
      filtered = filtered.filter(item =>
        filters.brand.includes(item.brand?.toLowerCase())
      );
    }

    if (filters.stock) {
      filtered = filtered.filter(item => item.countInStock > 0);
    }

    if (filters.sale) {
      filtered = filtered.filter(item => item.isSale === true);
    }

    setProducts(filtered);
  }, [filters, allProducts, id, location, search]);

  const totalPages = Math.ceil(products.length / perPage);
  const handlePageChange = (event, value) => setPage(value);

  const startIndex = (page - 1) * perPage;
  const endIndex = startIndex + perPage;
  const currentProducts = products.slice(startIndex, endIndex);

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  useEffect(() => { setPage(1); }, [products]);
  useEffect(() => { getAllProducts(); }, [id]);
  useEffect(() => { setPage(1); }, [filters]);

  // Close drawer on body scroll lock
  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [drawerOpen]);

  const getAllProducts = async () => {
    try {
      const data = await fetchDataFromApi("/api/products?limit=1000");
      if (data?.error) return;
      setAllProducts(data.products);
      setProducts(data.products);
    } catch (error) {
      console.log("PRODUCT FETCH ERROR:", error);
    }
  };

  return (
    <>
      {/* ── MOBILE SIDEBAR DRAWER OVERLAY ── */}
      <div
        className={`sidebar-drawer-overlay ${drawerOpen ? 'open' : ''}`}
        onClick={() => setDrawerOpen(false)}
        style={{ display: drawerOpen ? 'flex' : 'none' }}
      />

      {/* ── MOBILE SIDEBAR DRAWER PANEL ── */}
      <div className={`sidebar-drawer-panel ${drawerOpen ? 'open' : ''}`}>
        <div className="sidebar-drawer-header">
          <h6>🔍 Filters</h6>
          <button
            className="sidebar-drawer-close"
            onClick={() => setDrawerOpen(false)}
            aria-label="Close filters"
          >
            ✕
          </button>
        </div>
        <div className="sidebar-drawer-body">
          {/* Render the same Sidebar component inside the drawer */}
          <Sidebar setFilters={setFilters} />
        </div>
        <div className="sidebar-drawer-footer">
          <button
            className="sidebar-apply-btn"
            onClick={() => setDrawerOpen(false)}
          >
            Apply Filters{activeFilterCount > 0 ? ` (${activeFilterCount})` : ''}
          </button>
        </div>
      </div>

      <div className="product_Listing_Page">
        <div className="container">
          <div className="productListing d-flex">

            {/* ── DESKTOP SIDEBAR (hidden on mobile) ── */}
            <Sidebar setFilters={setFilters} />

            <div className="content_right">
              <Banner title="Products" />

              <div className="showBy mt-3 mb-4 d-flex align-items-center">
                <div className="d-flex btnWrapper">
                  <Button className={productView === 'one' ? 'act' : ''} onClick={() => setproductView('one')}><IoIosMenu /></Button>
                  <Button className={productView === 'two' ? 'act' : ''} onClick={() => setproductView('two')}><HiViewGrid /></Button>
                  <Button className={productView === 'three' ? 'act' : ''} onClick={() => setproductView('three')}><CgMenuGridR /></Button>
                  <Button className={productView === 'four' ? 'act' : ''} onClick={() => setproductView('four')}><TfiLayoutGrid4Alt /></Button>
                </div>

                {/* ── MOBILE: Filter toggle button (shown via CSS) ── */}
                <button
                  className="filter-toggle-btn"
                  onClick={() => setDrawerOpen(true)}
                >
                  <FaFilter />
                  Filters
                  {activeFilterCount > 0 && (
                    <span className="filter-badge">{activeFilterCount}</span>
                  )}
                </button>

                <div className="ml-auto showByFilter">
                  <Button onClick={handleClick}>
                    Show {perPage} <FaAngleDown />
                  </Button>
                  <Menu
                    className="w-100 showPerPageDropdown"
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={openDropdown}
                    onClose={handleClose}
                    slotProps={{ list: { 'aria-labelledby': 'basic-button' } }}
                  >
                    <MenuItem onClick={() => { setPerPage(8); handleClose(); }}>8</MenuItem>
                    <MenuItem onClick={() => { setPerPage(16); handleClose(); }}>16</MenuItem>
                    <MenuItem onClick={() => { setPerPage(24); handleClose(); }}>24</MenuItem>
                    <MenuItem onClick={() => { setPerPage(32); handleClose(); }}>32</MenuItem>
                  </Menu>
                </div>
              </div>

              <div className="productListing">
                {products.length > 0 ? (
                  currentProducts.map((item) => (
                    <ProductItem
                      key={item._id}
                      item={item}
                      itemView={productView}
                    />
                  ))
                ) : (
                  <div className="card shadow-sm border-0 w-100">
                    <div className="card-body text-center py-5">
                      <div className="mb-3">
                        <i className="bi bi-search text-muted" style={{ fontSize: "40px" }}></i>
                      </div>
                      <h5 className="text-muted mb-2">No Products Found</h5>
                      <p className="text-secondary small mb-3">
                        We couldn't find any products matching your criteria.
                      </p>
                      <Link to="/">
                        <Button className="btn-blue btn-sm" variant="outlined">
                          Continue Shopping
                        </Button>
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              <div className="d-flex align-items-center justify-content-center mt-5">
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={handlePageChange}
                  color="primary"
                  size="large"
                />
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Listing;