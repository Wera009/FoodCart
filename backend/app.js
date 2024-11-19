const fs = require("fs/promises");
const path = require("path");  // Make sure path module is required
const bodyParser = require("body-parser");
const express = require("express");

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
//app.use(express.static("backend/public"));

// CORS Headers
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  console.log(`Request for: ${req.url}`);
  next();
});

// Meals Route (GET request)
app.get("/meals", async (req, res) => {
  try {
    // Corrected path for available-meals.json
    const mealsPath = path.join(__dirname, 'data', 'available-meals.json');  
    const meals = await fs.readFile(mealsPath, "utf8");
    res.json(JSON.parse(meals));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to read meals data." });
  }
});

// Orders Route (POST request)
app.post("/orders", async (req, res) => {
  const orderData = req.body.order;

  // Validate the order data
  if (
    !orderData || 
    !orderData.items || 
    orderData.items.length === 0
  ) {
    return res.status(400).json({ message: "Missing data." });
  }

  if (
    orderData.customer.email === null ||
    !orderData.customer.email.includes("@") ||
    orderData.customer.name === null ||
    orderData.customer.name.trim() === "" ||
    orderData.customer.street === null ||
    orderData.customer.street.trim() === "" ||
    orderData.customer["postal-code"] === null ||
    orderData.customer["postal-code"].trim() === "" ||
    orderData.customer.city === null ||
    orderData.customer.city.trim() === ""
  ) {
    return res.status(400).json({
      message: "Missing data: Email, name, street, postal code, or city is missing."
    });
  }

  const newOrder = {
    ...orderData,
    id: (Math.random() * 1000).toString(),
  };

  try {
    // Corrected path for orders.json
    const ordersPath = path.join(__dirname, 'data', 'orders.json');
    const orders = await fs.readFile(ordersPath, "utf8");
    const allOrders = JSON.parse(orders);
    allOrders.push(newOrder);
    
    // Write the updated orders array back to the file
    await fs.writeFile(ordersPath, JSON.stringify(allOrders));
    
    res.status(201).json({ message: "Order created!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create order." });
  }
});

// Default 404 handler
app.use((req, res) => {
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  res.status(404).json({ message: "Not found" });
});

// Start the server on a specific port (e.g., 3000)
const port = 3000;  // Set to 3000 or another available port
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

