import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";

function Mproducts() {
  const [product, setProduct] = useState([]);

  const [editproductid, setEditproductid] = useState(null);
  const [editformdata, setEditformdata] = useState({
    name: "",
    category: "",
    price: "",
    image: "",
    specs: "",
  });

  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "",
    price: "",
    image: "",
    specs: "",
  });

  useEffect(() => {
    axios
      .get("http://localhost:5000/products")
      .then((res) => setProduct(res.data))
      .catch((err) => console.log(err));
  }, []);


  const addProduct = (e) => {
    e.preventDefault();

    axios
      .post("http://localhost:5000/products", newProduct)
      .then((res) => {
        setProduct([...product, res.data]);
        setNewProduct({
          name: "",
          category: "",
          price: "",
          image: "",
          specs: "",
        });
      })
      .catch((err) => console.log(err));
  };

  const deletProduct = (id) => {
    if (window.confirm("Are you sure?")) {
      axios.delete(`http://localhost:5000/products/${id}`).then(() => {
        setProduct(product.filter((p) => p.id !== id));
      });
    }
  };

  const handleEdit = (item) => {
    setEditproductid(item.id);
    setEditformdata({
      name: item.name,
      category: item.category,
      price: item.price,
      image: item.image,
      specs: item.specs,
    });
  };

  const handlecancel = () => {
    setEditproductid(null);
  };

  const inputchange = (e) => {
    const { name, value } = e.target;
    setEditformdata({ ...editformdata, [name]: value });
  };

  const save = (id) => {
    axios
      .put(`http://localhost:5000/products/${id}`, editformdata)
      .then((res) => {
        setProduct(product.map((p) => (p.id === id ? res.data : p)));
        setEditproductid(null);
      });
  };

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />

      <div style={{ flex: 1, padding: "30px", background: "#fff" }}>
        <h2>Manage Products (Admin)</h2>

        <form onSubmit={addProduct} style={{ marginBottom: 20 }}>
          <input
            placeholder="Product Name"
            value={newProduct.name}
            onChange={(e) =>
              setNewProduct({ ...newProduct, name: e.target.value })
            }
            required
          />

          <input
            placeholder="Category"
            value={newProduct.category}
            onChange={(e) =>
              setNewProduct({ ...newProduct, category: e.target.value })
            }
            required
          />

          <input
            type="number"
            placeholder="Price"
            value={newProduct.price}
            onChange={(e) =>
              setNewProduct({ ...newProduct, price: e.target.value })
            }
            required
          />

          <input
            placeholder="Image URL"
            value={newProduct.image}
            onChange={(e) =>
              setNewProduct({ ...newProduct, image: e.target.value })
            }
            required
          />

          <input
            placeholder="Specs"
            value={newProduct.specs}
            onChange={(e) =>
              setNewProduct({ ...newProduct, specs: e.target.value })
            }
            required
          />

          {newProduct.image && (
            <img src={newProduct.image} alt="preview" width="60" />
          )}

          <button type="submit">Add Product</button>
        </form>


        <table border="1" cellPadding="10" width="100%">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Specs</th>
              <th>Category</th>
              <th>Price</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {product.map((item) => (
              <tr key={item.id}>
                <td>
                  {editproductid === item.id ? (
                    <>
                      <input
                        name="image"
                        value={editformdata.image}
                        onChange={inputchange}
                      />
                      <img src={editformdata.image} width="50" alt="preview" />
                    </>
                  ) : (
                    <img src={item.image} width="60" alt={item.name} />
                  )}
                </td>

                <td>
                  {editproductid === item.id ? (
                    <input
                      name="name"
                      value={editformdata.name}
                      onChange={inputchange}
                    />
                  ) : (
                    item.name
                  )}
                </td>

                <td>
           {editproductid === item.id ? (
             <input
               name="specs"
               value={editformdata.specs}
               onChange={inputchange}
             />
           ) : (
             item.specs
        )}
      </td>
      <td>
        {editproductid === item.id ? (
          <input
                   name="category"
                   value={editformdata.category}
                   onChange={inputchange}
                 />
               ) : (
                 item.category
               )}
             </td>
             <td>
               {editproductid === item.id ? (
                 <input
                   type="number"
                   name="price"
                   value={editformdata.price}
                   onChange={inputchange}
                 />
               ) : (
                 `₹${item.price}`
               )}
             </td>
             <td>
               {editproductid === item.id ? (
                 <>
                   <button onClick={() => save(item.id)}>Save</button>
                   <button onClick={handlecancel}>Cancel</button>
                 </>
               ) : (
                 <>
                   <button onClick={() => handleEdit(item)}>Edit</button>
                      <button onClick={() => deletProduct(item.id)}>
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}

            {product.length === 0 && (
              <tr>
                <td colSpan="6" align="center">
                  No products found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Mproducts;
