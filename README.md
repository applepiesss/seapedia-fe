# SEAPEDIA — Frontend (Next.js)

Next.js frontend for the SEAPEDIA multi-role e-commerce platform.  
Supports public browsing, role-based dashboards (Buyer, Seller, Driver, Admin), glassmorphism UI, and full marketplace flow.

---

## 🛠️ How to Run Locally

### Prerequisites

| Tool | Version |
|------|---------|
| **Node.js** | 18 or later |
| **npm** | 9 or later |

---

### 1. Configure Environment Variables

```bash
cp .env.example .env.local
```

Open `.env.local` and set the backend URL:

```env
# Point to wherever the Spring Boot backend is running
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

> If you're running the backend locally with default settings, no changes needed — it already points to `localhost:8080`.

---

### 2. Install Dependencies

```bash
npm install
```

---

### 3. Run the Development Server

```bash
npm run dev
```

The app will be available at **http://localhost:3000**.

---

### 4. Make Sure the Backend is Running

The frontend requires the Spring Boot backend to be up.  
See [seapedia-be/README.md](../seapedia-be/README.md) for backend setup instructions.

> **Quick start:** Run the backend with demo accounts pre-seeded:
> ```bash
> cd ../seapedia-be
> ./gradlew bootRun --args="--seed.demo=true"
> ```

---

### 5. Open in Browser

Go to **http://localhost:3000** and either:
- Register a new account, or
- Use one of the seeded demo accounts:

| Role | Username | Password |
|------|----------|----------|
| Admin | `admin` | `adminseapedia` |
| Seller | `seller1` | `sellerseapedia` |
| Buyer | `buyer1` | `buyerseapedia` |
| Driver | `driver1` | `driverseapedia` |

---

## 📁 Project Structure

```
seapedia-fe/
├── src/
│   ├── app/                  # Next.js App Router pages
│   │   ├── page.tsx          # Public marketplace homepage
│   │   ├── dashboard/        # Unified role dashboard
│   │   ├── buyer/            # Buyer dashboard (wallet, cart, orders)
│   │   ├── seller/           # Seller dashboard (products, orders, reports)
│   │   ├── driver/           # Driver dashboard (jobs, earnings)
│   │   ├── admin/            # Admin dashboard (monitoring, discounts)
│   │   ├── products/         # Public product listing & detail
│   │   ├── login/            # Login page
│   │   ├── register/         # Registration page
│   │   └── choose-role/      # Role switcher
│   ├── components/           # Shared components (Header, ProductCard, Toast, etc.)
│   ├── lib/                  # API clients and auth utilities
│   └── types/                # TypeScript type definitions
├── .env.example              # Environment variable template
└── README.md
```

---

## 🔑 Key Features

- **Public Marketplace** — Browse products without login
- **Role-based Dashboards** — Separate UIs for Buyer, Seller, Driver, Admin
- **Multi-role Accounts** — One user can hold multiple roles and switch between them
- **Glass UI** — White + blue-hint glassmorphism design system throughout
- **XSS Protection** — DOMPurify sanitization on public user inputs with toast warnings
- **Toast Notifications** — Global toast system for success, error, and security alerts

---

## 🧪 End-to-End Test Flow

1. **Seed** — start backend with `--seed.demo=true`
2. **Admin** — create a Voucher and Promo in the Discounts dashboard
3. **Seller** — add a product with stock in the Products dashboard
4. **Buyer** — add to cart, apply discounts, add address, checkout
5. **Seller** — go to Orders → process the order
6. **Driver** — find the job, take it, complete delivery
7. **Admin** — use "Simulate Next Day" to trigger the overdue auto-refund demo

---

## 📖 API Documentation (Swagger)

The backend exposes a fully interactive OpenAPI spec via Swagger UI.  
Once the backend is running, navigate to:  
**[http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)**

---

## 🔒 Security Hardening

SEAPEDIA employs strict security measures to mitigate OWASP Top 10 vulnerabilities:

### 1. SQL Injection Prevention
- The backend uses **Spring Data JPA** and Hibernate exclusively — all parameters are strictly bound via Prepared Statements.
- **Attack mitigated:** Submitting a username like `' OR '1'='1` or a review like `'); DROP TABLE application_reviews; --` is treated as literal text.

### 2. XSS (Cross-Site Scripting) Prevention
- React inherently escapes HTML in variables (e.g. `{review.comment}`).
- **DOMPurify** sanitizes all public user inputs (e.g. Application Reviews) before sending to the server.
- The global Toast system warns the user if a malicious payload is detected and blocked.
- **Attack mitigated:** A review containing `<script>alert('XSS')</script>` or `<img src="x" onerror="alert(1)">` is intercepted, sanitized, and blocked with a security warning toast.

### 3. Input Validation & Data Integrity
- **Backend:** `@Valid` constraints (`@NotBlank`, `@Min`, `@Max`, `@Email`, `@Pattern`) are enforced on all DTOs.
- **Frontend:** Client-side validation prevents invalid states (negative quantities, ratings > 5) from reaching the network.
- **Attack mitigated:** Submitting a rating of `999` or bypassing cart limits via Postman will be rejected with `400 Bad Request`.

### 4. Role-Based Access Control (RBAC) & Session Hardening
- **Stateless JWTs:** Upon logout, the client destroys the token, fully invalidating the session.
- **Strict role verification:** Every protected route uses `@PreAuthorize` scoped to the user's *currently active role*.
- **Resource ownership:** Endpoints verify ownership — users can only access their own data.
- **Attack mitigated:** A `BUYER` calling `POST /api/seller/products` with a valid JWT gets `403 Forbidden`. A `DRIVER` trying to complete another driver's job is rejected.
