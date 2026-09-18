# CartNova interview guide

## Files to study first

1. `frontend/src/context/AuthContext.jsx`: session restoration and authentication state.
2. `frontend/src/context/CartContext.jsx`: immutable state updates, localStorage and totals.
3. `frontend/src/pages/Checkout.jsx`: forms, Axios requests, loading state and navigation.
4. `frontend/src/services/api.js`: a shared API client and currency formatting.
5. `backend/app.js`: middleware order, CORS, cookies, routes and error handling.
6. `backend/middleware/authMiddleware.js` and `adminMiddleware.js`: authentication versus authorization.
7. `backend/controllers/authController.js`: password hashing and JWT cookies.
8. `backend/controllers/orderController.js`: trusted pricing, stock transactions and ownership.
9. `backend/models/Order.js`: order snapshots and schema structure.
10. `backend/tests/api.test.js`: evidence for the important security and stock guarantees.

## 15 likely questions

1. **Walk me through placing an order.** React sends shipping fields and product IDs/quantities through Axios; the protected Express route invokes the controller, which validates inputs, updates stock and saves the order in a MongoDB transaction. The response clears the cart and opens order history.
2. **Why did you use Context instead of Redux?** Authentication and cart are the only shared state domains. Context and useState make their small set of operations easier to follow without extra libraries or boilerplate.
3. **How does a user stay logged in after refresh?** The browser retains an HttpOnly JWT cookie. On mount, AuthContext calls `/api/auth/profile` and restores the user from a verified server response.
4. **Why store JWTs in cookies?** HttpOnly prevents JavaScript from reading the token. Secure protects production transport, SameSite=Lax reduces cross-site cookie use, and JSON-only mutations plus Origin checks mitigate CSRF. XSS protection still matters because injected scripts could issue requests.
5. **Authentication versus authorization?** Authentication identifies a valid user. Authorization decides whether that user may access an admin operation or a particular order. The backend enforces both independently of React route guards.
6. **Can a user register as admin by changing the request?** No. The registration controller explicitly constructs name, email and hashed password; it never accepts a role. Admin creation is a separate operator-run script.
7. **What does bcrypt do?** It creates a salted, one-way password hash. Login compares the submitted password to the stored hash. The application never returns or stores plaintext passwords.
8. **Why not trust the cart's total?** Browser state can be modified. The order controller loads current prices from MongoDB and calculates totals in integer cents before saving the order.
9. **How do you prevent overselling?** Each stock update requires `stock >= quantity` and decrements atomically. All lines and the order are in one transaction, so concurrent writes retry safely and failures roll back the whole purchase.
10. **Why must MongoDB be a replica set?** Multi-document transactions need replica-set or sharded deployment support. Atlas satisfies this; integration tests start an ephemeral replica set.
11. **Why copy product name and price into the order?** Orders are historical records. Editing or deleting a catalog product must not change a customer's original purchase details.
12. **How is cancellation handled?** Only a Processing order may become Cancelled. The status change and restocking occur in one transaction. A second cancellation is rejected, preventing double restocking.
13. **How does product filtering work?** URL query parameters are sent to the product endpoint. The controller builds a MongoDB filter, escapes search regex characters, validates maximum price, and applies a controlled sort order. The URL preserves filter state.
14. **How do you handle errors and loading states?** Express propagates failures to centralized error middleware, returning status codes and friendly messages without internal error details. React shows loading indicators, disables pending actions and renders errors from the API.
15. **What would you improve before a larger launch?** Add idempotent checkout, pagination, indexes, stronger session revocation, email verification, review moderation and distributed rate limiting. Measure actual workload before adding architecture.

## Five-minute demo

Open the homepage and search/filter the catalog. Add an item, adjust its quantity and refresh to show cart persistence. Register, check out with test shipping information and show My Orders. Sign in as admin in another browser profile, update the order to Shipped then Delivered, and show delivered revenue. Explain why a normal user cannot call admin endpoints, then show the integration test for concurrent checkout.
