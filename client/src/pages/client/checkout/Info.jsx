import * as React from "react";
import PropTypes from "prop-types";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";

function Info({ totalPrice, products, productPrice }) {
  return (
    <React.Fragment>
      <Typography variant="subtitle2" color="text.secondary">
        Total
      </Typography>
      <Typography variant="h4" gutterBottom>
        {totalPrice}
      </Typography>
      <List disablePadding>
        {products &&
          products?.length > 0 &&
          products?.map((product) => (
            <ListItem key={product.name} sx={{ py: 1, px: 0 }}>
              <ListItemText
                sx={{ mr: 2 }}
                primary={product?.name}
                secondary={`Quantity ${product?.quantity}`}
              />
              <Typography variant="body1" fontWeight="medium">
                ₹{productPrice[product._id]}
              </Typography>
            </ListItem>
          ))}
      </List>
    </React.Fragment>
  );
}

Info.propTypes = {
  totalPrice: PropTypes.string.isRequired,
};

export default Info;
