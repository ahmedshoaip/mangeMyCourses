# EduManage Architecture

This document describes the refactored architecture of the EduManage project, focusing on state management and scalability.

## State Management: Zustand

We have migrated from React's `useState` and prop drilling to **Zustand**, a small, fast, and scalable bear-bone state-management solution.

### Why Zustand?
- **Simplicity**: Minimal boilerplate compared to Redux.
- **Performance**: Components only re-render when the specific state they subscribe to changes.
- **Scale**: Easy to split state into multiple dedicated stores.
- **Middleware**: Built-in support for persistence, devtools, and more.

## Store Structure

The state is divided into three main stores located in `src/store/`:

1.  **Student Store (`studentStore.ts`)**: Manages the list of students, including adding, updating, deleting, and retrieving students by ID.
2.  **Course Store (`courseStore.ts`)**: Manages the course catalog, pricing, and schedules.
3.  **Enrollment Store (`enrollmentStore.ts`)**: Manages the relationship between students and courses.

## State Flow

1.  **Subscription**: Components use custom hooks (e.g., `useStudentStore`) to access only the parts of the state they need.
2.  **Actions**: Functional actions (e.g., `addStudent`) are co-located within the stores, ensuring logic is centralized and reusable.
3.  **Persistence**: All stores use the `persist` middleware to automatically sync state with `localStorage`.
    -   `edumanage_students`
    -   `edumanage_courses`
    -   `edumanage_enrollments`

## Future Scalability

- **Modular Stores**: As the app grows, new stores can be added (e.g., `paymentStore`, `attendanceStore`) without affecting existing logic.
- **Selectors**: Use selectors in `useStore` to further optimize re-renders in complex components.
- **API Integration**: Zustand stores can easily be updated to handle asynchronous API calls using `async/await`.
- **Global IDs**: ID generation has been moved to `crypto.randomUUID()` for better collision resistance and consistency.

## Strict TypeScript

The project maintains strict TypeScript typing across all stores and components to ensure data integrity and catch errors at compile time.
