import React, { useState, useRef, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchCustomizedProduct } from "../../../../redux/slices/customizeProductSlice";
import { fetchCustomizedComboProductDetails } from "../../../../redux/slices/customizeComboSlice";
import { createCustomizedComboProductRectangle } from "../../../../redux/slices/customizeComboRectangleSlice";
import { REACT_APP_URL } from "../../../../config";
import TopHeader from "../../../../components/topheader/TopHeader";
import Preloader from "../../../../components/preloader/Preloader";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import ProductItem from "./ProductItem";

import {
  Card,
  CardContent,
  Grid,
  Checkbox,
  CardHeader,
  TextField,
  Divider,
  Box,
  Button,
} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableContainer from "@mui/material/TableContainer";
import { toastError } from "../../../../utils/reactToastify";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const AddCustomizeComboReactangle = () => {
  const canvasRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { productId } = useParams();

  const { loading: customizedComboRectangleLoading } = useSelector(
    (state) => state.customizeComboRectangle
  );

  const { loading: customizeProductLoading, customizedproducts } = useSelector(
    (state) => state.customizeProduct
  );

  const { loading: customizeComboLoading, customizedComboProductDetails } =
    useSelector((state) => state.customizeCombo);

  const [customizedProduct, setCustomizedProduct] = useState([]);
  const [name, setName] = useState("");
  const [customizedCombProduct, setCustomizedCombProduct] = useState({});
  const [selectedProduct, setSelectedProduct] = useState([]);
  const [rect, setRect] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });
  const [drawing, setDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState({ x: 0, y: 0 });
  const [imageDimensions, setImageDimensions] = useState({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    if (productId) {
      dispatch(fetchCustomizedProduct({}));
      dispatch(fetchCustomizedComboProductDetails(productId));
    }
  }, [dispatch, productId]);

  useEffect(() => {
    if (
      customizeProductLoading === "fulfilled" &&
      customizeComboLoading === "fulfilled"
    ) {
      setCustomizedProduct(customizedproducts);

      if (customizedComboProductDetails?.length > 0) {
        setCustomizedCombProduct(customizedComboProductDetails[0]);
      }
    }
  }, [
    customizeProductLoading,
    customizeComboLoading,
    customizedComboProductDetails,
    customizedproducts,
  ]);

  useEffect(() => {
    if (customizedCombProduct?.image) {
      const img = new Image();
      img.src = `${REACT_APP_URL}/images/product/${customizedCombProduct?.image}`;
      img.onload = () => {
        const aspectRatio = img.width / img.height;
        const canvasHeight = Math.min(window.innerHeight - 50, img.height);
        const canvasWidth = canvasHeight * aspectRatio;
        setImageDimensions({ width: canvasWidth, height: canvasHeight });
      };
    }
  }, [customizedCombProduct?.image]);

  const handleMouseDown = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setDrawing(true);
    setStartPoint({ x, y });
  };

  const handleMouseMove = (e) => {
    if (!drawing) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setRect({
      x: Math.min(startPoint.x, x),
      y: Math.min(startPoint.y, y),
      width: Math.abs(x - startPoint.x),
      height: Math.abs(y - startPoint.y),
    });
  };

  const handleMouseUp = () => {
    setDrawing(false);
  };

  const drawDottedRectangle = (context, x, y, width, height) => {
    context.setLineDash([10, 5]);
    context.strokeStyle = "blue";
    context.lineWidth = 2;
    context.strokeRect(
      x * context.canvas.width,
      y * context.canvas.height,
      width * context.canvas.width,
      height * context.canvas.height
    );
    context.setLineDash([]);
  };

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawDottedRectangle(context, rect.x, rect.y, rect.width, rect.height);
  }, [rect]);

  React.useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  const moveProductItem = (fromId, toId) => {
    const fromIndex = selectedProduct.findIndex((item) => item._id === fromId);
    const toIndex = selectedProduct.findIndex((item) => item._id === toId);

    if (fromIndex === -1 || toIndex === -1) {
      return;
    }
    const updatedList = [...selectedProduct];
    const [item] = updatedList.splice(fromIndex, 1);
    updatedList.splice(toIndex, 0, item);
    setSelectedProduct(updatedList);
  };

  const getId = (arr) => {
    if (arr.length > 0) {
      return arr.map((item) => item?._id);
    } else {
      return [];
    }
  };

  const handleSave = () => {
    if (selectedProduct?.length === 0) {
      return toastError("Please select at least one product!");
    }

    if (name === "") {
      return toastError("Name is required!");
    }

    if (rect.x === 0 || rect.y === 0) {
      return toastError("Please mark area!");
    }

    const { x, y, height, width } = rect;

    const formData = {
      name,
      customizedComboId: productId,
      top: x.toFixed(5),
      left: y.toFixed(5),
      height: height.toFixed(5),
      width: width.toFixed(5),
      addOnProduct: getId(selectedProduct),
    };

    dispatch(createCustomizedComboProductRectangle(formData));

    if (customizedComboRectangleLoading === "fulfilled") {
      navigate(`/admin/customized-combo-product/rectangle/${productId}`);
    }
  };

  if (
    customizeProductLoading === "pending" ||
    customizeComboLoading === "pending"
  ) {
    return <Preloader />;
  }

  return (
    <section>
      <TopHeader />
      <Card style={{ marginTop: "60px" }}>
        <CardContent>
          <div
            style={{
              display: "flex",
              gap: "20px",
            }}
          >
            <Grid item xs={12} sm={8} md={6}>
              <canvas
                ref={canvasRef}
                width={imageDimensions.width}
                height={imageDimensions.height}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                style={{
                  backgroundImage: `url(${REACT_APP_URL}/images/product/${customizedCombProduct?.image})`,
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "contain",
                }}
              />
              {/* <div>
              <p
                style={{ fontWeight: "700", fontSize: "20px", color: "black" }}
              >
                X: {Math.round(rect.x * 100)}%, Y: {Math.round(rect.y * 100)}%
              </p>
              <p
                style={{ fontWeight: "700", fontSize: "20px", color: "black" }}
              >
                Width: {Math.round(rect.width * 100)}%, Height:{" "}
                {Math.round(rect.height * 100)}%
              </p>
            </div> */}
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              <TextField
                id="outlined-basic"
                label="Name"
                variant="outlined"
                required
                value={name || ""}
                onChange={(e) => setName(e.target.value)}
                style={{ width: "100%" }}
              />

              <Autocomplete
                multiple
                id="checkboxes-tags-demo"
                options={customizedProduct || []}
                disableCloseOnSelect
                value={selectedProduct || []}
                getOptionLabel={(option) => option?.ProductName}
                isOptionEqualToValue={(option, value) =>
                  option?._id === value?._id
                }
                renderOption={(props, option, { selected }) => (
                  <li {...props}>
                    <Checkbox
                      icon={icon}
                      checkedIcon={checkedIcon}
                      style={{ marginRight: 8 }}
                      checked={selected}
                    />
                    {option?.ProductName}
                  </li>
                )}
                style={{ width: "100%", marginTop: "10px" }}
                onChange={(event, value) => setSelectedProduct(value)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select Products"
                    placeholder="Products"
                  />
                )}
              />

              {/* Product Table Start */}

              <Card style={{ width: "100%", marginTop: "20px" }}>
                <CardHeader
                  title="Selected Product Table"
                  subheader="First product is considered as a default product"
                  // className={styles.customCardHeader}
                  //   classes={{
                  //     subheader: styles.customSubheader,
                  //     title: styles.customTitle,
                  //   }}
                />
                <Divider />
                <CardContent>
                  <TableContainer>
                    <Table stickyHeader aria-label="sticky table">
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ fontWeight: "bold" }}>#</TableCell>
                          <TableCell sx={{ fontWeight: "bold" }}>
                            Product
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <DndProvider backend={HTML5Backend}>
                          {selectedProduct && selectedProduct?.length > 0 ? (
                            selectedProduct.map((p, index) => (
                              <ProductItem
                                item={p}
                                key={index}
                                index={index + 1}
                                moveProductItem={moveProductItem}
                              />
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={2} align="center">
                                No Product Selected!
                              </TableCell>
                            </TableRow>
                          )}
                        </DndProvider>
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <Box display="flex" justifyContent="flex-end" p={2}>
                    <Button
                      type="submit"
                      variant="contained"
                      onClick={handleSave}
                    >
                      Save
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default AddCustomizeComboReactangle;
