# MULTANI MITHAS
## Complete Website & Business Management System

### 1. Brand
- Official Brand Name: Multani Mithas
- Website Type: Premium Pakistani Sweets & Bakery E-Commerce
- Main Goal: Online ordering + business management + delivery management

---

## 2. CUSTOMER WEBSITE

### Home
- Premium hero section
- Featured sweets
- Best sellers
- Special offers
- Gift boxes
- Customer reviews
- Why Multani Mithas
- Delivery information
- WhatsApp/contact buttons

### Products
- Sohan Halwa
- Barfi
- Gulab Jamun
- Ladoo
- Patisa
- Cakes
- Bakery items
- Namkeen
- Gift boxes
- Seasonal products

### Product Details
- Product images
- Product description
- Ingredients
- Available weights
- Price
- Discount
- Stock status
- Customer ratings
- Add to cart
- Buy now

### Shopping
- Search
- Categories
- Filters
- Wishlist
- Shopping cart
- Coupons
- Checkout
- Order confirmation

### Customer Account
- Registration/login
- Profile
- Saved addresses
- Order history
- Current orders
- Wishlist
- Reviews
- Complaints

---

## 3. ORDER SYSTEM

Order statuses:

1. Order Received
2. Confirmed
3. Preparing
4. Packed
5. Assigned to Delivery Boy
6. Out for Delivery
7. Delivered
8. Cancelled

Customer should be able to track the order status.

---

## 4. DELIVERY SYSTEM

### Delivery Boys
- Delivery boy login
- Profile
- Assigned orders
- Accept/reject delivery
- Order status updates
- Customer contact
- Navigation/map
- Delivery history

### Live Tracking
- Customer can see delivery status
- Delivery boy location updates
- Map view
- Estimated delivery time
- Delivery completed confirmation

### Delivery Management
- Assign delivery boy
- Delivery zones
- Delivery charges
- Delivery history
- Delivery performance

---

## 5. ADMIN PANEL

### Dashboard
- Today's sales
- Today's orders
- Pending orders
- Preparing orders
- Out for delivery
- Delivered orders
- Cancelled orders
- Customers
- Products
- Low stock
- Complaints
- Reviews
- Bookings

### Order Management
- View orders
- Search orders
- Filter orders
- Change status
- Assign delivery boy
- View customer details
- Payment information
- Invoice

### Product Management
- Add product
- Edit product
- Delete product
- Product images
- Categories
- Prices
- Weight options
- Stock
- Discounts
- Featured products
- Best sellers

### Customer Management
- Customer list
- Customer profile
- Orders
- Addresses
- Reviews
- Complaints

### Delivery Management
- Delivery boys
- Active deliveries
- Assignments
- Live locations
- Delivery history

### Review Management
- New reviews
- Approve reviews
- Reject reviews
- Customer ratings
- Admin replies

### Complaint Management
- New complaints
- In progress
- Resolved
- Priority
- Staff response
- Complaint history

### Booking Management
- Wedding bookings
- Birthday bookings
- Corporate orders
- Event orders
- Custom orders
- Date/time
- Quantity
- Location
- Customer details
- Booking status

---

## 6. FORMS

### Order Form
- Customer information
- Products
- Quantity
- Address
- Delivery date
- Delivery time
- Payment method

### Booking Form
- Name
- Phone
- Email
- Event type
- Event date
- Number of people
- Required products
- Quantity
- Budget
- Location
- Additional requirements

### Complaint Form
- Customer name
- Order number
- Phone/email
- Complaint category
- Description
- Image/file attachment
- Priority
- Admin response

### Review Form
- Customer name
- Order number
- Product
- Rating
- Review
- Optional image
- Admin approval

---

## 7. PAYMENTS

Architecture should support:
- Cash on Delivery
- Online payment
- Payment status
- Paid/unpaid
- Payment history
- Refund/cancellation architecture

Payment gateway will be selected later.

---

## 8. MAP & LOCATION

- Store locations
- Delivery zones
- Customer address
- Delivery boy location
- Live delivery tracking
- Map integration
- Estimated delivery time

Map provider will be selected during development.

---

## 9. BUSINESS FEATURES

- Coupons
- Discounts
- Promotional banners
- Gift cards
- Loyalty/reward points
- Seasonal campaigns
- Featured products
- Best sellers
- Recently viewed products
- Related products
- Referral system

---

## 10. REPORTS

### Sales Reports
- Daily sales
- Weekly sales
- Monthly sales
- Yearly sales

### Product Reports
- Best sellers
- Low stock
- Product performance
- Category performance

### Customer Reports
- New customers
- Repeat customers
- Customer order history

### Delivery Reports
- Delivery performance
- Completed deliveries
- Failed deliveries
- Delivery times

### Complaint Reports
- Total complaints
- Open complaints
- Resolved complaints
- Complaint categories

---

## 11. SECURITY

- Customer authentication
- Admin authentication
- Delivery boy authentication
- Role-based permissions
- Secure passwords
- Protected admin pages
- Secure database
- Input validation
- Protection against unauthorized access

---

## 12. FUTURE FEATURES

- Multiple branches
- Mobile-friendly/PWA experience
- Push notifications
- SMS notifications
- Email notifications
- WhatsApp notifications
- Advanced analytics
- Inventory management
- Staff management
- Accounting integration
- POS integration

---

## 13. DESIGN DIRECTION

The website should be:

- More attractive and modern than the reference websites
- Premium
- Elegant
- Fast
- Mobile responsive
- Easy to navigate
- Pakistani/Multani cultural feel
- Professional e-commerce experience
- Original design
- High-quality product presentation
- Smooth animations without making the site slow

Reference inspiration:
- Al Jannat Sweets
- Suleman Sweets & Bakers

Do not copy their branding or design.

---

## 14. DEVELOPMENT RULE

Build the system in stages.

Stage 1:
Project planning

Stage 2:
Homepage design

Stage 3:
Product catalogue

Stage 4:
Product details

Stage 5:
Shopping cart

Stage 6:
Checkout/order system

Stage 7:
Customer accounts

Stage 8:
Admin panel

Stage 9:
Delivery management

Stage 10:
Maps and delivery tracking

Stage 11:
Reviews and complaints

Stage 12:
Booking system

Stage 13:
Reports and analytics

Stage 14:
Security and testing

Stage 15:
Deployment

---

## 15. IMPORTANT

Do not remove existing working features while adding new features.

Keep the project organized and scalable.

Every major feature should be developed and tested before moving to the next feature.

The final system should be suitable for a real sweets business, not only a demonstration website.


## 16. CUSTOMER SHOP, PRICING & CHECKOUT EXPERIENCE

### Product Catalogue
- Display the full active product catalogue from the database, not hard-coded demo products.
- Organize products by their actual admin-managed categories.
- Each product card must show a real product image, product name, category, description, available stock, discount and price.
- Show the actual configured weight/pack-size options and the corresponding price for each option.
- Keep Add to Cart and Buy Now actions connected to the selected product, weight and quantity.
- Product images and selected options must remain visible in the cart/checkout summary.

### Transparent Checkout Pricing
- Show product subtotal, delivery fee, packaging fee, sales tax (when enabled), and final payable amount before order submission.
- Delivery, packaging and tax values must be controlled through admin settings and recalculated on the server when an order is saved.
- The same charge breakdown must be stored with the order and visible in Admin Orders.
- Packaging fee is currently implemented as one fixed charge per order; confirm whether the business requires a per-product/per-item packaging charge before launch.
- Do not invent or hard-code tax rates, delivery charges, packaging prices or free-delivery thresholds.

### Checkout Form
- Use a polished, mobile-first, premium checkout layout inspired by high-quality European ecommerce forms without copying another brand.
- Show selected product image, name, selected weight/pack, quantity, item price and order totals.
- Collect customer name, phone, email (optional unless business policy changes), and complete delivery address.
- Show available enabled payment methods and clear payment instructions.
- For manual payments, show the payment screenshot WhatsApp action after order submission; clearly state that a screenshot is not proof of payment and admin must verify receipt.

### WhatsApp Contact Placements
- Product card enquiry button.
- Checkout help button below the order submission action.
- Payment screenshot / verification button after placing a manual-payment order.
- Contact Us section button.
- Separate footer WhatsApp button.
- Every button must open the official business WhatsApp account with a useful prefilled message.

### Social Accounts
- Footer must show clickable official Facebook, Instagram, YouTube and WhatsApp links (TikTok may also be shown).
- Links must be configured in Admin > Website Design > Social Media and published to the customer website.
- Never use invented or placeholder account URLs as live links.

## 17. COMPETITOR REFERENCE
- Suleman Sweets & Bakers is a catalogue/category and product-pricing reference only.
- Build an original Multani Mithas visual identity and a more polished customer checkout; do not copy competitor branding or layouts.



## 18. DAILY-EDITABLE PRODUCT-WEIGHT PRICING (ACTIVE REQUIREMENT)

Every sellable product weight/pack option must store its own editable values:
- Selling price for that exact weight/pack.
- Delivery fee for that exact product/weight.
- Packaging type (e.g. tin, gift box, jar, pouch) and packaging fee.
- Sales-tax percentage.
- Sales-tax basis: product price only, or product + delivery + packaging.

Customer product cards and checkout must show the same per-unit breakdown and exact payable amount. Quantity multiplies each per-unit charge. The server recalculates all values from the database at order submission and stores a snapshot per order item so future price edits never alter an existing order. Admin Orders must display the saved item-level charge snapshot.

Do not rely on one global delivery, packaging or tax amount for new orders. Admin > Products > Edit Product > Weight & Price Options is the live pricing control. Old global checkout defaults are legacy-only and must not be represented as active customer pricing.

## 19. PAYMENT WALLET EXPERIENCE
- Selecting JazzCash, Easypaisa, Raast or bank transfer must open that method's configured business wallet/account details, QR code and app link (when configured) inside checkout.
- Show the estimated payable amount before order submission and the server-confirmed exact amount after order creation.
- Do not allow a customer to mistake an unconfigured payment method for a payable wallet. Show a clear warning if no active account exists.
- After a manual-payment order is created, show a WhatsApp action directly in the payment confirmation area with order number and exact amount prefilled so the customer can attach the screenshot.
- Screenshot is only a payment claim; admin verifies actual funds before marking Paid.

## 20. PRODUCT RANGE & PAKISTAN-READY OPERATIONS
- Product catalogue must support traditional sweets, bakery, gift boxes, Desi Ghee and Honey.
- Every product/pack option must allow price, stock, discount, delivery, packaging and tax changes without code changes.
- Cancellation, refund, partial refund, order amendment and payment reversal workflows must be wired to real order/payment records with an audit trail and clear customer communication.
- About Us, Contact Us, policies, social links, WhatsApp and footer actions must be editable in Admin and connected to customer pages.
- Preserve existing approved product photography; improve typography, spacing, cards, form layout and responsive behavior without replacing approved product images.
- Mobile-first layout: no horizontal overflow, clear touch targets, readable fee breakdowns and wallet details that fit narrow screens.

## 18. VARIABLE PRICING FOR PAKISTAN'S CHANGING MARKET
- Every product has independently editable weight/pack-size options.
- Each product weight option must store its own selling price, delivery charge, packaging fee, packaging type, sales-tax rate, and tax basis.
- Admin can change any rate at any time; the customer storefront must read the latest saved values without relying on a hard-coded/global default.
- Customer product cards must show an itemised per-selected-pack breakdown and exact unit total before Add to Cart / Buy Now.
- Gift boxes must use the same transparent charge breakdown as sweets.
- Cart and checkout must show item-level charges, quantities, subtotal, delivery, packaging, tax and final amount.
- Wallet/account panel must display the same server-confirmed payable amount after the order is created.
- Server order creation is the source of truth; the browser's estimated total must never be trusted for payment or order storage.
- Every order item must preserve a snapshot of the exact weight, product price, delivery, packaging type/fee, tax rate/basis/amount and line total at purchase time. Later admin price changes must not rewrite historical orders.
- Currency is PKR for Pakistan orders. Do not invent delivery, packaging or tax rates; business admin enters current values.

## 19. PRODUCT RANGE AND STORE MANAGEMENT
- Catalogue categories must be admin-managed and include sweets, bakery, desi ghee, honey, gift boxes and future product categories.
- Products must support different units and pack types where appropriate (g, kg, jar, tin, box, bottle).
- Product imagery is existing brand content and must be preserved unless the owner explicitly asks to replace it.
- Admin must manage product status, stock, category, image, price, weight/pack options, packaging and tax configuration.

## 20. PAYMENT WALLET EXPERIENCE
- Selecting a payment method expands that method's own configured wallet/account panel in the checkout, not a generic unrelated screen.
- Display configured account title, wallet number/IBAN, QR image, provider/app link and exact payable amount.
- Never show fake wallet numbers, QR codes, or placeholder account links as live payment instructions.
- After an order is successfully created, provide a method-specific WhatsApp screenshot submission link directly beneath payment instructions.
- Screenshot submission is only a customer notification; admin must verify funds in the actual business account before marking Paid.
- COD is paid only after actual cash collection on delivery.

## 21. ABOUT US, BRAND AND CUSTOMER SUPPORT
- About Us content (heading, story, mission and customer promise) must be editable in Admin > Website Design and published to the customer Our Story section and footer.
- Brand logo must be selectable from the existing uploaded image library and shown in the customer header/product shopping experience and order confirmation/thank-you screen.
- Preserve existing product, heritage and banner images. Use a refined European-inspired layout, not copied competitor artwork.
- Customer-facing social links (Facebook, Instagram, TikTok, YouTube, WhatsApp) must be editable and clickable.
- WhatsApp entry points: product enquiry, checkout help, manual-payment screenshot submission, Contact Us and footer.
- Forms and buttons must be mobile responsive and connected to their actual admin/API workflows.

## 22. CANCELLATIONS, REFUNDS AND COMPLAINTS
- Customers must be able to request cancellation using their order reference and phone/email verification; show whether the order is still cancellable based on its preparation/dispatch status.
- Admin must approve/reject cancellation requests and record the reason and time; cancellation must update the real order and inventory exactly once.
- Refund requests must be created against a real order/payment, with reason, amount, evidence, status, reviewer and audit history.
- Refund status labels (Requested, Under Review, Approved, Rejected, Processing, Refunded) must be database-backed and visible to the customer and admin.
- Marking a refund as Refunded must not imply money has been sent automatically. Admin must record the real transfer reference and date; live gateway refunds require a supported gateway integration.
- Keep existing customer policy pages but ensure their wording is consistent with actual operational workflows and applicable consumer law.

## 23. RESPONSIVE DESIGN AND RELEASE CHECKS
- Mobile first: no horizontal page overflow, comfortable touch targets, readable itemised totals and forms that fit narrow screens.
- Keep the existing approved product images and brand logo; only improve layout, typography, spacing, hierarchy and usability.
- Verify customer product selection → cart → checkout → method-specific wallet → order confirmation → WhatsApp evidence submission → admin order/payment verification.
- Verify admin price edits update new customer quotations/orders while historical order snapshots remain unchanged.
- Verify cancellation/refund requests, status transitions, stock restoration, and audit logs before declaring launch readiness.

## 22. FINAL BUSINESS SCOPE — GUEST PRODUCT E-COMMERCE ONLY (OVERRIDES EARLIER SECTIONS)

Multani Mithas sells physical sweets, bakery products and gift boxes. It is not a service-booking platform.

### Keep
- Product catalogue, categories, product/weight pricing, per-product/per-weight packaging and delivery charges, cart and guest checkout.
- Collect customer name, phone, optional email and delivery address only as needed to fulfil each order. No customer registration, login, profile dashboard, saved-address account or customer-management module.
- Order confirmation, order lookup/status, order cancellation/refund handling, admin order and payment management.
- Delivery dispatch, zones/charges, assignment and delivery status for physical parcels.
- Product reviews and ratings with moderation.
- Admin product, inventory, order, payment, delivery, review and sales reporting.
- Product discounts, seasonal promotions and promotional banners only when configured as product pricing/marketing content; no coupon-code subsystem.

### Remove / do not implement
- Coupon codes, coupon management and coupon APIs.
- Referral programme, referral codes, rewards and referral APIs.
- Customer accounts, registration/login, profile management, saved-address accounts and customer profile APIs/pages.
- Separate feedback module.
- Generic complaint ticketing, appointment bookings and service-booking workflows. Order-specific cancellation/refund/support remains part of order fulfilment.

### Customer journey
Browse products → select weight/pack → view exact itemised charges → guest checkout → pay → receive parcel → optionally review the product.


## 21. EXPANDED PAKISTANI PRODUCT CATALOGUE & CATEGORY MANAGEMENT

Multani Mithas is a Pakistani food-products storefront, not a sweets-only catalogue. The catalogue must support these launch collections:
- Sweets: Sohan Halwa, Barfi, Gulab Jamun, Ladoo, Patisa and Mix Mithai.
- Gift Boxes: assorted mithai boxes, premium gift boxes, festive and corporate hampers.
- Desi Ghee: pure desi ghee and future pack sizes.
- Pure Honey: honey varieties and jar sizes.
- Dry Fruits: almonds, pistachios, cashews, walnuts, raisins and mixed dry fruits.
- Bakery: biscuits, rusks and bakery products.
- Cakes: whole cakes and other cake products.
- Namkeen: savoury snacks and namkeen.
- Seasonal & Special: Eid, wedding, winter and limited-edition products.

Category rules:
- Admin product entry must offer category suggestions and allow a new category to be typed without a code change.
- Storefront category directory must be database-driven and automatically show collections that contain active products.
- A category with no active products must not be advertised as an available collection.
- Preserve existing category names on current products; do not silently rename or migrate live products.
- Product data must support per-product pack/weight options, price, stock, discount, packaging type/fee and delivery/tax settings.
- Product attributes such as ingredients, origin, storage instructions, shelf life and allergen information should be available for products where relevant; do not invent claims such as "organic", "pure", "chemical-free" or health benefits without verified business evidence.

## 22. MULTI-ACCOUNT, MULTI-BRANCH PAYMENT ARCHITECTURE

Payment methods and payment receiving accounts are separate records. The system must support:
- Cash on Delivery.
- JazzCash with multiple business accounts.
- Easypaisa with multiple business accounts.
- Raast IDs.
- At least two bank accounts at launch, with the ability to add more later.
- Future official merchant-gateway providers without replacing the manual-payment workflow.

Account and branch rules:
- Each receiving account belongs to a business owner/entity and may be assigned to one or more branches.
- Before multiple branches exist, use one default/head-office branch context.
- When branches are introduced, authorised admins can assign payment accounts to specific branches and select the active account per payment method/branch.
- Account records must be editable, replaceable, activatable/deactivatable and auditable by authorised admins; routine changes should not be necessary.
- Do not hard-code personal wallet numbers or bank details in source code.
- Do not expose inactive, unassigned or test-only account details through public APIs.
- The temporary family wallet used for initial testing must remain clearly marked test-only and must never be treated as a production merchant gateway.
- Customer checkout may show only a configured active account for the selected method and branch.
- Snapshot the selected account display details and account identifier into each order/payment record at order time, so future account changes never rewrite historical orders.
- A screenshot or customer-submitted reference is a payment claim only. Admin verifies actual received funds before marking a manual payment Paid.
- COD becomes Paid only after cash is collected and confirmed.
- Never collect/store wallet PINs, OTPs, passwords or internet-banking credentials.
- Future JazzCash/Easypaisa gateway support must use official merchant credentials on the server, signed/verified provider callbacks and server-side transaction verification; app deep links alone are not proof of payment.
- Require role-based access, audit events for account changes, masked account details where appropriate, and rate limits on sensitive payment/admin actions.

## 23. PAKISTAN-FIRST CUSTOMER EXPERIENCE

- Use PKR/Rs display, Pakistan phone-number validation and familiar Pakistani address/delivery wording.
- Keep checkout mobile-first, low-friction, readable and suitable for customers who prefer simple interfaces.
- Use clear Urdu/Roman Urdu-friendly labels where appropriate while retaining a polished modern visual identity.
- Explain COD and manual wallet/bank transfer steps plainly; do not imply automatic payment when it is manual.
- Do not force customers to use WhatsApp to complete checkout or payment verification.
- Make WhatsApp a helpful optional support/receipt-sharing channel.
