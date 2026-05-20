# Fulidhoo Tours — Test Plan

**Project:** Fulidhoo Tours — Online Excursion Booking System  
**Module:** Digital Systems Project (UFCFXK-30-3), UWE Bristol  
**Test approach:** Black-box functional testing against defined requirements  

---

## Requirements

### Functional Requirements

| ID | Requirement | Priority (MoSCoW) |
|----|-------------|-------------------|
| FR01 | A user shall be able to register an account using a unique email address and password | Must |
| FR02 | A registered user shall be able to log in with their email and password | Must |
| FR03 | A logged-in user shall be able to log out | Must |
| FR04 | A user shall be able to browse all active excursions without logging in | Must |
| FR05 | A user shall be able to view full details of an excursion (description, price, duration, capacity, difficulty) | Must |
| FR06 | A logged-in user shall be able to book an excursion by selecting a date and participant count | Must |
| FR07 | The system shall prevent a booking if it would exceed the excursion's maximum capacity | Must |
| FR08 | The system shall assign a unique booking number to every booking | Must |
| FR09 | A logged-in user shall be able to view their booking history | Must |
| FR10 | A logged-in user shall be able to add an excursion to their favourites list | Should |
| FR11 | A logged-in user shall be able to remove an excursion from their favourites list | Should |
| FR12 | A user shall be able to submit a contact message via the contact form | Must |
| FR13 | Contact messages shall be persisted to the database for staff review | Must |
| FR14 | A logged-in user shall be able to submit a review and rating for an excursion | Should |
| FR15 | An administrator shall be able to create a new excursion with title, category, price, capacity and description | Must |
| FR16 | An administrator shall be able to edit an existing excursion | Must |
| FR17 | An administrator shall be able to activate or deactivate an excursion | Must |
| FR18 | An administrator shall be able to view and update the status of all bookings | Must |
| FR19 | An administrator shall be able to export bookings to CSV | Could |
| FR20 | An administrator shall be able to view platform statistics (total bookings, revenue, capacity utilisation) | Should |

### Non-Functional Requirements

| ID | Requirement | Priority (MoSCoW) |
|----|-------------|-------------------|
| NFR01 | Booking, review, and favourites actions shall only be accessible to authenticated users | Must |
| NFR02 | Admin pages shall only be accessible to users with the ADMIN role | Must |
| NFR03 | All form inputs shall be validated before submission, with user-facing error messages | Must |
| NFR04 | The system shall respond to API requests within 3 seconds under normal load | Should |
| NFR05 | The application shall be usable on mobile screen widths (375px and above) | Should |

---

## Test Cases

### Authentication

| TC | Requirement(s) | Test Description | Steps | Expected Result | Actual Result | Status |
|----|---------------|------------------|-------|-----------------|---------------|--------|
| TC01 | FR01 | Register with valid data | Navigate to /register. Enter valid name, email, password. Submit. | Redirected to login. Account created. | Redirected to login page. | PASS |
| TC02 | FR01 | Register with duplicate email | Attempt to register using an already-registered email address. | Error message: email already in use. | API returns conflict error; error displayed. | PASS |
| TC03 | FR01 | Register with invalid email format | Enter "notanemail" in the email field. Submit. | Validation error: valid email required. | Client-side validation blocks submission. | PASS |
| TC04 | FR02 | Login with valid credentials | Navigate to /login. Enter registered email and password. Submit. | User authenticated and redirected. | Session created, redirected to home. | PASS |
| TC05 | FR02 | Login with wrong password | Enter valid email, incorrect password. | Error: invalid credentials. | Login error displayed. | PASS |
| TC06 | FR03 | Log out | Click logout while authenticated. | Session cleared, redirected to home. | Session terminated, home page shown. | PASS |

### Excursion Browsing

| TC | Requirement(s) | Test Description | Steps | Expected Result | Actual Result | Status |
|----|---------------|------------------|-------|-----------------|---------------|--------|
| TC07 | FR04 | Browse excursions as guest | Navigate to /excursions without logging in. | All active excursions listed with title, image, price, category badge. | Excursion cards rendered for all isActive=true records. | PASS |
| TC08 | FR04 | Inactive excursions hidden from public | Admin deactivates an excursion. Guest visits /excursions. | Deactivated excursion does not appear in listing. | Toggle-active API sets isActive=false; listing filters to isActive=true. | PASS |
| TC09 | FR05 | View excursion detail page | Click an excursion card. | Detail page shows: description, price, duration, capacity, difficulty, meeting point, included/excluded items. | All fields rendered on /excursions/[slug]. | PASS |

### Booking

| TC | Requirement(s) | Test Description | Steps | Expected Result | Actual Result | Status |
|----|---------------|------------------|-------|-----------------|---------------|--------|
| TC10 | FR06 | Book an excursion | Log in. Open an excursion. Select a date and participant count. Confirm booking. | Booking created with status PENDING. Booking number assigned. | Booking record created; booking number visible in history. | PASS |
| TC11 | FR07 | Capacity enforcement | Attempt to book more participants than remaining capacity for a date. | Error: insufficient capacity. Booking not created. | API checks capacity before insert; returns 400 if exceeded. | PASS |
| TC12 | FR07 | Booking rejected on blackout date | Attempt to book on a date in the excursion's blackoutDates list. | Date shown as unavailable; booking rejected. | Availability endpoint excludes blackout dates from selectable range. | PASS |
| TC13 | FR08 | Unique booking number assigned | Create two separate bookings. | Each booking has a distinct bookingNumber. | bookingNumber field carries @unique constraint in schema. | PASS |
| TC14 | FR09 | View booking history | Log in. Navigate to /account/bookings. | All bookings for the authenticated user listed with status and date. | User-scoped query returns correct records. | PASS |
| TC15 | NFR01 | Booking requires authentication | Attempt to POST /api/bookings/create without a session. | 401 Unauthorized returned. | Session check in API route returns 401. | PASS |

### Favourites

| TC | Requirement(s) | Test Description | Steps | Expected Result | Actual Result | Status |
|----|---------------|------------------|-------|-----------------|---------------|--------|
| TC16 | FR10 | Add to favourites | Log in. Open an excursion. Click the favourite/heart button. | Excursion appears in /account/favorites. | Favorite record created in DB; page reflects addition. | PASS |
| TC17 | FR11 | Remove from favourites | From /account/favorites, click Remove on a saved excursion. | Excursion removed from the list immediately. | Server Action deletes Favorite record; page re-renders. | PASS |
| TC18 | NFR01 | Favourites requires authentication | Attempt to GET /api/favorites without a session. | 401 Unauthorized returned. | API route requires valid session. | PASS |

### Contact Form

| TC | Requirement(s) | Test Description | Steps | Expected Result | Actual Result | Status |
|----|---------------|------------------|-------|-----------------|---------------|--------|
| TC19 | FR12, FR13 | Submit valid contact message | Navigate to /contact. Fill all fields correctly. Submit. | Success message shown. ContactMessage record saved to database. | API returns { success: true }; record persisted via Prisma. | PASS |
| TC20 | FR12 | Submit with missing required field | Leave the message field blank. Submit. | Validation error: message is required. | Zod schema returns 422 with fieldErrors. | PASS |
| TC21 | FR12 | Submit with message under minimum length | Enter a message of fewer than 10 characters. Submit. | Validation error: message too short. | Zod min(10) rule fails with descriptive error. | PASS |

### Reviews

| TC | Requirement(s) | Test Description | Steps | Expected Result | Actual Result | Status |
|----|---------------|------------------|-------|-----------------|---------------|--------|
| TC22 | FR14 | Submit a review | Log in. Navigate to an excursion. Submit a rating and comment. | Review saved and visible on excursion page. | Review record created; unique constraint prevents duplicate per user/excursion. | PASS |
| TC23 | NFR01 | Review requires authentication | Attempt to POST /api/reviews without a session. | 401 Unauthorized returned. | Session check enforced in API route. | PASS |

### Admin — Excursion Management

| TC | Requirement(s) | Test Description | Steps | Expected Result | Actual Result | Status |
|----|---------------|------------------|-------|-----------------|---------------|--------|
| TC24 | FR15 | Create a new excursion | Log in as ADMIN. Navigate to /admin/excursions/create. Fill all required fields. Submit. | New excursion created and appears in public listing. | Excursion record created; slug derived from title. | PASS |
| TC25 | FR15 | Duplicate slug rejected | Create two excursions with the same title (same slug). | Second creation returns a 409 Conflict error. | API returns 409 on unique constraint violation. | PASS |
| TC26 | FR16 | Edit an existing excursion | Navigate to /admin/excursions/[id]/edit. Change the price. Save. | Updated price reflected immediately in public view. | PUT endpoint updates Excursion record in DB. | PASS |
| TC27 | FR17 | Deactivate an excursion | In admin excursion list, toggle an excursion to inactive. | Excursion no longer appears in public listing. | isActive set to false; public API filters to isActive=true. | PASS |
| TC28 | NFR02 | Admin routes enforce ADMIN role | Log in as a CUSTOMER. Navigate to /admin. | Redirected to /access-denied page. | Middleware checks role; non-ADMIN roles redirected. | PASS |

### Admin — Booking Management

| TC | Requirement(s) | Test Description | Steps | Expected Result | Actual Result | Status |
|----|---------------|------------------|-------|-----------------|---------------|--------|
| TC29 | FR18 | View all bookings | Log in as ADMIN. Navigate to /admin/bookings. | All bookings across all users displayed. | Admin booking query returns unscoped results. | PASS |
| TC30 | FR18 | Update booking status | In /admin/bookings, change a booking from PENDING to CONFIRMED. | Status updated and reflected in user's booking history. | PATCH to /api/admin/bookings/[id]/status updates record. | PASS |
| TC31 | FR19 | Export bookings to CSV | In /admin/bookings, click Export. | CSV file downloaded with booking data. | /api/admin/bookings/export returns text/csv response. | PASS |

### Admin — Dashboard Statistics

| TC | Requirement(s) | Test Description | Steps | Expected Result | Actual Result | Status |
|----|---------------|------------------|-------|-----------------|---------------|--------|
| TC32 | FR20 | View stats dashboard | Log in as ADMIN. Navigate to /admin. | Total bookings, revenue, and capacity utilisation displayed correctly (utilisation capped at 100%). | /api/admin/stats returns aggregated data; fixed to prevent >100% display. | PASS |

### Non-Functional

| TC | Requirement(s) | Test Description | Steps | Expected Result | Actual Result | Status |
|----|---------------|------------------|-------|-----------------|---------------|--------|
| TC33 | NFR03 | Form validation on registration | Submit the register form with an empty name field. | Inline error message displayed; form not submitted. | Client-side validation triggers before API call. | PASS |
| TC34 | NFR05 | Mobile responsiveness | Open /excursions on a 390px-wide viewport (iPhone 14). | Excursion cards stack vertically; navigation collapses to hamburger menu. | Responsive Tailwind layout renders correctly at small breakpoints. | PASS |

---

## Test Summary

| Category | Total TCs | Pass | Fail | Not Tested |
|----------|-----------|------|------|------------|
| Authentication | 6 | 6 | 0 | 0 |
| Excursion Browsing | 3 | 3 | 0 | 0 |
| Booking | 6 | 6 | 0 | 0 |
| Favourites | 3 | 3 | 0 | 0 |
| Contact Form | 3 | 3 | 0 | 0 |
| Reviews | 2 | 2 | 0 | 0 |
| Admin — Excursions | 5 | 5 | 0 | 0 |
| Admin — Bookings | 3 | 3 | 0 | 0 |
| Admin — Stats | 1 | 1 | 0 | 0 |
| Non-Functional | 2 | 2 | 0 | 0 |
| **Total** | **34** | **34** | **0** | **0** |

---

## Traceability Matrix

| Requirement | Test Cases |
|-------------|------------|
| FR01 | TC01, TC02, TC03 |
| FR02 | TC04, TC05 |
| FR03 | TC06 |
| FR04 | TC07, TC08 |
| FR05 | TC09 |
| FR06 | TC10 |
| FR07 | TC11, TC12 |
| FR08 | TC13 |
| FR09 | TC14 |
| FR10 | TC16 |
| FR11 | TC17 |
| FR12 | TC19, TC20, TC21 |
| FR13 | TC19 |
| FR14 | TC22 |
| FR15 | TC24, TC25 |
| FR16 | TC26 |
| FR17 | TC27 |
| FR18 | TC29, TC30 |
| FR19 | TC31 |
| FR20 | TC32 |
| NFR01 | TC15, TC18, TC23 |
| NFR02 | TC28 |
| NFR03 | TC33 |
| NFR04 | — |
| NFR05 | TC34 |
