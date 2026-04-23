import React, { useContext, useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MyContext } from '../../App';
import { fetchDataFromApi, postData } from '../../utils/api';
import Navigation from '../Navigation';
import CountryDropdown from '../CountryDropdown';

// ── SVG Icons ──────────────────────────────────────────────────────────────
const Icon = {
  Search: () => (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
    </svg>
  ),
  Bag: () => (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2">
      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
      <line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
    </svg>
  ),
  Heart: () => (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  ),
  Chevron: () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2">
      <path d="M6 9l6 6 6-6"/>
    </svg>
  ),
  User: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
    </svg>
  ),
  Order: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/>
      <line x1="16" y1="17" x2="8" y2="17"/>
    </svg>
  ),
  Wishlist: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  ),
  Logout: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
      <polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  ),
};

const Header = () => {
  const context = useContext(MyContext);
  const navigate = useNavigate();

  const [user, setUser]             = useState(null);
  const [cartItems, setCartItems]   = useState([]);
  const [cartCount, setCartCount]   = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [showCart, setShowCart]     = useState(false);
  const [showUser, setShowUser]     = useState(false);

  const cartRef = useRef();
  const userRef = useRef();

  useEffect(() => {
    const handler = (e) => {
      if (cartRef.current && !cartRef.current.contains(e.target)) setShowCart(false);
      if (userRef.current && !userRef.current.contains(e.target)) setShowUser(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem('user')));
  }, [context.isLogin]);

  const getCartData = async () => {
    const u = JSON.parse(localStorage.getItem('user'));
    if (!u?._id) return;
    const res = await fetchDataFromApi(`/api/cart/${u._id}`);
    if (res?.items) {
      setCartItems(res.items);
      let total = 0, count = 0;
      res.items.forEach(i => { total += i.product?.price * i.quantity; count += i.quantity; });
      setTotalPrice(total);
      setCartCount(count);
    }
  };

  useEffect(() => { getCartData(); }, []);

  const logout = async () => {
    const u = JSON.parse(localStorage.getItem('user'));
    await postData('/api/user/logout', { userId: u._id });
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/SignIn');
  };

  const requireLogin = (path) => {
    const u = JSON.parse(localStorage.getItem('user'));
    if (!u) {
      context.setAlertBox({ open: true, error: true, msg: 'Please Login First!' });
      navigate('/SignIn');
    } else {
      navigate(path.replace(':id', u._id));
    }
  };

  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
    : 'U';

  return (
    <>
      {/* ── Announcement strip ── */}
      <div className="hdr-strip">
        <span>Due to the <strong>COVID-19</strong> epidemic, orders may be processed with a slight delay</span>
      </div>

      {/* ── Sticky header wrapper ── */}
      <div className="hdr-outer">
        <div className="hdr-inner">

          {/* Row 1: Logo · Country · Search · Actions */}
          <div className="hdr-row1">

            {/* Logo */}
            <Link to="/" className="hdr-logo">
              <div className="hdr-logo-icon">S</div>
              <span className="hdr-logo-text">Shop<span className="hdr-logo-accent">Kart</span></span>
            </Link>

            {/* Country — hidden on mobile */}
            {context.countryList?.length !== 0 && (
              <div className="hdr-country">
                <CountryDropdown />
              </div>
            )}

            {/* Search */}
            <div className="hdr-search-wrap">
              <span className="hdr-search-icon"><Icon.Search /></span>
              <input
                className="hdr-search-input"
                placeholder="Search products, brands and more…"
                onChange={e => context.setSearch(e.target.value)}
              />
            </div>

            {/* Actions */}
            <div className="hdr-actions">

              {/* Price tag — hidden on small mobile */}
              <span className="hdr-price-tag">₹ {totalPrice.toLocaleString('en-IN')}</span>

              {/* Wishlist */}
              <button
                className="hdr-icon-btn"
                onClick={() => requireLogin('/Wishlist/:id')}
                title="Wishlist"
              >
                <Icon.Heart />
              </button>

              {/* Cart */}
              <div ref={cartRef} className="hdr-dropdown-wrap">
                <button
                  className="hdr-icon-btn"
                  onClick={() => { setShowUser(false); setShowCart(v => !v); getCartData(); }}
                  title="Cart"
                >
                  <Icon.Bag />
                  {cartCount > 0 && <span className="hdr-badge">{cartCount}</span>}
                </button>

                {showCart && (
                  <div className="hdr-cart-drop">
                    <div className="hdr-cart-head">
                      <span className="hdr-cart-title">My Cart</span>
                      <span className="hdr-cart-count">{cartCount} items</span>
                    </div>

                    {cartItems.length === 0 ? (
                      <div className="hdr-empty-cart">
                        <div className="hdr-empty-icon">🛒</div>
                        <p className="hdr-empty-title">Your cart is empty</p>
                        <p className="hdr-empty-text">Add items to get started</p>
                        <button className="hdr-shop-btn" onClick={() => navigate('/cat')}>
                          Start Shopping
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="hdr-cart-items">
                          {cartItems.map((item, i) => (
                            <div key={i} className="hdr-cart-item">
                              <img
                                src={item.product?.images?.[0]?.[0]}
                                alt={item.product?.name}
                                className="hdr-cart-img"
                              />
                              <div>
                                <p className="hdr-cart-name">{item.product?.name}</p>
                                <p className="hdr-cart-price">{item.quantity} × ₹{item.product?.price?.toLocaleString('en-IN')}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="hdr-cart-footer">
                          <div className="hdr-cart-subtotal">
                            <span>Subtotal</span>
                            <span className="hdr-cart-amt">₹ {totalPrice.toLocaleString('en-IN')}</span>
                          </div>
                          <button className="hdr-btn-view" onClick={() => { setShowCart(false); navigate(`/cart/${user?._id}`); }}>
                            View Cart
                          </button>
                          <button className="hdr-btn-checkout" onClick={() => { setShowCart(false); navigate(`/checkout/${user?._id}`); }}>
                            Checkout →
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Auth */}
              {context.isLogin ? (
                <div ref={userRef} className="hdr-dropdown-wrap">
                  <button
                    className="hdr-user-pill"
                    onClick={() => { setShowCart(false); setShowUser(v => !v); }}
                  >
                    <div className="hdr-avatar">{initials}</div>
                    <span className="hdr-user-name hdr-hide-xs">{user?.name?.split(' ')[0] || 'Account'}</span>
                    <Icon.Chevron />
                  </button>

                  {showUser && (
                    <div className="hdr-user-drop">
                      <div className="hdr-user-head">
                        <div className="hdr-ud-name">{user?.name}</div>
                        <div className="hdr-ud-email">{user?.email}</div>
                      </div>
                      {[
                        { icon: <Icon.User />,     label: 'My Profile', path: `/profile/${user?._id}` },
                        { icon: <Icon.Order />,    label: 'My Orders',  path: `/myOrders/${user?._id}` },
                        { icon: <Icon.Wishlist />, label: 'Wishlist',   path: `/Wishlist/${user?._id}` },
                      ].map(({ icon, label, path }) => (
                        <div key={label} className="hdr-ud-item" onClick={() => { setShowUser(false); navigate(path); }}>
                          {icon} {label}
                        </div>
                      ))}
                      <div className="hdr-ud-item hdr-ud-logout" onClick={logout}>
                        <Icon.Logout /> Logout
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/SignIn">
                  <button className="hdr-signin-btn">Sign In</button>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Navigation sits inside sticky wrapper */}
        <Navigation />
      </div>

    
    </>
  );
};

export default Header;