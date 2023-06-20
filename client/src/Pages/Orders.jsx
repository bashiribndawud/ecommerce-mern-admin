import axios from "axios";
import React, {useEffect, useState} from "react";

const Orders = () => {
  const [orders, setOrders] = useState([])
  const getAllOrders = async () => {
    const {data, status} = await axios.get('/order/all')
    if(status === 200){
      setOrders(data)
    }
  }
  useEffect(() => {
    getAllOrders();
  }, [])
  return (
    <div>
      <h2 className="font-bold pb-4 text-2xl text-gray-600">Orders</h2>
      <table>
        <thead>
          <tr>
            <td>Date</td>
            <td>Paid</td>
            <td>RECIPIENT</td>
            <td>PRODUCTS</td>
          </tr>
        </thead>
        <tbody>
          {orders.length > 0 &&
            orders.map((order) => (
              <tr key={order._id}>
                <td>{new Date(order.createdAt).toLocaleString()}</td>
                <td className={`${order.paid ? 'text-green-600' : 'text-red-600'}`}>
                  {order.paid ? 'YES' : 'NO'}
                </td>
                <td>
                  {order.name} {order.city}
                  {order.country} {order.address}
                </td>
                <td>
                  {order.line_items.map((l) => (
                    <>
                      {l.price_data.product_data.name} X{l.quantity} <br />
                    </>
                  ))}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default Orders;
