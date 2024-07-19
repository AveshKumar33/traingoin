const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
const { handleError } = require("../utils/handleError");
const {
  getCustomizeProduct,
  roundNumber,
  formateAmount,
  numberToWords,
  getPercentage,
} = require("./getCustomizeProduct");

const { getSingleProduct } = require("./getSIngleProduct");

const { text, accountDetails, terms } = require("./data");

function getFormattedDate() {
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const formatter = new Intl.DateTimeFormat("en-US", options);
  const currentDate = new Date();

  return formatter.format(currentDate);
}

const firstImagePath = path.join(
  __dirname,
  "..",
  "images/quotation/white-logo-with-name.png"
);

const secondImagePath = path.join(
  __dirname,
  "..",
  "images/quotation/black-logo-with-name.png"
);

const lastPageImagePath = path.join(
  __dirname,
  "..",
  "images/quotation/white-logo-with-name.png"
);

const InterLightFont = path.join(__dirname, "./font/static/Inter-Light.ttf");

const InterRegularFont = path.join(
  __dirname,
  "./font/static/Inter-Regular.ttf"
);

const InterRegularMedium = path.join(
  __dirname,
  "./font/static/Inter-Medium.ttf"
);

const QrCodePath = path.join(__dirname, "..", "images/quotation/QR-Code.png");

const frontOverlay = path.join(
  __dirname,
  "..",
  "images/quotation/FrontOverlay.png"
);
const backOverlay = path.join(
  __dirname,
  "..",
  "images/quotation/BackOverlay.png"
);

function roundedRect(doc, x, y, width, height, radius) {
  doc
    .moveTo(x + radius, y) // Move to the starting point (top-left corner + radius)
    .lineTo(x + width - radius, y) // Draw the top edge
    .quadraticCurveTo(x + width, y, x + width, y + radius) // Top-right corner
    .lineTo(x + width, y + height - radius) // Draw the right edge
    .quadraticCurveTo(x + width, y + height, x + width - radius, y + height) // Bottom-right corner
    .lineTo(x + radius, y + height) // Draw the bottom edge
    .quadraticCurveTo(x, y + height, x, y + height - radius) // Bottom-left corner
    .lineTo(x, y + radius) // Draw the left edge
    .quadraticCurveTo(x, y, x + radius, y) // Top-left corner
    .closePath() // Close the path
    .stroke(); // Stroke the path
}

const textWithBorder = (
  doc,
  startX,
  startY,
  width,
  height,
  font,
  text,
  fontSize = 12,
  radius = 10
) => {
  roundedRect(doc, startX, startY, width, height, radius);

  doc
    .fontSize(fontSize)
    .fillColor("#324A42")
    .font(font)
    .text(text, startX, startY + 5, {
      width: width,
      align: "center",
    });
};

const rectWithHeaderText = (
  doc,
  startX,
  startY,
  width,
  height,
  font,
  text,
  fontSize = 12
) => {
  doc
    .rect(startX, startY, width, height, font)
    .lineWidth(1)
    .fill("#324A42")
    .stroke();

  const textY = startY + 4;

  doc.fontSize(fontSize).fillColor("#ffffff").font(font).text(text, 0, textY, {
    width: doc.page.width,
    align: "center",
  });
};

function drawCell(
  doc,
  text,
  x,
  y,
  width,
  cellHeight,
  textAlign,
  fortWeight,
  fontColor = "#000"
) {
  doc.font(fortWeight).fillColor(fontColor).text(text, x, y, {
    width,
    height: cellHeight,
    align: textAlign,
    lineGap: 2,
  });
}

function drawImageCell(doc, path, x, y, width, height) {
  doc.image(path, x + width / 2 - 20, y, {
    width: 35,
    height: 35,
  });
}

const getTextHeight = (doc, text, options) => {
  const lines = doc.heightOfString(text, options) / doc.currentLineHeight();
  return lines * doc.currentLineHeight();
};

const rectWithText = (
  doc,
  startX,
  startY,
  width,
  height,
  fontSize,
  text,
  textAlign = "left",
  backgroundColor = "#324A42",
  textColor = "#ffffff",
  font = "InterMedium",
  borderWidth = 1
) => {
  doc.font(font).fontSize(fontSize);

  const textHeight = getTextHeight(doc, text, { width: width - 10 });

  let adjustedHeight = Math.max(height, textHeight + 10);

  adjustedHeight = height > adjustedHeight ? height : adjustedHeight;

  doc
    .rect(startX, startY, width, adjustedHeight)
    .lineWidth(borderWidth)
    .fill(backgroundColor)
    // .lineWidth(0)
    // .fillAndStroke(backgroundColor)
    .stroke();

  // Add the text, ensuring it wraps within the specified width
  doc
    .fontSize(fontSize)
    .fillColor(textColor)
    .font(font)
    .text(text, startX + 5, startY + 5, {
      width: width - 10, // Subtract padding to prevent overflow
      align: textAlign, // Text alignment
    });
};

const borderWithText = (
  doc,
  startX,
  startY,
  width,
  height,
  text,
  textAlign = "left",
  font,
  textColor,
  borderColor = "#e0e0e0"
) => {
  doc
    .rect(startX, startY, width, height, font)
    .lineWidth(1)
    .strokeColor(borderColor)
    .stroke();

  const textX = startX + 5;
  const textY = startY + 5;

  doc
    .fontSize(10)
    .fillColor(textColor)
    .font(font)
    .text(text, textX, textY, {
      width: width - 10,
      align: textAlign,
    });
};

const generateCombinations = (
  doc,
  padding,
  y,
  combinations,
  imageWidth,
  imageHeight = 400,
  combinationFor = "front"
) => {
  for (let combination of combinations) {
    doc.image(
      path.join(
        __dirname,
        `../images/parameterPosition/${combination?.pngImage}`
      ),
      padding,
      y,
      {
        width: imageWidth - 40,
        height: imageHeight,
      }
    );
  }

  if (combinationFor === "front") {
    doc.image(frontOverlay, padding, y, {
      width: imageWidth - 40,
      height: imageHeight,
    });
  } else if (combinationFor === "back") {
    doc.image(backOverlay, padding, y, {
      width: imageWidth - 40,
      height: imageHeight,
    });
  }
};

const generateQuotationPDF = async (req, res, next) => {
  try {
    const doc = new PDFDocument({
      size: "A4",
      margin: 0,
    });

    doc.page.size = "A4";
    const padding = 20;
    doc.page.margins = { top: 20, bottom: 0, left: 20, right: 20 };

    // console.log("fontPath", fontPath);
    doc.registerFont("InterLight", InterLightFont);
    doc.registerFont("InterRegular", InterRegularFont);
    doc.registerFont("InterMedium", InterRegularMedium);

    doc.font("InterRegular");

    const writeStream = fs.createWriteStream("Quotation.pdf");
    doc.pipe(writeStream);

    const buffers = [];

    doc.on("data", buffers.push.bind(buffers));

    doc.on("end", () => {
      const pdfData = Buffer.concat(buffers);
      res.end(pdfData);
    });

    const pageHeight = doc.page.height;
    const pageWidth = doc.page.width;
    const width = doc.page.width - 40;
    const fontSize = 12;

    doc.rect(0, 0, pageWidth, pageHeight).fill("#324A42");

    const imageWidth = 265;
    const imageHeight = 100;

    // ---------------------------------------- fetching data with functuions ---------------------------------

    const productType = req.params.productType;
    let architectDetails = null;
    let clientDetails;
    let product;
    let frontCombination = [];
    let backCombination = [];
    let totalBasePrice = 0;
    let unit;
    let productHeight;
    let productWidth;
    let singleProductCombination = null;
    let balance = 0;
    let installnationCharge = 0;
    let Wastage = 0;

    if (productType === "customizeProduct") {
      let data = await getCustomizeProduct(req, res, next);
      clientDetails = data.clientDetails;
      product = data.product;
      frontCombination = data.frontCombination;
      backCombination = data.backCombination;
      totalBasePrice = data.totalBasePrice;
      unit = data.unit;
      productHeight = data.productHeight;
      productWidth = data.productWidth;

      if (data?.architectDetails) {
        architectDetails = data?.architectDetails;
      }

      balance =
        ((product?.installnationCharge + product?.Wastage + totalBasePrice) *
          product?.GSTIN ?? 0) / 100;

      installnationCharge = product?.installnationCharge;
      Wastage = product?.Wastage;
    } else if (productType === "singleProduct") {
      let response = await getSingleProduct(req, res, next);

      singleProductCombination = response?.combinations;
      product = response?.product;
      clientDetails = response?.clientDetails;
      architectDetails = response.architectDetails;
      totalBasePrice = response.totalBasePrice;

      balance = (totalBasePrice * product?.GSTIN ?? 0) / 100;
    }

    const GSTAmount = Math.round(balance);
    const discount = (totalBasePrice * clientDetails?.discount ?? 0) / 100;

    const netAmount =
      totalBasePrice - discount + GSTAmount + installnationCharge + Wastage;

    // ---------------------------------------- first page start ------------------------------------------------
    let x = (pageWidth - imageWidth) / 2; // Calculate horizontal position
    let y = (pageHeight - imageHeight) / 2; // Calculate vertical position

    doc.image(firstImagePath, x, y, { width: imageWidth, height: imageHeight });

    const textY = y + 300;

    doc.fontSize(fontSize).fillColor("#ffffff").text(text, padding, textY, {
      width: width,
      align: "justify",
      lineGap: 3,
    });

    //----------------------------------------------- second page start ---------------------------------------
    doc.addPage();

    doc.lineWidth(1).strokeColor("#324A42");

    const secondImageHeight = 80;
    const secondImageWidth = 200;
    x = (pageWidth - secondImageWidth) / 2;

    doc.image(secondImagePath, x, padding - 10, {
      width: secondImageWidth,
      height: secondImageHeight,
    });

    y = secondImageHeight + 10;

    rectWithHeaderText(
      doc,
      padding,
      y,
      width,
      22,
      "InterMedium",
      "Quotation",
      fontSize
    );

    y += 24;

    x = pageHeight - 453;

    const currentDate = getFormattedDate();

    rectWithText(doc, x, y, 187, 22, fontSize, `Date: ${currentDate}`);

    y += 23;

    textWithBorder(
      doc,
      padding,
      y,
      120,
      20,
      "Helvetica-Bold",
      "Company Details",
      11,
      5
    );

    y += 23;

    let tableData = [
      ["Compmany Name", "Railingo Pvt. Ltd", "Quotation No", "78GH56R"],
      ["Contact", "9548335296", "Person Name", "Mr. Akash Goyal"],
      ["Email", "railingocom@gmail.com"],
      ["GST Details", "09AALCR3859E1ZZ"],
      ["Website", "https://railingo.com"],
    ];

    let cellHeight = 20;
    // let rowsPerPage = Math.floor(pageHeight / cellHeight);
    let lastPageTableHeight = 0;
    let currentPage = 0;

    function CreateTable(
      tableData,
      pageWidth,
      tableX = 20,
      tableY = 5,
      cellMargin = 20,
      fontSize = 10
    ) {
      let tableYHeight = tableY;
      const columnWidths = [17, 41, 15, 27]; // Define your column widths here
      const totalWidth = pageWidth - 1.5 * tableX;
      const totalPercentage = columnWidths.reduce(
        (sum, width) => sum + width,
        0
      );
      const columnWidthFactors = columnWidths.map(
        (width) => (width / totalPercentage) * totalWidth
      );
      let currentRow = 0;

      doc.fontSize(fontSize);

      while (currentRow < tableData.length) {
        if (tableYHeight + cellHeight > pageHeight - 20) {
          doc.addPage();
          lastPageTableHeight = 0;
          tableY = 15;
          tableYHeight = 10;
          currentPage++;
        }
        lastPageTableHeight += cellHeight;
        const rowData = tableData[currentRow];
        const cellY = tableYHeight;

        for (let j = 0; j < rowData.length; j++) {
          const cellText = rowData[j];
          const cellX =
            tableX +
            columnWidthFactors
              .slice(0, j)
              .reduce((sum, width) => sum + width, 0);

          if ((currentRow >= 0 && j === 0) || (currentRow >= 0 && j === 2)) {
            doc
              .rect(cellX - 0.1, cellY, columnWidthFactors[j], cellHeight)
              .fillColor("#324A42")
              .fill();

            doc
              .rect(cellX - 0.1, cellY, columnWidthFactors[j], cellHeight)
              .lineWidth(1)
              .strokeColor("#ffffff")
              .stroke();

            drawCell(
              doc,
              cellText,
              cellX + 5,
              cellY + 4,
              columnWidthFactors[j] - 10,
              cellHeight,
              "left",
              "InterMedium",
              "#ffffff"
            );
          } else {
            doc
              .rect(cellX - 0.1, cellY, columnWidthFactors[j], cellHeight)
              .fillColor("#e0e0e0")
              .fill();

            doc
              .rect(cellX - 0.1, cellY, columnWidthFactors[j], cellHeight)
              .lineWidth(1)
              .strokeColor("#ffffff")
              .stroke();

            drawCell(
              doc,
              cellText,
              cellX + 7,
              cellY + 5,
              columnWidthFactors[j] - 10,
              cellHeight,
              "left",
              "InterMedium",
              "#324A42"
            );
          }
        }
        tableYHeight += cellHeight;
        currentRow++;
      }
    }

    CreateTable(tableData, pageWidth - 10, padding, y);

    y += lastPageTableHeight + 5;

    doc.strokeColor("#324A42").stroke();

    textWithBorder(
      doc,
      padding,
      y,
      120,
      20,
      "Helvetica-Bold",
      "Client Details",
      11,
      5
    );

    textWithBorder(
      doc,
      pageWidth / 2 + 45,
      y,
      120,
      20,
      "Helvetica-Bold",
      "Architect Details",
      11,
      5
    );

    y += 25;

    rectWithText(doc, padding, y, 94, 20, 10, "Client Code");

    x = 115;
    rectWithText(doc, x, y, 52, 20, 10, "679", "left", "#e0e0e0", "#324A42");

    x = 168;
    rectWithText(doc, x, y, 67, 20, 10, "GST Details");

    x = 236;
    rectWithText(
      doc,
      x,
      y,
      105,
      20,
      10,
      clientDetails?.gstNo,
      "left",
      "#e0e0e0",
      "#324A42"
    );

    x = 342;
    rectWithText(doc, x, y, 82, 20, 10, "Arch. Name");

    x = 425;
    rectWithText(
      doc,
      x,
      y,
      149,
      20,
      10,
      architectDetails ? architectDetails?.Name : "",
      "left",
      "#e0e0e0",
      "#324A42"
    );

    y += 21;

    tableData = [
      [
        "Client Name",
        clientDetails?.Name,
        "Firm Name",
        architectDetails?.firmName ? architectDetails?.firmName : "",
      ],
      [
        "Contact",
        clientDetails?.MobNumber,
        "Contact",
        architectDetails?.MobNumber ? architectDetails?.MobNumber : "",
      ],
      [
        "Address",
        clientDetails?.Address,
        "Address",
        architectDetails ? architectDetails?.Address : "",
      ],
      [
        "Email",
        clientDetails?.Email,
        "Email",
        architectDetails?.Email ? architectDetails?.Email : "",
      ],
    ];

    CreateTable(tableData, pageWidth - 10, padding, y);

    // Calculate the height required for the text
    const textHeight = getTextHeight(doc, product?.ProductName, { width: 165 });

    const lineHeight = Math.max(20, textHeight + 10);

    y += lastPageTableHeight - 80;

    doc
      .moveTo(padding, y + lineHeight + 35)
      .lineTo(padding, y)
      .strokeColor("#e0e0e0")
      .stroke(1);

    if (productType === "customizeProduct") {
      rectWithText(doc, padding + 0.5, y, 165, 35, 10, "Description");

      rectWithText(
        doc,
        padding + 0.5,
        y + 35,
        165,
        20,
        10,
        product?.ProductName,
        "left",
        "#ffffff",
        "#324A42"
      );

      doc
        .moveTo(185, y + lineHeight + 35)
        .lineTo(185, y)
        .strokeColor("#e0e0e0")
        .stroke(1);

      x = 166 + padding;

      rectWithText(
        doc,
        x,
        y,
        72,
        35,
        10,
        `    Length
  (In ft.)`,
        "center"
      );

      const length =
        unit === "Length" ? productWidth : unit === "Sq.ft" ? productWidth : "";

      rectWithText(
        doc,
        x,
        y + 35,
        72,
        y + lineHeight,
        10,
        length,
        "left",
        "#ffffff",
        "#dc3545"
      );

      doc
        .moveTo(x + 72, y + lineHeight + 35)
        .lineTo(x + 72, y)
        .strokeColor("#e0e0e0")
        .stroke(1);

      x += 72.5;

      const runningFeet =
        unit === "Rft" ? productHeight : unit === "Sq.ft" ? productHeight : "";
      rectWithText(
        doc,
        x,
        y,
        73,
        35,
        10,
        `  Breatdth 
   (In ft.)`
      );
      rectWithText(
        doc,
        x,
        y + 35,
        73,
        40,
        10,
        runningFeet,
        "left",
        "#ffffff",
        "#dc3545"
      );

      doc
        .moveTo(x + 73, y + lineHeight + 35)
        .lineTo(x + 73, y)
        .strokeColor("#e0e0e0")
        .stroke(1);

      x += 73.5;
      rectWithText(
        doc,
        x,
        y,
        73.4,
        35,
        10,
        ` Total Area
   (In ${unit})`
      );

      const totalArea =
        productWidth && productHeight
          ? productWidth * productHeight
          : productWidth
          ? productWidth
          : productHeight
          ? productHeight
          : 0;

      rectWithText(
        doc,
        x,
        y + 35,
        73.4,
        20,
        10,
        totalArea,
        "left",
        "#ffffff",
        "#dc3545"
      );

      doc
        .moveTo(x + 73.4, y + lineHeight + 35)
        .lineTo(x + 73.4, y)
        .strokeColor("#e0e0e0")
        .stroke(1);

      x += 74;

      rectWithText(
        doc,
        x,
        y,
        70,
        35,
        10,
        `       Rate
   (In / ${unit})`
      );

      const rate = formateAmount(
        roundNumber(
          Number(
            productWidth && productHeight
              ? totalBasePrice / (productWidth * productHeight)
              : productWidth
              ? totalBasePrice / productWidth
              : productHeight
              ? totalBasePrice / productHeight
              : 0
          )
        )
      );

      rectWithText(
        doc,
        x,
        y + 35,
        70,
        20,
        10,
        rate,
        "left",
        "#ffffff",
        "#dc3545"
      );
    }

    if (productType === "singleProduct") {
      x = 166 + padding + 72 + 73.5 + 74;

      rectWithText(doc, padding, y, x + 50, 35, 10, "Description");
      rectWithText(
        doc,
        padding,
        y + 35,
        x + 50,
        20,
        10,
        product?.ProductName,
        "left",
        "#ffffff",
        "#324A42"
      );
    }

    doc
      .moveTo(x + 70, y + lineHeight + 35)
      .lineTo(x + 70, y)
      .strokeColor("#e0e0e0")
      .stroke(1);

    x += 70.5;

    rectWithText(doc, x, y, 99, 35, 10, "Amount", "right");

    const amount = formateAmount(totalBasePrice);
    rectWithText(
      doc,
      x,
      y + 35,
      99,
      20,
      10,
      amount,
      "right",
      "#ffffff",
      "#dc3545"
    );

    doc
      .moveTo(x + 99, y + lineHeight + 35)
      .lineTo(x + 99, y)
      .strokeColor("#e0e0e0")
      .stroke(1);

    doc
      .moveTo(padding, y + lineHeight + 35)
      .lineTo(pageWidth - padding, y + lineHeight + 35)
      .strokeColor("#e0e0e0")
      .stroke(1);

    y += lineHeight + 35;
    const rectWidth = 456;

    borderWithText(
      doc,
      padding,
      y,
      rectWidth,
      20,
      "Sub Total",
      "right",
      "InterMedium",
      "#324A42",
      "#e0e0e0"
    );

    borderWithText(
      doc,
      rectWidth + padding,
      y,
      99.5,
      20,
      amount,
      "right",
      "InterMedium",
      "#324A42",
      "#e0e0e0"
    );

    if (clientDetails?.discount && clientDetails?.discount !== 0) {
      y += 20;

      borderWithText(
        doc,
        padding,
        y,
        rectWidth,
        20,
        `DIscount (${clientDetails?.discount})%`,
        "right",
        "InterMedium",
        "#324A42",
        "#e0e0e0"
      );

      const discountAmount = formateAmount(discount || 0);

      borderWithText(
        doc,
        rectWidth + padding,
        y,
        99.5,
        20,
        discountAmount,
        "right",
        "InterMedium",
        "#324A42",
        "#e0e0e0"
      );

      y += 20;

      borderWithText(
        doc,
        padding,
        y,
        rectWidth,
        20,
        "Gross Total",
        "right",
        "InterMedium",
        "#324A42",
        "#e0e0e0"
      );

      const grossTotal = formateAmount(totalBasePrice - discount);

      borderWithText(
        doc,
        rectWidth + padding,
        y,
        99.5,
        20,
        grossTotal,
        "right",
        "InterMedium",
        "#324A42",
        "#e0e0e0"
      );
    }

    y += 20;

    borderWithText(
      doc,
      padding,
      y,
      rectWidth,
      20,
      "Installation Charge",
      "right",
      "InterMedium",
      "#324A42",
      "#e0e0e0"
    );

    borderWithText(
      doc,
      rectWidth + padding,
      y,
      99.5,
      20,
      formateAmount(installnationCharge),
      "right",
      "InterMedium",
      "#324A42",
      "#e0e0e0"
    );

    if (Wastage && Wastage !== 0) {
      y += 20;
      borderWithText(
        doc,
        padding,
        y,
        rectWidth,
        20,
        "Westage",
        "right",
        "InterMedium",
        "#324A42",
        "#e0e0e0"
      );

      borderWithText(
        doc,
        rectWidth + padding,
        y,
        99.5,
        20,
        formateAmount(Wastage || 0),
        "right",
        "InterMedium",
        "#324A42",
        "#e0e0e0"
      );
    }

    y += 20;

    borderWithText(
      doc,
      padding,
      y,
      rectWidth,
      20,
      `GST (${product?.GSTIN})%`,
      "right",
      "InterMedium",
      "#324A42",
      "#e0e0e0"
    );

    borderWithText(
      doc,
      rectWidth + padding,
      y,
      99.5,
      20,
      formateAmount(GSTAmount),
      "right",
      "InterMedium",
      "#324A42",
      "#e0e0e0"
    );
    y += 20;

    borderWithText(
      doc,
      padding,
      y,
      rectWidth,
      20,
      "Net Amount",
      "right",
      "InterMedium",
      "#324A42",
      "#e0e0e0"
    );

    borderWithText(
      doc,
      rectWidth + padding,
      y,
      99.5,
      20,
      formateAmount(netAmount),
      "right",
      "InterMedium",
      "#324A42",
      "#e0e0e0"
    );
    y += 20;

    borderWithText(
      doc,
      padding,
      y,
      rectWidth,
      20,
      "Transportation Charge",
      "right",
      "InterMedium",
      "#324A42",
      "#e0e0e0"
    );

    borderWithText(
      doc,
      rectWidth + padding,
      y,
      99.5,
      20,
      "As Per Actual",
      "right",
      "InterMedium",
      "#324A42",
      "#e0e0e0"
    );

    y += 30;

    doc
      .fontSize(10)
      .fillColor("#324A42")
      .font("InterRegular")
      .text("Amount in Words", padding, y, 90, 20);

    doc.font("InterMedium").fontSize(10);

    // Calculate the width of the string
    const stringWidth = doc.widthOfString(numberToWords(netAmount));

    doc.fillColor("#dc3545").text(numberToWords(netAmount), padding + 90, y);

    y += 2 + doc.currentLineHeight();

    doc
      .moveTo(padding + 90, y) // Move to the bottom of the text
      .lineTo(padding + 90 + stringWidth, y) // Draw a line with the string width
      .strokeColor("#324A42")
      .stroke();

    y += 20;

    textWithBorder(
      doc,
      pageWidth / 2 - 60,
      y,
      120,
      20,
      "Helvetica-Bold",
      "Payment Schedule",
      11,
      5
    );

    y += 30;

    function CreateInstallementTable(
      tableData,
      pageWidth,
      tableX = 20,
      tableY = 5,
      cellMargin = 20,
      fontSize = 10
    ) {
      let tableYHeight = tableY;
      const numberOfColumns = tableData[0].length; // Dynamically calculate number of columns
      const totalWidth = pageWidth - 1.5 * tableX;
      const columnWidth = totalWidth / numberOfColumns; // Calculate uniform column width
      let currentRow = 0;

      doc.fontSize(fontSize);

      while (currentRow < tableData.length) {
        if (tableYHeight + cellHeight > pageHeight - 20) {
          doc.addPage();
          lastPageTableHeight = 0;
          tableY = 15;
          tableYHeight = 10;
          currentPage++;
        }
        lastPageTableHeight += cellHeight;
        const rowData = tableData[currentRow];
        const cellY = tableYHeight;

        for (let j = 0; j < rowData.length; j++) {
          const cellText = rowData[j];
          const cellX = tableX + columnWidth * j;

          if (currentRow === 0 && j >= 0) {
            doc
              .rect(cellX - 0.1, cellY, columnWidth, cellHeight)
              .fillColor("#324A42")
              .fill();

            doc
              .rect(cellX - 0.1, cellY, columnWidth, cellHeight)
              .lineWidth(1)
              .strokeColor("#ffffff")
              .stroke();

            drawCell(
              doc,
              cellText,
              cellX + 5,
              cellY + 4,
              columnWidth - 10,
              cellHeight,
              "center",
              "InterRegular",
              "#ffffff"
            );
          } else {
            doc
              .rect(cellX - 0.1, cellY, columnWidth, cellHeight)
              .fillColor("#e0e0e0")
              .fill();

            doc
              .rect(cellX - 0.1, cellY, columnWidth, cellHeight)
              .lineWidth(1)
              .strokeColor("#ffffff")
              .stroke();

            drawCell(
              doc,
              cellText,
              cellX + 7,
              cellY + 5,
              columnWidth - 10,
              cellHeight,
              "center",
              "InterRegular",
              "#324A42"
            );
          }
        }
        tableYHeight += cellHeight;
        currentRow++;
      }
    }

    // Example data creation
    const clientName = clientDetails?.Name;
    const columnName = ["Payment From"];
    const rows = [clientName];

    if (product) {
      for (let installment of product?.Installment) {
        columnName.push(`${installment?.Name} (${installment?.Amount}%)`);
        const installementAmoubt = formateAmount(
          getPercentage(netAmount, installment?.Amount)
        );
        rows.push(installementAmoubt);
      }
    }

    const installementData = [columnName, rows];

    // Call the function with dynamic columns
    CreateInstallementTable(installementData, pageWidth - 10, padding, y);

    // -------------------------------------- Product Image Page ---------------------------------------
    doc.addPage();

    const thirdImageHeight = 80;
    const thirdImageWidth = 200;

    x = (pageWidth - thirdImageWidth) / 2;

    doc.image(secondImagePath, x, padding - 10, {
      width: thirdImageWidth,
      height: thirdImageHeight,
    });

    y = padding + 70;

    const productName = `Product Name : ${product?.ProductName}`;

    const productNameWidth = doc.widthOfString(productName);

    const rectangleX = (pageWidth - productNameWidth) / 2;

    rectWithText(
      doc,
      rectangleX - 10,
      y,
      productNameWidth + padding,
      20,
      10,
      productName,
      "left",
      "#324A42",
      "#ffffff",
      "InterMedium"
    );

    y += 27;

    rectWithHeaderText(
      doc,
      padding,
      y,
      width,
      22,
      "InterMedium",
      `Reference image prepared for Mrs. ${clientDetails?.Name}`,
      fontSize
    );

    y += 27;

    // generating front combinations

    if (productType === "customizeProduct") {
      generateCombinations(
        doc,
        padding,
        y,
        frontCombination,
        pageWidth,
        400,
        "front"
      );
      y += 401;
    }

    if (productType === "singleProduct" && singleProductCombination) {
      const singleProductPath = path.join(
        __dirname,
        "..",
        `images/product/${singleProductCombination.image}`
      );

      doc.image(singleProductPath, padding, y, {
        width: pageWidth - 40,
        height: 400,
      });

      y += 401;
    }

    doc
      .fontSize(10)
      .fillColor("#324A42")
      .font("InterRegular")
      .text(
        "This Design is just for reference, it will vary on site as per your section os Shatd, Material & Concept.",
        padding,
        y,
        pageWidth,
        20
      );

    y += 20;

    rectWithText(
      doc,
      padding,
      y,
      pageWidth - padding,
      20,
      12,
      "Selected Articles",
      "center",
      "#ffffff",
      "#324A42",
      "InterMedium"
    );

    y += 25;

    rectWithText(
      doc,
      padding - 1,
      y,
      pageWidth / 3 + padding + 5,
      25,
      10,
      "Available Customization",
      "center",
      "#324A42",
      "#ffffff",
      "InterMedium"
    );

    x = pageWidth / 3 + padding + 5;
    rectWithText(
      doc,
      x,
      y,
      pageWidth / 3 + padding + 23,
      25,
      10,
      "Current Selection",
      "center",
      "#324A42",
      "#ffffff",
      "InterMedium"
    );

    x += pageWidth / 3 + padding + 23;
    rectWithText(
      doc,
      x,
      y,
      pageWidth / 3 - 86.4,
      25,
      10,
      "Visuals",
      "center",
      "#324A42",
      "#ffffff",
      "InterMedium"
    );

    y += 25;

    tableData = [];

    cellHeight = 45;
    lastPageTableHeight = 0;
    currentPage = 0;

    function createSlecetedArticleTable(
      tableData,
      pageWidth,
      tableX = 20,
      tableY = 5,
      cellMargin = 20,
      fontSize = 10
    ) {
      let tableYHeight = tableY;
      const columnWidths = [40, 40, 20]; // Define your column widths here
      const totalWidth = pageWidth - 1.5 * tableX;
      const totalPercentage = columnWidths.reduce(
        (sum, width) => sum + width,
        0
      );
      const columnWidthFactors = columnWidths.map(
        (width) => (width / totalPercentage) * totalWidth
      );
      let currentRow = 0;

      doc.fontSize(fontSize);

      while (currentRow < tableData.length) {
        if (tableYHeight + cellHeight > pageHeight - 20) {
          doc.addPage();
          lastPageTableHeight = 0;
          tableY = 15;
          tableYHeight = 10;
          currentPage++;
        }
        lastPageTableHeight += cellHeight;
        const rowData = tableData[currentRow];
        let cellY = tableYHeight;

        for (let j = 0; j < rowData.length; j++) {
          const cellText = rowData[j];
          const cellX =
            tableX +
            columnWidthFactors
              .slice(0, j)
              .reduce((sum, width) => sum + width, 0);

          if (currentRow >= 0 && j === 0) {
            doc
              .rect(cellX - 0.1, cellY, columnWidthFactors[j], cellHeight)
              .lineWidth(1)
              .strokeColor("#324A42")
              .stroke();

            drawCell(
              doc,
              cellText,
              cellX + 7,
              cellY + 15,
              columnWidthFactors[j] - 10,
              cellHeight,
              "left",
              "InterMedium",
              "#324A42"
            );
          } else if (currentRow >= 0 && j === 1) {
            doc
              .rect(cellX - 0.1, cellY, columnWidthFactors[j], cellHeight)
              .lineWidth(1)
              .strokeColor("#324A42")
              .stroke();

            // doc
            //   .rect(cellX - 0.1, cellY, columnWidthFactors[j], cellHeight)
            //   .lineWidth(1)
            //   .strokeColor("#ffffff")
            //   .stroke();

            drawCell(
              doc,
              cellText,
              cellX + 7,
              cellY + 15,
              columnWidthFactors[j] - 10,
              cellHeight,
              "left",
              "InterMedium",
              "#324A42"
            );
          } else if (currentRow >= 0 && j === 2) {
            doc
              .rect(cellX - 0.1, cellY, columnWidthFactors[j], cellHeight)
              .lineWidth(1)
              .strokeColor("#324A42")
              .stroke();

            drawImageCell(
              doc,
              path.join(__dirname, `../images/parameter/${cellText}`),
              cellX + 7,
              cellY + 5,
              columnWidthFactors[j] - 10,
              cellHeight
            );
          }
        }
        tableYHeight += cellHeight;
        currentRow++;
      }
    }

    if (
      productType === "singleProduct" &&
      singleProductCombination?.combinations?.length > 0
    ) {
      for (let combination of singleProductCombination?.combinations) {
        const attName = combination?.attributeId?.PrintName;
        const parameterName = combination?.parameterId?.name;
        const image = combination?.parameterId?.profileImage;
        tableData.push([attName, parameterName, image]);
      }

      createSlecetedArticleTable(tableData, pageWidth - 10, padding, y);
    }

    if (productType === "customizeProduct") {
      for (let combination of frontCombination) {
        const attName = combination?.attributeId?.PrintName;
        const parameterName = combination?.parameterId?.name;
        const image = combination?.parameterId?.profileImage;
        tableData.push([attName, parameterName, image]);
      }

      createSlecetedArticleTable(tableData, pageWidth - 10, padding, y);

      y = Math.min(lastPageTableHeight + 25, y + lastPageTableHeight + 25);

      if (backCombination && backCombination?.length > 0) {
        if (y + cellHeight > pageHeight - 20) {
          // doc.addPage();
          y = 20;
        }
        generateCombinations(
          doc,
          padding,
          y,
          backCombination,
          pageWidth,
          400,
          "back"
        );

        y += 401;

        doc
          .fontSize(10)
          .fillColor("#324A42")
          .font("InterRegular")
          .text(
            "This Design is just for reference, it will vary on site as per your section os Shatd, Material & Concept.",
            padding,
            y,
            pageWidth,
            20
          );

        y += 20;

        rectWithText(
          doc,
          padding,
          y,
          pageWidth - padding,
          20,
          12,
          "Selected Articles",
          "center",
          "#ffffff",
          "#324A42",
          "InterMedium"
        );

        y += 25;

        rectWithText(
          doc,
          padding - 1,
          y,
          pageWidth / 3 + padding + 5,
          25,
          10,
          "Available Customization",
          "center",
          "#324A42",
          "#ffffff",
          "InterMedium"
        );

        x = pageWidth / 3 + padding + 5;
        rectWithText(
          doc,
          x,
          y,
          pageWidth / 3 + padding + 23,
          25,
          10,
          "Current Selection",
          "center",
          "#324A42",
          "#ffffff",
          "InterMedium"
        );

        x += pageWidth / 3 + padding + 23;
        rectWithText(
          doc,
          x,
          y,
          pageWidth / 3 - 88,
          25,
          10,
          "Visuals",
          "center",
          "#324A42",
          "#ffffff",
          "InterMedium"
        );

        y += 25;

        tableData = [];

        for (let combination of backCombination) {
          const attName = combination?.attributeId?.PrintName;
          const parameterName = combination?.parameterId?.name;
          const image = combination?.parameterId?.profileImage;
          tableData.push([attName, parameterName, image]);
        }

        createSlecetedArticleTable(tableData, pageWidth - 10, padding, y);
      }
    }

    // ----------------------------------  last Page ----------------------------------------------
    doc.addPage();

    doc.font("InterRegular");

    x = (pageWidth - secondImageWidth) / 2;

    const lastImageHeight = 80;

    doc.rect(0, 0, pageWidth, pageHeight).fill("#324A42");
    doc.image(lastPageImagePath, x, padding - 10, {
      width: secondImageWidth,
      height: lastImageHeight,
    });

    const labelWidth = 100;

    y = lastImageHeight + 50;

    accountDetails.forEach((detail) => {
      const label = detail.label;
      const value = detail.value;

      doc.fontSize(fontSize).fillColor("#ffffff").text(`${label}`, padding, y);

      doc
        .fontSize(fontSize)
        .fillColor("#ffffff")
        .text(`${value}`, labelWidth + padding, y);

      y += 20;
    });

    doc.image(QrCodePath, pageWidth - 100, secondImageHeight + 50, {
      width: 80,
      height: 80,
    });

    y += 50;

    doc
      .fontSize(10)
      .fillColor("#FFFFFF")
      .font("Helvetica-Bold")
      .text("Terms And Condition", 0, y, {
        width: pageWidth,
        align: "center",
      });

    terms.forEach((term, index) => {
      doc
        .moveDown()
        .fontSize(fontSize - 1)
        .font("Helvetica")
        .fillColor("#ffffff")
        .text(`${index + 1}. ${term}`, padding);
    });

    doc.moveDown();

    y += 490;

    doc
      .fontSize(fontSize)
      .fillColor("#FFFFFF")
      .font("Helvetica-Bold")
      .text("Client Confirmation", padding, y);

    doc
      .moveTo(padding, y + 40) // Move to the starting point
      .lineTo(padding + 110, y + 40) // Draw a line to the ending point
      .strokeColor("#ffffff")
      .stroke();

    doc
      .fontSize(fontSize)
      .fillColor("#FFFFFF")
      .font("Helvetica-Bold")
      .text("Athorised Signatory", pageWidth - 140, y);

    doc
      .moveTo(pageWidth - 140, y + 40) // Move to the starting point
      .lineTo(pageWidth - 25, y + 40) // Draw a line to the ending point
      .strokeColor("#ffffff")
      .stroke();

    doc.end();
  } catch (error) {
    next(handleError(500, error.message));
  }
};

module.exports = { generateQuotationPDF };
