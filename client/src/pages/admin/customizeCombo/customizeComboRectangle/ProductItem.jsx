import React from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";

const ProductItem = ({ item, index, moveProductItem }) => {
  const [, drag] = useDrag({
    type: "PRODUCT_LIST_ITEM",
    item: { id: item._id, index },
  });

  const [, drop] = useDrop({
    accept: "PRODUCT_LIST_ITEM",
    hover: (draggedItem) => {
      if (draggedItem.id !== item._id) {
        moveProductItem(draggedItem.id, item._id);
        draggedItem.index = index;
      }
    },
  });

  return (
    <TableRow
      hover
      role="checkbox"
      tabIndex={-1}
      key={item?._id}
      ref={(node) => drag(drop(node))}
    >
      <TableCell>{index}</TableCell>
      <TableCell>{item?.ProductName}</TableCell>
    </TableRow>
  );
};

export default ProductItem;
