import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { supabase } from "../../Utils/SuperbaseClient";

const Dashboard = () => {
  const [activeContent, setActiveContent] = useState("Products");
  const [doctorDetails, setDoctorDetails] = useState({
    name: "",
    specialization: "",
    email: "",
    password: "",
    telephone: "",
  });
  const [formMessage, setFormMessage] = useState("");
  const [products, setProducts] = useState([]);
  const [productDetails, setProductDetails] = useState({
    name: "",
    price: "",
    description: "",
    quantity: "",
    product_image: "",
  });

  useEffect(() => {
    // Fetch products when the component mounts
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase.from("Products").select("*");
      if (error) throw error;
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleToggle = (content) => {
    setActiveContent(content);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDoctorDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleProductInputChange = (e) => {
    const { name, value } = e.target;
    setProductDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleAddDoctor = async (e) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase
        .from("Doctors")
        .insert([doctorDetails]);
      if (error) {
        throw error;
      }
      setFormMessage("Doctor added successfully!");
      setDoctorDetails({
        name: "",
        specialization: "",
        email: "",
        password: "",
        telephone: "",
      });
    } catch (error) {
      setFormMessage(`Error: ${error.message}`);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase
        .from("Products")
        .insert([productDetails]);
      if (error) throw error;
      setFormMessage("Product added successfully!");
      setProductDetails({
        name: "",
        price: "",
        description: "",
        quantity: "",
        product_image: "",
      });
      fetchProducts(); // Refresh the product list after adding
    } catch (error) {
      setFormMessage(`Error: ${error.message}`);
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      const { data, error } = await supabase
        .from("Products")
        .delete()
        .match({ id: productId });
      if (error) throw error;
      setFormMessage("Product deleted successfully!");
      fetchProducts(); // Refresh the product list after deletion
    } catch (error) {
      setFormMessage(`Error: ${error.message}`);
    }
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();

    try {
      // Check if the product exists using its ProductId (or another unique identifier)
      const { data, error: checkError } = await supabase
        .from("Products")
        .select("id")
        .eq("id", productDetails.id) // Use the product's unique identifier
        .single();

      if (checkError) throw checkError;

      if (!data) {
        setFormMessage("Product does not exist.");
        return;
      }

      // If product exists, update it
      const { data: updatedData, error: updateError } = await supabase
        .from("Products")
        .update({
          name: productDetails.name,
          price: productDetails.price,
          description: productDetails.description,
          quantity: productDetails.quantity,
          product_image: productDetails.product_image,
        })
        .eq("id", productDetails.id); // Update the product by its id

      if (updateError) throw updateError;

      setFormMessage(" updated successfully!");

      // Clear form fields after successful update
      setProductDetails({
        name: "",
        price: "",
        description: "",
        quantity: "",
        product_image: "",
      });

      fetchProducts(); // Refresh the product list after updating
    } catch (error) {
      setFormMessage(`Error: ${error.message}`);
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh", flexDirection: "row" }}>
      {/* Sidebar */}
      <div
        style={{
          flex: 1,
          backgroundColor: "#f8f9fa",
          display: "flex",
          flexDirection: "column",
          padding: "20px",
          borderRight: "1px solid #ddd",
          position: "fixed",
          height: "100vh",
        }}
      >
        <h2 style={{ marginBottom: "20px" }}>Sidebar</h2>
        <button
          onClick={() => handleToggle("Products")}
          style={{
            marginBottom: "10px",
            padding: "10px",
            cursor: "pointer",
            backgroundColor: activeContent === "Products" ? "green" : "#fff",
            color: activeContent === "Products" ? "#fff" : "#000",
            border: "1px solid green",
            borderRadius: "5px",
          }}
        >
          Products
        </button>
        <button
          onClick={() => handleToggle("Doctors")}
          style={{
            padding: "10px",
            cursor: "pointer",
            backgroundColor: activeContent === "Doctors" ? "green" : "#fff",
            color: activeContent === "Doctors" ? "#fff" : "#000",
            border: "1px solid green",
            borderRadius: "5px",
          }}
        >
          Doctors
        </button>
      </div>

      {/* Main Content */}
      <div
        style={{
          flex: 5,
          padding: "20px",
        }}
      >
        <h1 style={{ backgroundColor: "green" }}>Dashboard</h1>
        {/* Edit Product Form */}
        {productDetails.id && (
          <div
            style={{
              maxWidth: "500px",
              margin: "0 auto",
              padding: "20px",
              border: "1px solid #ddd",
              borderRadius: "8px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              backgroundColor: "#f9f9f9",
            }}
          >
            <h2
              style={{
                textAlign: "center",
                color: "#333",
                marginBottom: "20px",
              }}
            >
              Update Product
            </h2>
            <form onSubmit={handleUpdateProduct}>
              <div style={{ marginBottom: "15px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "5px",
                    fontWeight: "bold",
                  }}
                >
                  Product Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={productDetails.name}
                  onChange={handleProductInputChange}
                  required
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: "1px solid #ccc",
                    borderRadius: "5px",
                    fontSize: "14px",
                  }}
                />
              </div>
              <div style={{ marginBottom: "15px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "5px",
                    fontWeight: "bold",
                  }}
                >
                  Price
                </label>
                <input
                  type="number"
                  name="price"
                  value={productDetails.price}
                  onChange={handleProductInputChange}
                  required
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: "1px solid #ccc",
                    borderRadius: "5px",
                    fontSize: "14px",
                  }}
                />
              </div>
              <div style={{ marginBottom: "15px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "5px",
                    fontWeight: "bold",
                  }}
                >
                  Description
                </label>
                <input
                  type="text"
                  name="description"
                  value={productDetails.description}
                  onChange={handleProductInputChange}
                  required
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: "1px solid #ccc",
                    borderRadius: "5px",
                    fontSize: "14px",
                  }}
                />
              </div>
              <div style={{ marginBottom: "15px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "5px",
                    fontWeight: "bold",
                  }}
                >
                  Quantity
                </label>
                <input
                  type="number"
                  name="quantity"
                  value={productDetails.quantity}
                  onChange={handleProductInputChange}
                  required
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: "1px solid #ccc",
                    borderRadius: "5px",
                    fontSize: "14px",
                  }}
                />
              </div>
              <div style={{ marginBottom: "15px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "5px",
                    fontWeight: "bold",
                  }}
                >
                  Product Image URL
                </label>
                <input
                  type="text"
                  name="product_image"
                  value={productDetails.product_image}
                  onChange={handleProductInputChange}
                  required
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: "1px solid #ccc",
                    borderRadius: "5px",
                    fontSize: "14px",
                  }}
                />
              </div>
              <button
                type="submit"
                style={{
                  width: "100%",
                  padding: "10px",
                  backgroundColor: "green",
                  color: "#fff",
                  border: "none",
                  borderRadius: "5px",
                  fontSize: "16px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                }}
              >
                Update Product
              </button>
            </form>
            {formMessage && (
              <p
                style={{
                  marginTop: "20px",
                  textAlign: "center",
                  color: formMessage.startsWith("Error") ? "red" : "green",
                }}
              >
                {formMessage}
              </p>
            )}
          </div>
        )}

        {activeContent === "Products" && (
          <div>
            <h2>Products</h2>
            {/* Add Product Form */}
            <div
              style={{
                maxWidth: "500px",
                margin: "0 auto",
                padding: "20px",
                border: "1px solid #ddd",
                borderRadius: "8px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                backgroundColor: "#f9f9f9",
              }}
            >
              <h2
                style={{
                  textAlign: "center",
                  color: "#333",
                  marginBottom: "20px",
                }}
              >
                Add a New Product
              </h2>
              <form onSubmit={handleAddProduct}>
                <div style={{ marginBottom: "15px" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "5px",
                      fontWeight: "bold",
                    }}
                  >
                    Product Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={productDetails.name}
                    onChange={handleProductInputChange}
                    required
                    style={{
                      width: "100%",
                      padding: "10px",
                      border: "1px solid #ccc",
                      borderRadius: "5px",
                      fontSize: "14px",
                    }}
                  />
                </div>
                <div style={{ marginBottom: "15px" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "5px",
                      fontWeight: "bold",
                    }}
                  >
                    Price
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={productDetails.price}
                    onChange={handleProductInputChange}
                    required
                    style={{
                      width: "100%",
                      padding: "10px",
                      border: "1px solid #ccc",
                      borderRadius: "5px",
                      fontSize: "14px",
                    }}
                  />
                </div>
                <div style={{ marginBottom: "15px" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "5px",
                      fontWeight: "bold",
                    }}
                  >
                    Description
                  </label>
                  <input
                    type="text"
                    name="description"
                    value={productDetails.description}
                    onChange={handleProductInputChange}
                    required
                    style={{
                      width: "100%",
                      padding: "10px",
                      border: "1px solid #ccc",
                      borderRadius: "5px",
                      fontSize: "14px",
                    }}
                  />
                </div>
                <div style={{ marginBottom: "15px" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "5px",
                      fontWeight: "bold",
                    }}
                  >
                    Quantity
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    value={productDetails.quantity}
                    onChange={handleProductInputChange}
                    required
                    style={{
                      width: "100%",
                      padding: "10px",
                      border: "1px solid #ccc",
                      borderRadius: "5px",
                      fontSize: "14px",
                    }}
                  />
                </div>
                <div style={{ marginBottom: "15px" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "5px",
                      fontWeight: "bold",
                    }}
                  >
                    Product Image URL
                  </label>
                  <input
                    type="text"
                    name="product_image"
                    value={productDetails.product_image}
                    onChange={handleProductInputChange}
                    required
                    style={{
                      width: "100%",
                      padding: "10px",
                      border: "1px solid #ccc",
                      borderRadius: "5px",
                      fontSize: "14px",
                    }}
                  />
                </div>
                <button
                  type="submit"
                  style={{
                    width: "100%",
                    padding: "10px",
                    backgroundColor: "green",
                    color: "#fff",
                    border: "none",
                    borderRadius: "5px",
                    fontSize: "16px",
                    fontWeight: "bold",
                    cursor: "pointer",
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  Add Product
                </button>
              </form>
              {formMessage && (
                <p
                  style={{
                    marginTop: "20px",
                    textAlign: "center",
                    color: formMessage.startsWith("Error") ? "red" : "green",
                  }}
                >
                  {formMessage}
                </p>
              )}
            </div>

            {/* Display Products */}
            <div>
              <h3>Product List</h3>
              <table
                style={{
                  width: "80%",
                  borderCollapse: "collapse",
                  marginTop: "20px",
                  margin: "0 auto",
                }}
              >
                <thead>
                  <tr>
                    <th style={{ padding: "8px", border: "1px solid #ddd" }}>
                      Name
                    </th>
                    <th style={{ padding: "8px", border: "1px solid #ddd" }}>
                      Price
                    </th>
                    <th style={{ padding: "8px", border: "1px solid #ddd" }}>
                      Quantity
                    </th>
                    <th style={{ padding: "8px", border: "1px solid #ddd" }}>
                      Edit
                    </th>
                    <th style={{ padding: "8px", border: "1px solid #ddd" }}>
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id}>
                      <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                        {product.name}
                      </td>
                      <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                        {product.price}
                      </td>
                      <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                        {product.quantity}
                      </td>
                      <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                        <button
                          onClick={() => {
                            setProductDetails({
                              ...product,
                              id: product.id, // Set the product ID for update
                            });

                            // Scroll to the top of the page
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }}
                          style={{
                            backgroundColor: "#3498db",
                            color: "#fff",
                            padding: "5px 10px",
                            border: "none",
                            borderRadius: "5px",
                            cursor: "pointer",
                          }}
                        >
                          Edit
                        </button>
                      </td>

                      <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          style={{
                            backgroundColor: "#e74c3c",
                            color: "#fff",
                            padding: "5px 10px",
                            border: "none",
                            borderRadius: "5px",
                            cursor: "pointer",
                          }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeContent === "Doctors" && (
          <div
            style={{
              maxWidth: "500px",
              margin: "0 auto",
              padding: "20px",
              border: "1px solid #ddd",
              borderRadius: "8px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              backgroundColor: "#f9f9f9",
            }}
          >
            <h2
              style={{
                textAlign: "center",
                color: "#333",
                marginBottom: "20px",
              }}
            >
              Add a New Doctor
            </h2>
            <form onSubmit={handleAddDoctor}>
              <div style={{ marginBottom: "15px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "5px",
                    fontWeight: "bold",
                  }}
                >
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={doctorDetails.name}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: "1px solid #ccc",
                    borderRadius: "5px",
                    fontSize: "14px",
                  }}
                />
              </div>
              <div style={{ marginBottom: "15px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "5px",
                    fontWeight: "bold",
                  }}
                >
                  Specialization
                </label>
                <input
                  type="text"
                  name="specialization"
                  value={doctorDetails.specialization}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: "1px solid #ccc",
                    borderRadius: "5px",
                    fontSize: "14px",
                  }}
                />
              </div>
              <div style={{ marginBottom: "15px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "5px",
                    fontWeight: "bold",
                  }}
                >
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={doctorDetails.email}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: "1px solid #ccc",
                    borderRadius: "5px",
                    fontSize: "14px",
                  }}
                />
              </div>
              <div style={{ marginBottom: "15px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "5px",
                    fontWeight: "bold",
                  }}
                >
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={doctorDetails.password}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: "1px solid #ccc",
                    borderRadius: "5px",
                    fontSize: "14px",
                  }}
                />
              </div>
              <div style={{ marginBottom: "15px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "5px",
                    fontWeight: "bold",
                  }}
                >
                  Telephone
                </label>
                <input
                  type="text"
                  name="telephone"
                  value={doctorDetails.telephone}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: "1px solid #ccc",
                    borderRadius: "5px",
                    fontSize: "14px",
                  }}
                />
              </div>
              <button
                type="submit"
                style={{
                  width: "100%",
                  padding: "10px",
                  backgroundColor: "green",
                  color: "#fff",
                  border: "none",
                  borderRadius: "5px",
                  fontSize: "16px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                }}
              >
                Add Doctor
              </button>
            </form>
            {formMessage && (
              <p
                style={{
                  marginTop: "20px",
                  textAlign: "center",
                  color: formMessage.startsWith("Error") ? "red" : "green",
                }}
              >
                {formMessage}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
