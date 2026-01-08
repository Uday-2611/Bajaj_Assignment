# 🚀 Trading API SDK - Interview Preparation Guide

This guide explains your project in detail. Use this to prepare for your interview. It covers the architecture, file structure, key flows, and design decisions.

---

## 1. 🏗️ Project Architecture (The "30,000 Foot View")

Your project follows a **Layered MVC (Model-View-Controller)** architecture. This is a standard industry pattern that separates concerns, making code testable and maintainable.

### The Layers:
1.  **Presentation Layer (Routes & Controllers)**: Handles incoming HTTP requests, validates input, and sends responses.
    *   *Analogy*: The "Waiter" taking your order.
2.  **Business Logic Layer (Services)**: Contains the core rules (e.g., "Is the market open?", "Does user have enough funds?").
    *   *Analogy*: The "Chef" cooking the meal.
3.  **Data Access Layer (Models & Storage)**: Manages how data is stored and retrieved.
    *   *Analogy*: The "Pantry" where ingredients are kept.

---

## 2. 📂 File-by-File Walkthrough

### 🟢 Root Files
*   **`server.js`**: The entry point. It sets up the HTTP server on port 3000. It routes requests to `app.js`.
*   **`cli-client.js`**: A separate, standalone script that acts as a "user" of your API. It uses `http` requests to talk to your running `server.js`. It's a bonus feature showing you can build client-side tools.
*   **`package.json`**: Lists dependencies (`express`, `uuid`, etc.) and scripts (`npm run server`).

### 🟢 `src/` Directory (The Brains)

#### 1. `src/app.js` (The Express Application)
*   **What it does**: Configures Express. It sets up "middleware" (tools that run on every request) like `body-parser` (to read JSON) and your Routes.
*   **Key Detail**: It mounts routes like `app.use('/api/v1/orders', orderRoutes)`.

#### 2. `src/config/`
*   **`constants.js`**: A single place for magic strings and numbers.
    *   *Why?* Instead of typing "BUY" everywhere (and risking typos), you use `ORDER_TYPES.BUY`.
*   **`swagger.js`**: Configuration for the interactive API documentation. It tells Swagger where to find your API definitions.

#### 3. `src/routes/` (The Router)
*   **Files**: `orders.js`, `instruments.js`, etc.
*   **What they do**: Define the **URL paths**.
    *   Example: `router.post('/', orderController.placeOrder)` maps a POST request to `/api/v1/orders` to the `placeOrder` function in the controller.

#### 4. `src/controllers/` (The Coordinator)
*   **Files**: `orderController.js`, `instrumentController.js`, etc.
*   **What they do**:
    1.  Extract data from the request (`req.body`).
    2.  Call the Service Layer (`orderService.placeOrder`).
    3.  Send the response back to the user (`res.json`).
*   **Key Concept**: Controllers should be "thin". They shouldn't contain complex logic; they just coordinate.

#### 5. `src/services/` (The Business Logic)
*   **Files**: `orderService.js`, `portfolioService.js`, etc.
*   **What they do**: The heavy lifting.
    *   *Example in `orderService.js`*: Checks if an instrument exists, validates the price, creates an `Order` object, and saves it to the DB.
    *   *Bonus Logic*: If it's a MARKET order, it calls `executeMarketOrder` immediately.

#### 6. `src/models/` (The Data Structure)
*   **Files**: `Order.js`, `Trade.js`, `Instrument.js`.
*   **What they do**: Javascript Classes that define what an object looks like (e.g., an Order needs a `symbol`, `qty`, `price`).
*   **Validation**: They often have a static `validate()` method to ensure bad data doesn't get into the system.

#### 7. `src/storage/` (The Database)
*   **`inMemoryDB.js`**: A simulation of a real database.
*   **How it works**: Uses JavaScript `Map` objects (`orders = new Map()`).
    *   *Why Map?* It has fast lookups (O(1) complexity) by ID.
*   **Note**: Data is lost when the server restarts (because it's in memory). This is expected for this assignment.

#### 8. `src/middleware/`
*   **`errorHandler.js`**: A centralized place to catch crashes. Instead of the server dying, it catches the error and sends a nice JSON response (`{ success: false, message: "Something went wrong" }`).
*   **`auth.js`**: A "Mock" authentication. Since we don't have real users, it adds a fake `userId: "user_001"` to every request logic so the code thinks a user is logged in.

---

## 3. 🔄 "Trace the Request": Placing an Order

Here is what happens step-by-step when you hit "Execute" in Swagger for a **BUY** order:

1.  **Request**: `POST /api/v1/orders` sends JSON `{ symbol: "TCS", qty: 10 ... }`.
2.  **Server**: `server.js` receives it -> passes to `app.js`.
3.  **Router**: `src/routes/orders.js` sees the `POST /` and calls `orderController.placeOrder`.
4.  **Controller**: `src/controllers/orderController.js` takes the request body.
5.  **Service**: Calls `orderService.placeOrder(data)`.
    *   **Validation**: Checks if "TCS" exists in `instrumentService`.
    *   **Model**: Creates `new Order(data)`.
    *   **Execution**: If it's a MARKET order, it creates a `Trade` record immediately.
    *   **Storage**: Saves the Order and Trade to `inMemoryDB`.
6.  **Response**: Service returns the Order object -> Controller sends it as JSON -> User sees "Success".

---

## 4. 🌟 Bonus Features / Talking Points

Use these points to impress your interviewer:

1.  **Swagger Documentation**: "I implemented OpenAPI 3.0 documentation so the API is fully interactive and easy to test for other developers."
2.  **Centralized Error Handling**: "I used a global error handler middleware to ensure the API always returns structured JSON errors, preventing server crashes."
3.  **Separation of Concerns**: "I strictly followed Controller-Service-Repository patterns. This makes it easy to swap out the In-Memory DB for a real Database (like MongoDB) later without checking the controller logic."
4.  **Simulation Logic**: "I implemented realistic trading logic—Market orders execute instantly and update the Portfolio, whereas Limit orders wait in a 'PLACED' state."

---

## 5. ❓ Common Interview Questions for this Project

**Q: Why did you use `Map` instead of an Array for storage?**
*A: `Map` allows for O(1) [constant time] access if I need to find an order by ID. Arrays require O(n) [linear time] searching, which gets slower as data grows.*

**Q: How would you scale this for production?**
*A: I would replace `inMemoryDB.js` with a real database like PostgreSQL or MongoDB. Since my logic is in the `Service` layer, I'd only need to update the `Storage` layer.*

**Q: How do you handle concurrency (two people buying the last stock)?**
*A: Since Node.js is single-threaded, race conditions are less common in simple memory logic, but for a real DB, I would use Database Transactions (ACID) to ensure integrity.*
