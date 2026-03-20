import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import logo from "/images/logo.png";
import { useSelector } from "react-redux";

function GoldPriceSetting() {

  const { baseUrl } = useSelector((state) => state.wallet);

  const [currentPrice, setCurrentPrice] = useState(0);
  const [newPrice, setNewPrice] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPrice();
  }, []);

  /* ===== GET PRICE ===== */

  const fetchPrice = async () => {

    try {

      const res = await fetch(`${baseUrl}user/admin-action.php`, {
        credentials: "include"
      });

      const data = await res.json();
      // console.log(data);
      if (data.success) {
        setCurrentPrice(parseFloat(data.price));
      }

    } catch (err) {

      toast.error("Failed to fetch gold price.");

    }
  };

  /* ===== SET PRICE ===== */

  // const handleSubmit = async (e) => {

  //   e.preventDefault();

  //   if (!newPrice || Number(newPrice) <= 0) {
  //     toast.error("Invalid price entered.");
  //     return;
  //   }

  //   try {

  //     setLoading(true);

  //     const formData = new URLSearchParams();

  //     formData.append("set_price", "1");
  //     formData.append("gold_price", newPrice);

  //     await fetch(`${baseUrl}user/admin-action.php`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/x-www-form-urlencoded"
  //       },
  //       body: formData.toString(),
  //       credentials: "include"
  //     });

  //     toast.success("Gold price updated successfully!");

  //     setNewPrice("");

  //     fetchPrice();

  //   } catch (err) {

  //     toast.error("Something went wrong.");

  //   } finally {

  //     setLoading(false);

  //   }
  // };

const handleSubmit = async (e) => {

  e.preventDefault();

  if (!newPrice || Number(newPrice) <= 0) {
    toast.error("Invalid price entered.");
    return;
  }

  try {

    setLoading(true);

    const formData = new URLSearchParams();
    formData.append("set_price", "1");
    formData.append("gold_price", newPrice);

    await fetch(`${baseUrl}user/admin-action.php`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: formData.toString(),
      credentials: "include"
    });

    toast.success("Gold price updated successfully!");

    setNewPrice("");

    // price refresh
    setTimeout(() => {
      fetchPrice();
    }, 500);

  } catch (err) {

    console.error(err);
    toast.error("Something went wrong.");

  } finally {

    setLoading(false);

  }

};
  return (
    <>
      <div className="header-middle">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="token-title newFont">
                <h2 className="gradient-text">NRX Relationship Package</h2>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="markets-capital pt20 pb40">
        <div className="container">
          <div className="row justify-content-center" style={{ marginTop: "45px" }}>
            <div className="col-lg-6 col-md-6">
              <div className="farms-single-section gradient-border stakeBg">

                <div className="coin-desc">
                  <div className="coin-desc-left">
                    <img src={logo} alt="logo" />
                  </div>
                  <div className="coin-desc-right newFont">
                    <h4><b>Gold Price Setting</b></h4>
                  </div>
                </div>

                <div className="calculat">
                  <div className="calculat-left">
                    <h6>Current Price (USDT):</h6>
                  </div>
                  <div className="calculat-right">
                    <h6>{currentPrice.toFixed(2)}</h6>
                  </div>
                </div>

                <form onSubmit={handleSubmit}>

                  <label>Amount*</label>

                  <input
                    type="number"
                    className="form-control"
                    placeholder="Enter amount"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                  />

                  <div
                    className="unlocks"
                    style={{ textAlign: "center", marginTop: "15px" }}
                  >

                    <button
                      type="submit"
                      className="connect_btn mt-4"
                      disabled={loading}
                    >
                      {loading ? "Processing..." : "Set Price"}
                    </button>

                  </div>

                </form>

              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default GoldPriceSetting;