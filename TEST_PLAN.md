# Fulidhoo Tours — Test Plan

**Project:** Fulidhoo Tours — Online Excursion Booking System  
**Student:** Mohamed Anoof Ibrahim (23081536)  
**Supervisor:** Udhuma Latheef  
**Institution:** Villa College  

This document lists the functional and non-functional requirements I identified for the system,
together with the test cases I ran to verify them. All tests were done manually through the
browser and by calling the API routes directly with a REST client.

---

## Requirements

### Functional Requirements

| ID | Requirement | Priority |
|----|-------------|----------|
| FR01 | Users can register with a unique email and password | Must have |
| FR02 | Registered users can log in with their credentials | Must have |
| FR03 | Logged-in users can log out | Must have |
| FR04 | Anyone (including guests) can browse active excursions | Must have |
| FR05 | Users can view full details of an excursion — price, duration, capacity, difficulty | Must have |
| FR06 | Logged-in customers can book an excursion for a chosen date and participant count | Must have |
| FR07 | The system blocks bookings that would exceed the excursion's capacity for that date | Must have |
| FR08 | Every booking gets a unique booking reference number | Must have |
| FR09 | Customers can see their booking history in their account | Must have |
| FR10 | Customers can save an excursion to their favourites | Should have |
| FR11 | Customers can remove an excursion from their favourites | Should have |
| FR12 | Anyone can submit a message via the contact page | Must have |
| FR13 | Contact messages are stored in the database for staff to read | Must have |
| FR14 | Customers can leave a star rating and written review for an excursion | Should have |
| FR15 | Admins can create a new excursion with all required fields | Must have |
| FR16 | Admins can edit an existing excursion | Must have |
| FR17 | Admins can activate or deactivate an excursion | Must have |
| FR18 | Admins can view all bookings and update their status | Must have |
| FR19 | Admins can export booking data as a CSV file | Could have |
| FR20 | Admins can view platform statistics (bookings, revenue, capacity) | Should have |

### Non-Functional Requirements

| ID | Requirement | Priority |
|----|-------------|----------|
| NFR01 | Booking, reviews and favourites need the user to be logged in | Must have |
| NFR02 | Admin pages are only accessible to users with the ADMIN role | Must have |
| NFR03 | Forms validate input and show clear error messages before submitting | Must have |
| NFR04 | API responses come back within 3 seconds under normal conditions | Should have |
| NFR05 | The site works on mobile screen widths (375 px and above) | Should have |

---

## Test Cases

### Authentication

| TC | Req | Description | Steps | Expected | Actual | Result |
|----|-----|-------------|-------|----------|--------|--------|
| TC01 | FR01 | Register with valid data | Go to /register, fill name, email, password, submit | Redirected to login; account created | Redirected to login page | PASS |
| TC02 | FR01 | Register with a duplicate email | Try to register with an email already in the database | Error shown: email already in use | API returns conflict error; shown on form | PASS |
| TC03 | FR01 | Register with an invalid email | Type "notanemail" as the email, submit | Validation error before the API is called | Client-side check stops submission | PASS |
| TC04 | FR02 | Login with correct credentials | Go to /login, enter registered email and password | Authenticated and redirected to home | Session created, redirected | PASS |
| TC05 | FR02 | Login with wrong password | Enter valid email, wrong password | Error message: invalid credentials | Login error displayed on form | PASS |
| TC06 | FR03 | Log out | Click Logout while logged in | Session ends, back to home page | Session cleared, home page shown | PASS |

### Excursion Browsing

| TC | Req | Description | Steps | Expected | Actual | Result |
|----|-----|-------------|-------|----------|--------|--------|
| TC07 | FR04 | Browse as a guest | Go to /excursions without logging in | All active excursions listed with image, price, category | Cards rendered for all active records | PASS |
| TC08 | FR04 | Inactive excursions hidden | Admin deactivates one; guest visits /excursions | Deactivated excursion not in the list | isActive=false records filtered out | PASS |
| TC09 | FR05 | View excursion detail | Click an excursion card | Detail page shows description, price, duration, capacity, difficulty, meeting point, included/excluded items | All fields shown on /excursions/[slug] | PASS |

### Booking

| TC | Req | Description | Steps | Expected | Actual | Result |
|----|-----|-------------|-------|----------|--------|--------|
| TC10 | FR06 | Book an excursion | Log in, open an excursion, pick a date, add to cart, checkout | Booking created; unique reference number assigned | Booking record saved; number shown in history | PASS |
| TC11 | FR07 | Capacity limit enforced | Try to book more participants than remaining spots | Error returned; booking not created | API checks remaining capacity and returns 400 if exceeded | PASS |
| TC12 | FR07 | Blackout dates blocked | Try to book on a date in the excursion's blackout list | Date shown as unavailable | Availability endpoint excludes blackout dates | PASS |
| TC13 | FR08 | Unique booking numbers | Create two separate bookings | Each has a different booking number | Unique constraint on bookingNumber in the schema | PASS |
| TC14 | FR09 | Booking history | Go to /account/bookings after booking | All my bookings listed with date, status, excursion name | User-scoped query returns correct records | PASS |
| TC15 | NFR01 | Booking needs login | POST to /api/bookings/create with no session | 401 Unauthorized | Session check in route returns 401 | PASS |

### Favourites

| TC | Req | Description | Steps | Expected | Actual | Result |
|----|-----|-------------|-------|----------|--------|--------|
| TC16 | FR10 | Add to favourites | Log in, click the heart icon on an excursion | Excursion appears in /account/favorites | Favourite record created in DB | PASS |
| TC17 | FR11 | Remove from favourites | On /account/favorites click Remove | Excursion removed from the list | Record deleted; page updates | PASS |
| TC18 | NFR01 | Favourites needs login | GET /api/favorites with no session | 401 Unauthorized | API route requires a valid session | PASS |

### Contact Form

| TC | Req | Description | Steps | Expected | Actual | Result |
|----|-----|-------------|-------|----------|--------|--------|
| TC19 | FR12, FR13 | Submit a valid message | Fill in all contact fields, submit | Success message shown; record saved to DB | API returns success; record persisted | PASS |
| TC20 | FR12 | Missing required field | Leave the message blank, submit | Validation error shown | Zod schema returns 422 | PASS |
| TC21 | FR12 | Message too short | Type fewer than 10 characters in the message | Error: message too short | Zod min(10) fails with error message | PASS |

### Reviews

| TC | Req | Description | Steps | Expected | Actual | Result |
|----|-----|-------------|-------|----------|--------|--------|
| TC22 | FR14 | Submit a review | Log in, open an excursion, submit star rating and comment | Review saved and visible on the page | Review record created; duplicate per user blocked by unique constraint | PASS |
| TC23 | NFR01 | Review needs login | POST to /api/reviews with no session | 401 Unauthorized | Session check in route enforced | PASS |

### Admin — Excursion Management

| TC | Req | Description | Steps | Expected | Actual | Result |
|----|-----|-------------|-------|----------|--------|--------|
| TC24 | FR15 | Create excursion | Log in as admin, go to /admin/excursions/create, fill fields, submit | New excursion appears in public listing | Record created; slug auto-generated from title | PASS |
| TC25 | FR15 | Duplicate slug rejected | Create two excursions with the same title | Second one returns a 409 Conflict | API catches unique constraint violation | PASS |
| TC26 | FR16 | Edit excursion | Go to edit page, change the price, save | Updated price shown in public view | PUT endpoint updates the record | PASS |
| TC27 | FR17 | Deactivate excursion | Toggle excursion to inactive in admin list | Excursion disappears from public listing | isActive set to false; public API filters | PASS |
| TC28 | NFR02 | Admin route access control | Log in as a customer, try to go to /admin | Redirected to access-denied page | Middleware checks role and redirects | PASS |

### Admin — Booking Management

| TC | Req | Description | Steps | Expected | Actual | Result |
|----|-----|-------------|-------|----------|--------|--------|
| TC29 | FR18 | View all bookings | Log in as admin, go to /admin/bookings | All bookings from all users shown | Admin query returns unscoped results | PASS |
| TC30 | FR18 | Update booking status | Change a booking from Pending to Confirmed | Status updated; shown in customer's history too | PATCH to status endpoint updates the record | PASS |
| TC31 | FR19 | Export to CSV | Click Export in /admin/bookings | CSV file downloads with booking data | Route returns text/csv content type | PASS |

### Admin — Dashboard

| TC | Req | Description | Steps | Expected | Actual | Result |
|----|-----|-------------|-------|----------|--------|--------|
| TC32 | FR20 | Stats dashboard | Log in as admin, go to /admin | Total bookings, revenue and capacity shown correctly | Stats API returns aggregated data; capacity capped at 100% | PASS |

### Non-Functional

| TC | Req | Description | Steps | Expected | Actual | Result |
|----|-----|-------------|-------|----------|--------|--------|
| TC33 | NFR03 | Form validation | Submit registration form with no name | Inline error before API called | Client validation fires first | PASS |
| TC34 | NFR05 | Mobile layout | Open /excursions on a 390 px viewport | Cards stack vertically; nav works on small screen | Tailwind responsive layout renders correctly | PASS |

---

## Summary

| Area | TCs | Pass | Fail |
|------|-----|------|------|
| Authentication | 6 | 6 | 0 |
| Excursion Browsing | 3 | 3 | 0 |
| Booking | 6 | 6 | 0 |
| Favourites | 3 | 3 | 0 |
| Contact Form | 3 | 3 | 0 |
| Reviews | 2 | 2 | 0 |
| Admin — Excursions | 5 | 5 | 0 |
| Admin — Bookings | 3 | 3 | 0 |
| Admin — Dashboard | 1 | 1 | 0 |
| Non-Functional | 2 | 2 | 0 |
| **Total** | **34** | **34** | **0** |

All 34 test cases passed. The main bug I found during testing was that the booking API used
`prisma.$transaction()` which does not work with Supabase's pgbouncer connection pooler —
I rewrote that section to use sequential queries instead, which fixed the issue.

---

## Traceability

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
