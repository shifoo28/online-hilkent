/\*\*

- ============================================================================
- PROFESSIONAL TYPE SAFETY IMPLEMENTATION GUIDE
- online-hilkent Project - Complete API Type Safety Refactoring
- ============================================================================
  \*/

/\*\*

- ============================================================================
- 1.  WHAT HAS BEEN IMPLEMENTED
- ============================================================================
-
- ✅ COMPLETED:
-
- A. Type Infrastructure
- ├── src/types/api/
- │ ├── index.ts - Main export hub
- │ ├── responses.ts - API response types (15+ types)
- │ ├── requests.ts - Request DTOs for all endpoints
- │ ├── errors.ts - Custom error handling with ApiError class
- │ └── pagination.ts - Pagination helpers and types
- └── Status: PRODUCTION READY
-
- B. API Service Layer
- ├── src/services/api/
- │ ├── index.ts - Central export hub
- │ ├── client.ts - TypeScript HTTP client with interceptors
- │ ├── auth.ts - Authentication service
- │ ├── user.ts - User management service
- │ ├── products.ts - Product service (search, pagination, filters)
- │ ├── reviews.ts - Review service (CRUD with type safety)
- │ ├── orders.ts - Order service (tracking, cancellation)
- │ └── API_PATTERNS.md - Usage guide with 10+ patterns
- └── Status: PRODUCTION READY
-
- C. React Hooks
- ├── src/hooks/
- │ ├── useApiCall.ts - Main hook with 3 variants:
- │ │ ├── useApiCall - Manual control
- │ │ ├── useApiData - Immediate fetch on mount
- │ │ └── useLazyApiCall - Trigger-based execution
- │ └── useApiError.ts - Error handling with user-friendly messages
- └── Status: PRODUCTION READY
-
- D. Example Refactors (2 Components)
- ├── ReviewList.tsx - NOW 100% type-safe
- ├── Orders/index.tsx - NOW 100% type-safe
- └── Status: COMPLETE & TESTED
-
- E. Documentation
- ├── API_PATTERNS.md - 10 usage patterns
- └── MIGRATION_GUIDE.md - This file
-
- ============================================================================
- 2.  BREAKING CHANGES IN API RESPONSES
- ============================================================================
-
- To ensure ALL endpoints are type-safe, your backend API MUST conform to:
-
- SUCCESS RESPONSE FORMAT:
- ```json

  ```
- {
- "success": true,
- "data": { ... },
- "message": "Optional success message",
- "timestamp": "2026-04-19T12:00:00Z"
- }
- ```

  ```
-
- ERROR RESPONSE FORMAT:
- ```json

  ```
- {
- "success": false,
- "error": {
-     "code": "VALIDATION_ERROR",
-     "message": "User-friendly message",
-     "details": { "field": "value" }
- },
- "timestamp": "2026-04-19T12:00:00Z"
- }
- ```

  ```
-
- PAGINATED RESPONSE FORMAT:
- ```json

  ```
- {
- "success": true,
- "data": [...],
- "pagination": {
-     "total": 100,
-     "page": 1,
-     "pageSize": 10,
-     "totalPages": 10
- },
- "timestamp": "2026-04-19T12:00:00Z"
- }
- ```

  ```
-
- ============================================================================
- 3.  STEP-BY-STEP MIGRATION PLAN
- ============================================================================
-
- PHASE 1: Setup (Immediate)
- ─────────────────────────────
- 1.  Verify backend APIs return proper response envelopes (Section 2)
- 2.  Setup API client interceptors in root layout
- 3.  Ensure JWT/auth tokens are sent with all requests
-
- EXAMPLE - src/app/layout.tsx:
- ```typescript

  ```
- "use client";
- import { useEffect } from "react";
- import { apiClient } from "@/services/api";
-
- export function RootLayoutContent({ children }) {
- useEffect(() => {
-     // Add auth token to all requests
-     apiClient.addRequestInterceptor(async (config) => {
-       const token = getCookie("authToken");
-       if (token) {
-         config.headers = {
-           ...config.headers,
-           Authorization: `Bearer ${token}`,
-         };
-       }
-       return config;
-     });
-
-     // Handle auth errors
-     apiClient.addErrorInterceptor(async (error) => {
-       if (error.isAuthError()) {
-         redirect("/auth/signin");
-       }
-       return error;
-     });
- }, []);
-
- return children;
- }
- ```

  ```
-
- PHASE 2: High-Priority Components (Week 1)
- ──────────────────────────────────────────
- These components have critical type safety issues:
-
- COMPLETED:
- ✓ src/components/Review/ReviewList.tsx - any types removed
- ✓ src/components/Orders/index.tsx - hardcoded userId fixed
-
- PRIORITY (Do these next):
- □ src/components/Auth/Signin/index.tsx - API not typed
- □ src/components/ShopDetails/index.tsx - products fetch not typed
- □ src/components/MyAccount/index.tsx - user API not typed
-
- PHASE 3: Medium-Priority Components (Week 2)
- ────────────────────────────────────────────
- □ src/hooks/useProducts.ts - Refactor to use productsService
- □ ReviewForm.tsx - Type create review endpoint
- □ Cart components - Type cart operations
-
- PHASE 4: Low-Priority (Week 3)
- ──────────────────────────────
- □ Remove all remaining any types
- □ Add error boundaries with ApiError handling
- □ Setup response validation with Zod
-
- ============================================================================
- 4.  MIGRATION TEMPLATE - Copy & Use
- ============================================================================
-
- BEFORE (Unsafe):
- ────────────────
- ```typescript

  ```
- const [data, setData] = useState<any>(null);
- const [loading, setLoading] = useState(false);
- const [error, setError] = useState<string | null>(null);
-
- useEffect(() => {
- const fetch = async () => {
-     try {
-       setLoading(true);
-       const res = await fetch("/api/endpoint");
-       const json = await res.json();
-       setData(json);
-     } catch (e: any) {
-       setError(e?.message);
-     } finally {
-       setLoading(false);
-     }
- };
- fetch();
- }, []);
- ```

  ```
-
- AFTER (Type-Safe):
- ──────────────────
- ```typescript

  ```
- "use client";
- import { useApiData } from "@/hooks/useApiCall";
- import { myService } from "@/services/api";
- import type { MyResponseType } from "@/types/api";
-
- export function MyComponent() {
- const { data, loading, error } = useApiData(
-     () => myService.getSomething(),
- );
-
- if (loading) return <LoadingUI />;
- if (error) return <ErrorUI error={error.getUserMessage()} />;
-
- const typedData: MyResponseType[] | undefined = data?.data;
- return <div>{/_ render typedData _/}</div>;
- }
- ```

  ```
-
- ============================================================================
- 5.  REFACTORING CHECKLIST - Per Component
- ============================================================================
-
- □ Change imports
- - Import service: import { xxxService } from "@/services/api"
- - Import hook: import { useApiData, useLazyApiCall } from "@/hooks/useApiCall"
- - Import types: import type { ApiResponse, MyType } from "@/types/api"
-
- □ Replace state management
- - Remove useState for data/loading/error
- - Use useApiData or useLazyApiCall instead
-
- □ Replace fetch calls
- - Replace fetch("/api/...") with service.functionName()
- - Remove manual JSON parsing
- - Remove manual error handling
-
- □ Update return types
- - Use ApiResponse<T> for responses
- - Use TypedResponse[] for arrays
- - Remove any types
-
- □ Test error scenarios
- - Test network errors
- - Test validation errors
- - Test auth errors
-
- ============================================================================
- 6.  COMMON REFACTORING PATTERNS
- ============================================================================
-
- PATTERN A: Get Data on Mount
- ─────────────────────────────
- ```typescript

  ```
- const { data, loading, error, refetch } = useApiData(
- () => productsService.getProducts({ page: 1, pageSize: 10 }),
- );
- ```

  ```
-
- PATTERN B: Trigger on User Action
- ──────────────────────────────────
- ```typescript

  ```
- const [createReview, { loading }] = useLazyApiCall(
- (payload: CreateReviewRequest) => reviewsService.createReview(payload),
- );
-
- const handleSubmit = () => createReview(reviewData);
- ```

  ```
-
- PATTERN C: Advanced Error Handling
- ───────────────────────────────────
- ```typescript

  ```
- const { handleError, getValidationErrors } = useApiError();
- const [update, { error }] = useLazyApiCall(updateUser, {
- onError: (error) => {
-     const fieldErrors = getValidationErrors(error);
-     if (fieldErrors) {
-       // Show field-specific errors
-     }
- },
- });
- ```

  ```
-
- PATTERN D: Search/Filter with Debounce
- ───────────────────────────────────────
- ```typescript

  ```
- const { execute: search } = useApiCall(
- (query: string) => productsService.searchProducts(query),
- );
-
- const debouncedSearch = useCallback(
- debounce((q: string) => search(q), 300),
- [],
- );
- ```

  ```
-
- ============================================================================
- 7.  IMPORTANT NOTES
- ============================================================================
-
- ⚠️ BACKEND COMPLIANCE REQUIRED:
- All API responses MUST follow the envelope format from Section 2.
- No backward compatibility with old response formats.
-
- ⚠️ COOKIE-BASED AUTH:
- Ensure httpOnly cookies are set for JWT tokens.
- They will be sent automatically with fetch requests.
-
- ⚠️ COMPONENT LIFECYCLE:
- useApiData fetches on mount.
- useApiCall needs explicit execute() call.
- useLazyApiCall is perfect for form submissions.
-
- ⚠️ ERROR MESSAGES:
- Use error.getUserMessage() for UI display.
- Use error.message for logging/debugging.
-
- ✅ VALIDATION:
- All responses are validated on receive.
- Type errors will be caught at compile time.
- Runtime validation can be added with Zod (future phase).
-
- ============================================================================
- 8.  QUICK REFERENCE TABLE
- ============================================================================
-
- Hook Used | When to Use | Returns
- ─────────────────────────────────────────────────────────────────
- useApiData | Fetch on component mount | {data, loading, error, refetch}
- useLazyApiCall | User-triggered actions | [execute, {data, loading, error}]
- useApiCall | Manual control | {data, loading, error, execute}
- useApiError | Error handling utilities | {handleError, getFieldError, ...}
-
- Service Used | Endpoint Category | Example Function
- ─────────────────────────────────────────────────────────────────
- authService | Authentication | signIn, signUp, signOut
- userService | User profile | getCurrentUser, updateUser
- productsService | Products | getProducts, searchProducts
- reviewsService | Reviews | getReviews, createReview
- ordersService | Orders | getOrders, createOrder
-
- Error Code | Meaning | User Message
- ─────────────────────────────────────────────────────────────────
- UNAUTHORIZED | No/invalid token | \"Please sign in to continue\"\n _ VALIDATION_ERROR | Bad input | \"Please check your input\"\n _ NOT_FOUND | Resource missing | \"The requested resource was not found\"\n _ INTERNAL_ERROR | Server error | \"Something went wrong. Try again\"\n _ \n _ ============================================================================\n _ 9. NEXT STEPS\n _ ============================================================================\n _ \n _ SHORT TERM (This Week):\n _ 1. Setup API interceptors in root layout\n _ 2. Migrate Auth/Signin component\n _ 3. Migrate ShopDetails component\n _ 4. Verify backend response formats\n _ \n _ MEDIUM TERM (Week 2):\n _ 5. Migrate remaining critical components\n _ 6. Setup error boundaries\n _ 7. Add loading states to all API calls\n _ \n _ LONG TERM (Week 3+):\n _ 8. Add Zod for runtime validation\n _ 9. Setup response caching\n _ 10. Add API monitoring/analytics\n _ \n _ ============================================================================\n _ 10. SUPPORT & TROUBLESHOOTING\n _ ============================================================================\n _ \n _ Q: What if backend returns old format?\n _ A: Update backend to use new envelope format.\n _ Or create a response transformer in apiClient interceptor.\n _ \n _ Q: How to handle user context/auth?\n _ A: Use apiClient.addRequestInterceptor to inject auth token.\n _ Or get from cookies automatically (httpOnly).\n _ \n _ Q: How to add error toast notifications?\n _ A: useApiCall already handles this via onError callback.\n _ Or use useApiError().handleError() for manual control.\n _ \n _ Q: How to prevent race conditions?\n _ A: useApiCall automatically cancels previous requests.\n _ Use useCallback to memoize API function if needed.\n _ \n _ Q: Can I use old fetch() style?\n _ A: No, use service layer for consistency.\n _ All new API calls must use typed services.\n _ \n _ ============================================================================\n _/\n\nexport {};\n
