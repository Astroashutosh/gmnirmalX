import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import logo from "/images/logo.png";

function GoldPriceSetting() {

  const [currentPrice, setCurrentPrice] = useState(0);
  const [newPrice, setNewPrice] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPrice();
  }, []);

  /* ===== GET PRICE (Same PHP GET) ===== */
  const fetchPrice = async () => {
    try {
      const res = await fetch("/user/admin-action.php");
      const data = await res.json();

      if (data.success) {
        setCurrentPrice(parseFloat(data.price));
      }
    } catch (err) {
      toast.error("Failed to fetch gold price.");
    }
  };

  /* ===== SET PRICE (Same PHP POST Form Submit) ===== */
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

      const res = await fetch("/user/admin-action.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: formData.toString(),
        credentials: "include" // 🔥 important for session
      });

      /* PHP redirects, so we just refresh price */
      toast.success("Gold price updated successfully!");

      setNewPrice("");
      fetchPrice();

    } catch (err) {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
<>

    <div class="header-middle">
    <div class="container">
        <div class="row">
            <div class="col-md-12">
                <div class="token-title newFont">
                    <h2 class="gradient-text">NRX Relationship Package</h2>
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
                  <img src={logo} />
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
                  type="text"
                  className="form-control"
                  placeholder="Enter amount"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                />

                <div
                  className="unlocks"
                  style={{ textAlign: "center", marginTop: "15px" }}
                >
                  <a
                    type="submit"
                    className="connect_btn mt-4"
                    disabled={loading}
                  >
                    {loading ? "Processing..." : "Set Price"}
                  </a>
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