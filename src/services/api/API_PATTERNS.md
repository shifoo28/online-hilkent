/\*\*

- API Type Safety Guide & Implementation Patterns
- Professional type-safe API patterns for online-hilkent project
  \*/

/\*\*

- ============================================================================
- 1.  BASIC SETUP & IMPORTS
- ============================================================================
-
- Import the API services and hooks in your components:
-
- ```typescript

  ```
- import {
- productsService,
- authService,
- reviewsService,
- ordersService,
- userService
- } from "@/services/api";
-
- import { useApiCall, useApiData, useLazyApiCall } from "@/hooks/useApiCall";
- import { useApiError } from "@/hooks/useApiError";
- import type {
- ApiResponse,
- ProductResponse,
- CreateReviewRequest
- } from "@/types/api";
- ```
  */
  ```

/\*\*

- ============================================================================
- 2.  PATTERN 1: Immediate Data Fetching (useApiData)
- ============================================================================
-
- Use when you want to fetch data automatically on component mount
-
- BEFORE (Unsafe):
- ```typescript

  ```
- const [products, setProducts] = useState([]);
- const [loading, setLoading] = useState(true);
- const [error, setError] = useState<string | null>(null);
-
- useEffect(() => {
- const fetchProducts = async () => {
-     try {
-       const res = await fetch(`/api/products?page=1&pageSize=10`);
-       const data = await res.json();
-       setProducts(data.map((p: any) => p)); // No validation!
-     } catch (err: any) {
-       setError(err?.message ?? "Unknown error");
-     } finally {
-       setLoading(false);
-     }
- };
- fetchProducts();
- }, []);
- ```

  ```
-
- AFTER (Type-safe):
- ```typescript

  ```
- "use client";
- import { useApiData } from "@/hooks/useApiCall";
- import { productsService } from "@/services/api";
- import type { ProductResponse } from "@/types/api";
-
- export function ProductsList() {
- const { data, loading, error, refetch } = useApiData(
-     () => productsService.getProducts({ page: 1, pageSize: 10 }),
- );
-
- if (loading) return <div>Loading...</div>;
- if (error) return <div>Error: {error.getUserMessage()}</div>;
-
- const products: ProductResponse[] | undefined = data?.data;
-
- return (
-     <div>
-       {products?.map((product) => (
-         <div key={product.id}>{product.Translations[0]?.name}</div>
-       ))}
-       <button onClick={() => refetch()}>Refresh</button>
-     </div>
- );
- }
- ```
  */
  ```

/\*\*

- ============================================================================
- 3.  PATTERN 2: Lazy API Calls (useLazyApiCall)
- ============================================================================
-
- Use when you want to trigger API calls on user action (form submit, button click)
-
- BEFORE (Unsafe):
- ```typescript

  ```
- const handleCreateReview = async () => {
- try {
-     const response = await fetch("/api/reviews", {
-       method: "POST",
-       headers: { "Content-Type": "application/json" },
-       body: JSON.stringify({
-         productId: id,
-         rating,
-         comment,
-       }),
-     });
-
-     const data = await response.json();
-     if (data.error) setError(data.error); // No type safety
- } catch (err: any) {
-     setError(err?.message); // Runtime error possible
- }
- };
- ```

  ```
-
- AFTER (Type-safe):
- ```typescript

  ```
- "use client";
- import { useLazyApiCall } from "@/hooks/useApiCall";
- import { useApiError } from "@/hooks/useApiError";
- import { reviewsService } from "@/services/api";
- import type { CreateReviewRequest, ReviewResponse } from "@/types/api";
-
- export function ReviewForm({ productId }: { productId: string }) {
- const [createReview, { loading, error }] = useLazyApiCall(
-     (payload: CreateReviewRequest) => reviewsService.createReview(payload),
-     {
-       onSuccess: (data) => {
-         toast.success("Review created successfully");
-         // data.data is guaranteed to be ReviewResponse
-       },
-       onError: (error) => {
-         toast.error(error.getUserMessage());
-       },
-     },
- );
-
- const handleSubmit = async (e: React.FormEvent) => {
-     e.preventDefault();
-     await createReview({
-       productId,
-       rating: 5,
-       comment: "Great product!",
-     });
- };
-
- return (
-     <form onSubmit={handleSubmit}>
-       <button type="submit" disabled={loading}>
-         {loading ? "Submitting..." : "Submit Review"}
-       </button>
-     </form>
- );
- }
- ```
  */
  ```

/\*\*

- ============================================================================
- 4.  PATTERN 3: Manual Control (useApiCall)
- ============================================================================
-
- Use when you need full manual control over when and how to execute
-
- ```typescript

  ```
- "use client";
- import { useApiCall } from "@/hooks/useApiCall";
- import { productsService } from "@/services/api";
-
- export function SearchProducts() {
- const { execute, data, loading } = useApiCall(
-     (query: string) => productsService.searchProducts(query),
- );
-
- const handleSearch = debounce((query: string) => {
-     if (query.length > 2) {
-       execute(query);
-     }
- }, 300);
-
- return (
-     <input
-       type="text"
-       placeholder="Search products..."
-       onChange={(e) => handleSearch(e.target.value)}
-     />
- );
- }
- ```
  */
  ```

/\*\*

- ============================================================================
- 5.  PATTERN 4: Error Handling with Details
- ============================================================================
-
- ```typescript

  ```
- "use client";
- import { useApiCall } from "@/hooks/useApiCall";
- import { useApiError } from "@/hooks/useApiError";
- import { userService } from "@/services/api";
-
- export function UpdateProfileForm() {
- const { handleError, getFieldError, isValidation } = useApiError();
- const [updateUser, { loading }] = useLazyApiCall(
-     (payload) => userService.updateUser(payload),
-     {
-       onError: (error) => {
-         // Error is automatically shown as toast
-         // but we can also handle it here
-         if (isValidation(error)) {
-           // Show field-specific errors
-           console.log("Validation errors:", error.fieldErrors);
-         }
-       },
-     },
- );
-
- const handleSubmit = async (e: React.FormEvent) => {
-     e.preventDefault();
-     try {
-       await updateUser({
-         name: "John",
-         email: "john@example.com",
-       });
-     } catch (error) {
-       const { message } = handleError(error, {
-         showToast: true,
-         userMessage: "Failed to update profile",
-       });
-     }
- };
-
- return <form onSubmit={handleSubmit}>...</form>;
- }
- ```
  */
  ```

/\*\*

- ============================================================================
- 6.  API SERVICE USAGE - Direct Service Calls
- ============================================================================
-
- You can also use services directly in event handlers or server actions
-
- ```typescript

  ```
- // In Event Handler
- const handleDelete = async (productId: string) => {
- try {
-     const response = await productsService.deleteProduct(productId);
-     toast.success(response.message);
- } catch (error) {
-     if (isApiError(error)) {
-       toast.error(error.getUserMessage());
-     }
- }
- };
-
- // In Server Action
- "use server";
- export async function deleteUserAction(userId: string) {
- try {
-     const result = await userService.deleteAccount();
-     return { success: true };
- } catch (error) {
-     if (isApiError(error)) {
-       return { success: false, error: error.getUserMessage() };
-     }
-     throw error;
- }
- }
- ```
  */
  ```

/\*\*

- ============================================================================
- 7.  ADDING AUTH TOKEN INTERCEPTOR
- ============================================================================
-
- Setup in your app initialization (e.g., in layout or context)
-
- ```typescript

  ```
- "use client";
- import { useEffect } from "react";
- import { apiClient } from "@/services/api";
-
- export function ApiInitializer() {
- useEffect(() => {
-     // Add request interceptor to include auth token
-     apiClient.addRequestInterceptor(async (config) => {
-       const token = getCookieValue("authToken"); // or from context
-
-       if (token) {
-         config.headers = {
-           ...config.headers,
-           Authorization: `Bearer ${token}`,
-         };
-       }
-
-       return config;
-     });
-
-     // Add error interceptor to handle auth errors
-     apiClient.addErrorInterceptor(async (error) => {
-       if (error.isAuthError()) {
-         // Redirect to login
-         window.location.href = "/auth/signin";
-       }
-       return error;
-     });
- }, []);
-
- return null;
- }
- ```
  */
  ```

/\*\*

- ============================================================================
- 8.  TYPED PAGINATION EXAMPLE
- ============================================================================
-
- ```typescript

  ```
- import {
- validatePaginationParams,
- getPaginationQuery,
- PaginatedApiResponse
- } from "@/types/api";
- import { productsService } from "@/services/api";
-
- export async function handleProductSearch(
- searchTerm: string,
- page: number = 1,
- pageSize: number = 10,
- ) {
- // Validate pagination
- const { page: validPage, pageSize: validPageSize } = validatePaginationParams(
-     page,
-     pageSize,
- );
-
- // Get typed response
- const response: PaginatedApiResponse<ProductResponse> =
-     await productsService.searchProducts(searchTerm, {
-       page: validPage,
-       pageSize: validPageSize,
-       sortBy: "recent",
-     });
-
- // Use metadata for pagination controls
- const { hasNextPage, hasPreviousPage, totalPages } = response.pagination;
-
- return {
-     products: response.data, // Fully typed ProductResponse[]
-     pagination: response.pagination,
- };
- }
- ```
  */
  ```

/\*\*

- ============================================================================
- 9.  TYPE GUARDS FOR SAFE CODE
- ============================================================================
-
- ```typescript

  ```
- import { isApiError, isValidationError } from "@/types/api";
-
- export function handleApiError(error: unknown) {
- if (isApiError(error)) {
-     if (error.isAuthError()) {
-       // Handle auth error
-     } else if (error.isValidationError()) {
-       // Handle validation error
-     }
- } else if (isValidationError(error)) {
-     // Handle validation errors with field info
-     error.fieldErrors.forEach(fieldError => {
-       console.log(`${fieldError.field}: ${fieldError.message}`);
-     });
- }
- }
- ```
  */
  ```

/\*\*

- ============================================================================
- 10. MIGRATION CHECKLIST
- ============================================================================
-
- To migrate existing components to use type-safe API:
-
- ✓ 1. Replace direct fetch() calls with service functions
- ✓ 2. Replace useState for data/loading/error with useApiCall/useApiData
- ✓ 3. Add proper type annotations to component props and state
- ✓ 4. Use ApiError for error handling
- ✓ 5. Use ApiResponse<T> for response types
- ✓ 6. Remove any type: any annotations
- ✓ 7. Setup request/error interceptors in app initialization
- ✓ 8. Test error handling paths
- ✓ 9. Add loading and error UI states
- ✓ 10. Document API usage in component comments
  \*/

export {};
