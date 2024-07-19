import React from "react";

const index = () => {
  return (
    <>
      <div className="col-md-4">
        <label className="form-label" htmlFor="Shipping">
          Selling Type
        </label>
        <select
          id="FeaturedProducts"
          className="form-control"
          name="sellingtype"
          required
          onChange={handleFormChange}
        >
          <option value="">Choose Selling Type</option>
          <option value="Normal">Normal</option>
          <option value="Installment">Installment</option>
        </select>
      </div>

      <div className="col-md-4">
        <label className="form-label" htmlFor="Shipping">
          Instock Quantity
        </label>
        <input
          type="number"
          required
          className="form-control"
          id="Shipping"
          name="instockquantity"
          onChange={handleFormChange}
        />
      </div>

      <div className="col-md-4">
        <label className="form-label" htmlFor="Shipping">
          SKU
        </label>
        <input
          type="text"
          className="form-control"
          id="Shipping"
          name="sku"
          onChange={handleFormChange}
        />
      </div>
      <div className="col-md-4">
        <label className="form-label" htmlFor="Shipping">
          Barcode
        </label>
        <input
          type="text"
          className="form-control"
          id="Shipping"
          name="barcode"
          onChange={handleFormChange}
        />
      </div>

      <div className="col-md-4">
        <label className="form-label" htmlFor="Shipping">
          Instock Quantity
        </label>
        <input
          type="number"
          className="form-control"
          id="Shipping"
          value={ProductInStockQuantity}
          name="ProductInStockQuantity"
          onChange={handleFormChange}
        />
      </div>
    </>
  );
};

export default index;
