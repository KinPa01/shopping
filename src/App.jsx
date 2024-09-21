import { products } from './data.js';
import { useState } from 'react';
import { getImageUrl } from './utils.js';

export default function Shop() {
  const [card, setCard] = useState([]);
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState('');
  const [discount, setDiscount] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('');

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
    { code: 'DISCOUNT10', label: 'ลด 10 ฿', value: 10, type: 'fixed' },
    { code: 'DISCOUNT20', label: 'ลด 20 ฿', value: 20, type: 'fixed' },
    { code: 'DISCOUNT50', label: 'ลด 50 ฿', value: 50, type: 'fixed' },
    { code: 'DISCOUNT100', label: 'ลด 10%', value: 10, type: 'percentage' },
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

    let finalDiscount = discount;

    // คำนวณส่วนลดจากคูปอง 10%
    if (selectedCoupon === 'DISCOUNT100') {
      finalDiscount = (10 / 100) * total; // คำนวณเป็น 10% ของยอดรวม
    }

    const finalPrice = total + shippingCost - finalDiscount;
    return finalPrice > 0 ? finalPrice : 0;
  }

  function handleCouponChange(e) {
    const selectedCode = e.target.value;
    const coupon = coupons.find(c => c.code === selectedCode);

    if (coupon) {
      setSelectedCoupon(coupon.code);
      if (coupon.type === 'percentage') {
        const total = calculateTotalPrice();
        setDiscount((coupon.value / 100) * total); // คำนวณส่วนลดเป็นเปอร์เซ็นต์
      } else {
        setDiscount(coupon.value); // ส่วนลดจำนวนเงินคงที่
      }
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
      onClick={() => addTocard(product)}
      style={{
        cursor: 'pointer',
        border: '1px solid #ddd',
        padding: '10px',
        textAlign: 'center',
        width: '200px',
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
      <p>ราคา: {product.price} ฿</p>
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
        <h1>GOGO My Shopping</h1>
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
                              ราคารวม: {product.price * product.quantity} ฿
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
                              ลบสินค้า
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                    <p>ราคารวม: {calculateTotalPrice()} ฿</p>

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
                        <option value="">เลือก คูปองส่วนลด</option>
                        {coupons.map(coupon => (
                          <option key={coupon.code} value={coupon.code}>
                            {coupon.label}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={() => alert(`คูปอง ${selectedCoupon} ถูกใช้งาน!`)}
                        style={{
                          padding: '8px 16px',
                          backgroundColor: 'green',
                          color: 'white',
                          border: 'none',
                          borderRadius: '5px',
                          cursor: 'pointer',
                        }}
                      >
                        เลือก คูปอง
                      </button>
                    </div>
                    <p>ค่าจัดส่ง: 100 ฿</p>
                    <p>ส่วนลดทั้งหมด: {selectedCoupon === 'DISCOUNT100' ? `${discount.toFixed(2)} ฿` : `${discount} ฿`}</p>
                    <p>รวมทั้งสิน: {calculateFinalPrice()} ฿</p>
                    <button
                      onClick={() => alert('ขอบคุณที่ใช้บริการ ชำระเงินเสร็จสิ้น')}
                      style={{
                        padding: '10px 20px',
                        backgroundColor: 'blue',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                      }}
                    >
                      ชำระเงิน
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
        <p>© 2024 GOGO MY Shopping</p>
      </footer>
    </div>
  );
}
