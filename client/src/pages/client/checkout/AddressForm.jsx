import React, { useState, useEffect } from "react";

// import Checkbox from "@mui/material/Checkbox";
// import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import Grid from "@mui/material/Grid";
import OutlinedInput from "@mui/material/OutlinedInput";
import { styled } from "@mui/system";

const FormGrid = styled(Grid)(() => ({
  display: "flex",
  flexDirection: "column",
}));

export default function AddressForm({ setFormData, formData, setError }) {
  const [formdata, setformdata] = useState({
    firstName: "",
    lastName: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pinCode: "",
    phoneNumber: "",
    alternatePhoneNumber: "",
    country: "",
  });

  const [formErrors, setFormErrors] = useState({
    firstName: "",
    lastName: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pinCode: "",
    phoneNumber: "",
    alternatePhoneNumber: "",
    country: "",
  });

  const {
    firstName,
    lastName,
    addressLine1,
    addressLine2,
    city,
    state,
    pinCode,
    phoneNumber,
    alternatePhoneNumber,
    country,
  } = formdata;

  useEffect(() => {
    setformdata(formData);
  }, [formData]);

  useEffect(() => {
    setError(formErrors);
  }, [setError, formErrors]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // Perform input validation and set error state accordingly
    if (name === "firstName" && value.length < 3) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        firstName: "firstName must be at least 3 characters long.",
      }));
    } else if (name === "lastName" && value.length < 0) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        lastName: "lastName must be at least 3 characters long.",
      }));
    } else if (name === "addressLine1" && value.length < 5) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        addressLine1: "Address must be at least 5 characters long.",
      }));
    } else if (name === "city" && value.length < 3) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        city: "City must be at least 3 characters long.",
      }));
    } else if (name === "state" && value.length < 3) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        state: "State must be at least 3 characters long.",
      }));
    } else if (name === "pinCode" && value.length !== 6) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        pinCode: "Pincode must be 6 characters long.",
      }));
    } else if (name === "phoneNumber" && value.length !== 10) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        phoneNumber: "Phone must be 10 characters long.",
      }));
    } else if (
      name === "alternatePhoneNumber" &&
      value.length > 0 &&
      value.length !== 10
    ) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        alternatePhoneNumber: "Phone must be 10 characters long.",
      }));
    } else if (name === "country" && value.length < 3) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        country: "Country must be 3 characters long.",
      }));
    } else {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        [name]: "",
      }));
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "ArrowUp" || event.key === "ArrowDown") {
      event.preventDefault();
    }
  };

  return (
    <Grid container spacing={3}>
      <FormGrid item xs={12} md={6}>
        <FormLabel htmlFor="first-name" required>
          First name
        </FormLabel>
        <OutlinedInput
          id="first-name"
          name="firstName"
          type="text"
          autoComplete="first name"
          value={firstName || ""}
          onChange={handleFormChange}
          error={true}
          required
        />
        {formErrors.firstName !== "" && (
          <p className="text-danger">{formErrors.firstName}</p>
        )}
      </FormGrid>
      <FormGrid item xs={12} md={6}>
        <FormLabel htmlFor="last-name" required>
          Last name
        </FormLabel>
        <OutlinedInput
          id="last-name"
          name="lastName"
          type="text"
          autoComplete="last name"
          value={lastName || ""}
          onChange={handleFormChange}
          required
        />
        {formErrors.lastName !== "" && (
          <p className="text-danger">{formErrors.lastName}</p>
        )}
      </FormGrid>
      <FormGrid item xs={6}>
        <FormLabel htmlFor="phoneNumber" required>
          Phone number
        </FormLabel>
        <OutlinedInput
          id="phoneNumber"
          name="phoneNumber"
          type="number"
          autoComplete="phoneNumber"
          className="no-spin-button"
          onKeyDown={handleKeyDown}
          value={phoneNumber || ""}
          onChange={handleFormChange}
          required
        />
        {formErrors.phoneNumber !== "" && (
          <p className="text-danger">{formErrors.phoneNumber}</p>
        )}
      </FormGrid>
      <FormGrid item xs={6}>
        <FormLabel htmlFor="alternatePhoneNumber">
          Alternate phone number (optional)
        </FormLabel>
        <OutlinedInput
          id="zialternatePhoneNumberp"
          name="alternatePhoneNumber"
          type="number"
          autoComplete="alternatePhoneNumber"
          onKeyDown={handleKeyDown}
          value={alternatePhoneNumber || ""}
          onChange={handleFormChange}
          className="no-spin-button"
        />
        {formErrors.alternatePhoneNumber !== "" && (
          <p className="text-danger">{formErrors.alternatePhoneNumber}</p>
        )}
      </FormGrid>

      <FormGrid item xs={12}>
        <FormLabel htmlFor="address1" required>
          Address line 1
        </FormLabel>
        <OutlinedInput
          id="address1"
          name="addressLine1"
          type="address1"
          value={addressLine1 || ""}
          onChange={handleFormChange}
          placeholder="Street name and number"
          autoComplete="shipping address-line1"
          required
        />
        {formErrors.addressLine1 !== "" && (
          <p className="text-danger">{formErrors.addressLine1}</p>
        )}
      </FormGrid>
      <FormGrid item xs={12}>
        <FormLabel htmlFor="address2">Address line 2</FormLabel>
        <OutlinedInput
          id="address2"
          name="addressLine2"
          type="address2"
          value={addressLine2 || ""}
          onChange={handleFormChange}
          placeholder="Apartment, suite, unit, etc. (optional)"
          autoComplete="shipping address-line2"
          required
        />
        {formErrors.addressLine2 !== "" && (
          <p className="text-danger">{formErrors.addressLine2}</p>
        )}
      </FormGrid>
      <FormGrid item xs={6}>
        <FormLabel htmlFor="city" required>
          City
        </FormLabel>
        <OutlinedInput
          id="city"
          name="city"
          type="city"
          value={city || ""}
          onChange={handleFormChange}
          autoComplete="City"
          required
        />
        {formErrors.city !== "" && (
          <p className="text-danger">{formErrors.city}</p>
        )}
      </FormGrid>
      <FormGrid item xs={6}>
        <FormLabel htmlFor="state" required>
          State
        </FormLabel>
        <OutlinedInput
          id="state"
          name="state"
          type="state"
          value={state || ""}
          autoComplete="State"
          onChange={handleFormChange}
          required
        />
        {formErrors.state !== "" && (
          <p className="text-danger">{formErrors.state}</p>
        )}
      </FormGrid>
      <FormGrid item xs={6}>
        <FormLabel htmlFor="zip" required>
          Zip / Postal code
        </FormLabel>
        <OutlinedInput
          id="zip"
          name="pinCode"
          type="number"
          value={pinCode || ""}
          autoComplete="shipping postal-code"
          className="no-spin-button"
          onKeyDown={handleKeyDown}
          onChange={handleFormChange}
          required
        />
        {formErrors.pinCode !== "" && (
          <p className="text-danger">{formErrors.pinCode}</p>
        )}
      </FormGrid>
      <FormGrid item xs={6}>
        <FormLabel htmlFor="country" required>
          Country
        </FormLabel>
        <OutlinedInput
          id="country"
          name="country"
          type="country"
          value={country || ""}
          onChange={handleFormChange}
          required
        />
        {formErrors.country !== "" && (
          <p className="text-danger">{formErrors.country}</p>
        )}
      </FormGrid>
      {/* <FormGrid item xs={12}>
        <FormControlLabel
          control={<Checkbox name="saveAddress" value="yes" />}
          label="Use this address for payment details"
        />
      </FormGrid> */}
    </Grid>
  );
}
