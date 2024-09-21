import { products } from './data.js';
import { useState } from 'react';
import { getImageUrl } from './utils.js';

export default function Shop() {
  const [card, setCard] = useState([]);
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState('');
  const [discount, setDiscount] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(''); // หมวดหมู่ที่เลือก

  const categories = [
    'All',
    'Virtual Reality',
    'Accessories',
    'Cameras',
    'Audio',
    'Wearables',
    'Electronics',
    'Smart Home',
  ];

  const coupons = [
    { code: 'DISCOUNT10', label: '10 ฿ Off', value: 10, type: 'fixed' },
    { code: 'DISCOUNT20', label: '20 ฿ Off', value: 20, type: 'fixed' },
    { code: 'DISCOUNT50', label: '50 ฿ Off', value: 50, type: 'fixed' },
    { code: 'DISCOUNT100', label: '10% Off', value: 10, type: 'percentage' }, // ลด 10% แทน
  ];

  function addTocard(product) {
    const productInCard = card.find(item => item.id === product.id);
    if (productInCard) {
      setCard(
        card.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
    } else {
      setCard([...card, { ...product, quantity: 1 }]);
    }
  }

  function removeFromCard(product) {
    setCard(card.filter(item => item.id !== product.id));
  }

  function incrementQuantity(product) {
    setCard(
      card.map(item =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  }

  function decrementQuantity(product) {
    setCard(
      card.map(item =>
        item.id === product.id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  }

  function calculateTotalPrice() {
    return card.reduce((total, item) => total + item.price * item.quantity, 0);
  }

  function calculateFinalPrice() {
    const total = calculateTotalPrice();
    const shippingCost = 100;

    let finalDiscount = 0;

    // คำนวณส่วนลด
    if (selectedCoupon) {
      const coupon = coupons.find(c => c.code === selectedCoupon);
      if (coupon) {
        if (coupon.type === 'percentage') {
          finalDiscount = (coupon.value / 100) * total; // ลดเป็นเปอร์เซ็นต์
        } else if (coupon.type === 'fixed') {
          finalDiscount = coupon.value; // ลดเป็นจำนวนเงินคงที่
        }
      }
    }

    const finalPrice = total + shippingCost - finalDiscount;
    return finalPrice > 0 ? finalPrice : 0;
  }

  function handleCouponChange(e) {
    const selectedCode = e.target.value;
    const coupon = coupons.find(c => c.code === selectedCode);

    if (coupon) {
      setSelectedCoupon(coupon.code);
      setDiscount(coupon.value);
    } else {
      setSelectedCoupon('');
      setDiscount(0);
    }
  }

  function handleCategoryChange(category) {
    setSelectedCategory(category);
  }

  const filteredProducts =
    selectedCategory === 'All' || selectedCategory === ''
      ? products
      : products.filter(product => product.profession === selectedCategory);

  const listItems = filteredProducts.map(product => (
    <li
      key={product.id}
      className="container"
      onClick={() => addTocard(product)} // เพิ่ม onClick ให้ทั้งกรอบสินค้า
      style={{
        cursor: 'pointer', // เปลี่ยนเมาส์เป็น pointer เพื่อบอกว่าคลิกได้
        border: '1px solid #ddd',
        padding: '10px',
        textAlign: 'center',
        width: '200px', // กำหนดขนาดกรอบสินค้า
        margin: '10px',
      }}
    >
      <img
        src={getImageUrl(product)}
        alt={product.name}
        style={{ width: '150px', height: '150px' }}
      />
      <p>
        <b>{product.name}:</b> {product.profession}
      </p>
      <p>{product.accomplishment}</p>
      <p>Price: {product.price} ฿</p>
    </li>
  ));

  return (
    <div>
      <header
        style={{
          position: 'sticky',
          top: '0',
          backgroundColor: 'white',
          zIndex: 1000,
          padding: '10px',
          boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
        }}
      >
        <h1>My Shopping</h1>
        <nav
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <ul style={{ listStyle: 'none', display: 'flex', gap: '20px' }}></ul>
          <div style={{ position: 'relative' }}>
            <button
              className="botton1"
              onClick={() => setDropdownVisible(!isDropdownVisible)}
            >
              🛒
              {card.length > 0 && (
                <span className="span1">
                  {card.reduce((total, item) => total + item.quantity, 0)}
                </span>
              )}
            </button>

            {isDropdownVisible && (
              <div className="downdiv">
                {card.length === 0 ? (
                  <p>Your cart is empty.</p>
                ) : (
                  <div>
                    <ul
                      style={{
                        listStyle: 'none',
                        padding: '0',
                        margin: '0',
                      }}
                    >
                      {card.map(product => (
                        <li
                          key={product.id}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            marginBottom: '10px',
                          }}
                        >
                          <img
                            src={getImageUrl(product)}
                            alt={product.name}
                            style={{
                              width: '50px',
                              height: '50px',
                              marginRight: '10px',
                            }}
                          />
                          <div>
                            <p style={{ margin: '0' }}>{product.name}</p>
                            <p style={{ margin: '0', fontSize: '12px' }}>
                              Price: {product.price} ฿ | Total: {product.price * product.quantity} ฿
                            </p>
                          </div>
                          <div
                            style={{ display: 'flex', alignItems: 'center' }}
                          >
                            <p style={{ margin: '0', fontSize: '15px' }}>
                              จำนวน:{' '}
                            </p>
                            <button
                              onClick={() => decrementQuantity(product)}
                              style={{
                                backgroundColor: 'white',
                                border: 'none',
                                padding: '5px 10px',
                                cursor: 'pointer',
                                fontSize: '14px',
                                color: 'black',
                              }}
                            >
                              -
                            </button>
                            <span
                              style={{ width: '20px', textAlign: 'center' }}
                            >
                              {product.quantity}
                            </span>
                            <button
                              onClick={() => incrementQuantity(product)}
                              style={{
                                backgroundColor: 'white',
                                border: 'none',
                                padding: '5px 10px',
                                cursor: 'pointer',
                                fontSize: '14px',
                                color: 'black',
                              }}
                            >
                              +
                            </button>
                            <button
                              onClick={() => removeFromCard(product)}
                              style={{
                                backgroundColor: 'red',
                                color: 'white',
                                border: 'none',
                                padding: '5px 10px',
                                marginLeft: 'auto',
                                cursor: 'pointer',
                                fontSize: '14px',
                              }}
                            >
                              Remove
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                    <p>Total Price: {calculateTotalPrice()} ฿</p>

                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                      }}
                    >
                      <select
                        value={selectedCoupon}
                        onChange={handleCouponChange}
                        style={{
                          padding: '8px',
                          flex: 1,
                          border: '1px solid #000',
                          borderRadius: '5px',
                        }}
                      >
                        <option value="">Select a coupon</option>
                        {coupons.map(coupon => (
                          <option key={coupon.code} value={coupon.code}>
                            {coupon.label}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={() => alert(`Coupon ${selectedCoupon} applied!`)}
                        style={{
                          padding: '8px 16px',
                          backgroundColor: 'green',
                          color: 'white',
                          border: 'none',
                          borderRadius: '5px',
                          cursor: 'pointer',
                        }}
                      >
                        Apply Coupon
                      </button>
                    </div>
                    <p>Shipping: 100 ฿</p> {/* แสดงค่าขนส่ง */}
                    <p>Discount: {discount} ฿</p>
                    <p>Final Price: {calculateFinalPrice()} ฿</p> {/* คำนวณราคาสุดท้าย */}
                    <button
                      onClick={() => alert('Proceeding to Checkout')}
                      style={{
                        padding: '10px 20px',
                        backgroundColor: 'blue',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                      }}
                    >
                      Checkout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </nav>
      </header>

      <section id="products">
        <div style={{ marginBottom: '20px', textAlign: 'center' }}>
          {categories.map(category => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              style={{
                margin: '0 10px',
                padding: '10px 20px',
                cursor: 'pointer',
                backgroundColor:
                  selectedCategory === category ? '#000' : '#ddd',
                color: selectedCategory === category ? '#fff' : '#000',
              }}
            >
              {category}
            </button>
          ))}
        </div>

        <h4>Product List</h4>
        <ul
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '20px',
            justifyContent: 'center',
            padding: '0 10%',
          }}
        >
          {listItems}
        </ul>
      </section>
      <footer>
        <p>© 2024 My Shopping</p>
      </footer>
    </div>
  );
}
