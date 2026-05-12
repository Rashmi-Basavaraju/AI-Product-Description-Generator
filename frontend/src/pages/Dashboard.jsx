import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import "./style.css";

import { FaHome, FaBox, FaSignOutAlt, FaSearch, FaChartLine, FaRobot, FaStar } from "react-icons/fa";

// ✅ CHART IMPORTS
import { Chart as ChartJS,  BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";

import { Bar } from "react-chartjs-2";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [itemId, setItemId] = useState("");
  const [savedProducts, setSavedProducts] = useState([]);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [stats, setStats] = useState({
    total: 0,
    today: 0
  });

  const navigate = useNavigate();

  // USER
  const user = JSON.parse(localStorage.getItem("user"));

  // LOGOUT
  const logout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  // PROTECT ROUTE
  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, []);

  // LOAD DATASET + PRODUCTS
  useEffect(() => {

    // LOAD DATASET PRODUCTS
    API.get("/api/dataset")
      .then((res) => {
        setProducts(res.data);
      })
      .catch((err) => {
        console.log(err);
      });

    loadProducts();

  }, []);

  // LOAD GENERATED PRODUCTS
  const loadProducts = async () => {

    if (!user) return;

    try {

      const res = await API.get(`/api/products/${user.username}`);

      setSavedProducts(res.data);

      // ✅ CALCULATE STATS
      const today = new Date().toLocaleDateString();

      const todayCount = res.data.filter(
        (p) =>
          new Date(p.createdAt).toLocaleDateString() === today
      ).length;

      setStats({
        total: res.data.length,
        today: todayCount
      });

    } catch (err) {
      console.log(err);
    }
  };

  // GENERATE DESCRIPTION
  const generate = async () => {

    if (!itemId) {
      return alert("Please select a product");
    }

    setLoading(true);

    try {

      const res = await API.post(
        "/api/generate-from-dataset",
        {
          itemId,
          user: user.username
        }
      );

      await loadProducts();

      navigate("/output", {
        state: {
          description: res.data.description
        }
      });

    } catch (err) {
      console.log(err);
      alert("Generation failed");
    } finally {
      setLoading(false);
    }
  };

  // CHART DATA
  const getChartData = () => {

    const counts = {};

    savedProducts.forEach((p) => {

      const date = new Date(
        p.createdAt
      ).toLocaleDateString();

      counts[date] = (counts[date] || 0) + 1;
    });

    return {
      labels: Object.keys(counts),

      datasets: [
        {
          label: "Products Generated",
          data: Object.values(counts),
          backgroundColor: "#7b2ff7",
          borderRadius: 10
        }
      ]
    };
  };

  // SEARCH FILTER
  const filteredProducts = savedProducts.filter((p) =>
    p.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="dashboard-container">

      {/* SIDEBAR */}
      <div className="sidebar">

        <h2 className="logo">
          <FaRobot /> AI Generator
        </h2>
        <ul>
          <li
            className={
              activeTab === "dashboard"
                ? "active"
                : ""
            }
            onClick={() =>
              setActiveTab("dashboard")
            }
          >
            <FaHome /> Dashboard
          </li>

          <li
            className={
              activeTab === "products"
                ? "active"
                : ""
            }
            onClick={() =>
              setActiveTab("products")
            }
          >
            <FaBox /> My Products
          </li>

          <li onClick={logout}>
            <FaSignOutAlt /> Logout
          </li>

        </ul>

      </div>

      {/* MAIN SECTION */}
      <div className="main">

        {/* HEADER */}

        <div className="header">

          <div>
            <h1>
              Welcome {user?.username} 👋
            </h1>

            <p>
              AI-powered E-Commerce Product
              Description Generator
            </p>
          </div>

        </div>

        {/* DASHBOARD TAB */}

        {activeTab === "dashboard" && (

          <div className="dashboard-row">

            {/* GENERATOR CARD */}

            <div className="card">

              <h2>
                Generate Product Description
              </h2>

              <label>Select Product</label>

              <select
                value={itemId}
                onChange={(e) =>
                  setItemId(e.target.value)
                }
              >

                <option value="">
                  Choose Product
                </option>

                {products.map((p, i) => (
                  <option
                    key={i}
                    value={p.itemId}
                  >
                    {p.itemName}
                  </option>
                ))}

              </select>

              <button
                className="primary-btn"
                onClick={generate}
              >
                {loading
                  ? "Generating..."
                  : "Generate Description"}
              </button>

            </div>

            {/* CHART CARD */}

            <div className="chart-card">

              <h3>Usage Overview 📊</h3>

              {savedProducts.length > 0 ? (

                <Bar data={getChartData()} />

              ) : (

                <p className="no-data">
                  No data available yet.
                  Generate products to see
                  analytics.
                </p>

              )}

            </div>

          </div>

        )}

        {/* PRODUCTS TAB */}

        {activeTab === "products" && (

          <div className="table-card">

            {/* TOP BAR */}

            <div className="table-header">

              <div className="search-box">
                
                  <FaSearch /> 
                <input 
                  type="text"
                  placeholder="  Search products..."
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                />
      
              </div>

            </div>

            {/* TABLE */}

            <table>

              <thead>

                <tr>
                  <th>#</th>
                  <th>Product</th>
                  <th>Description</th>
                  <th>Date</th>
                </tr>

              </thead>

              <tbody>

                {filteredProducts.length > 0 ? (

                  filteredProducts.map((p, i) => (

                    <tr key={i}>

                      <td>{i + 1}</td>

                      <td>{p.name}</td>

                      <td className="desc-cell">
                        {p.description}
                      </td>

                      <td>
                        {new Date(
                          p.createdAt
                        ).toLocaleDateString()}
                      </td>

                    </tr>

                  ))

                ) : (

                  <tr>

                    <td
                      colSpan="4"
                      style={{
                        textAlign: "center",
                        padding: "20px"
                      }}
                    >
                      No products found
                    </td>

                  </tr>

                )}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </div>
  );
}